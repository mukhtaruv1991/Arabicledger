// server/localAuth.ts

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage"; // سنحتاج إلى storage للتفاعل مع قاعدة البيانات
import { getSession } from "./replitAuth"; // سنعيد استخدام نفس إعدادات الجلسة

export async function setupLocalAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession()); // نستخدم نفس إعدادات الجلسة
  app.use(passport.initialize());
  app.use(passport.session());

  // استراتيجية تسجيل الدخول
  passport.use(new LocalStrategy(
    {
      usernameField: 'login', // الحقل في الواجهة الأمامية سيحمل اسم 'login'
      passwordField: 'password'
    },
    async (login, password, done) => {
      try {
        // البحث عن المستخدم بالبريد أو اسم المستخدم أو الرقم
        const user = await storage.findAuthUserByLogin(login);
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }

        // مقارنة كلمة المرور
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  // تخزين المستخدم في الجلسة
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // استرجاع المستخدم من الجلسة
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.findAuthUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // --- مسارات API ---

  // مسار تسجيل حساب جديد
  app.post('/api/auth/signup', async (req, res, next) => {
    try {
      const { fullName, email, username, phone, password, role, organizationName, adminEmail } = req.body;

      // التحقق من أن المستخدم غير موجود
      const existingUser = await storage.findAuthUserByLogin(email) || await storage.findAuthUserByLogin(username);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }

      // تشفير كلمة المرور
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // إنشاء المستخدم الجديد
      const newUser = await storage.createAuthUser({
        fullName,
        email,
        username,
        phone,
        hashedPassword,
        role,
        organizationName,
        adminEmail
      });

      // تسجيل دخول المستخدم الجديد تلقائيًا
      req.login(newUser, (err) => {
        if (err) { return next(err); }
        return res.status(201).json(newUser);
      });

    } catch (error) {
      next(error);
    }
  });

  // مسار تسجيل الدخول
  app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
    // إذا نجحت المصادقة، سيتم استدعاء هذا الجزء
    res.json(req.user);
  });

  // مسار تسجيل الخروج
  app.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
}

// Middleware للتحقق مما إذا كان المستخدم مسجلاً دخوله
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
