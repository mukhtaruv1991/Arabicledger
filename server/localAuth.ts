// المحتوى الكامل لملف server/localAuth.ts

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';

// --- إعداد الجلسة الجديد المستقل عن Replit ---
// نستخدم connect-sqlite3 لتخزين الجلسات في ملف قاعدة بيانات
const SQLiteStore = connectSqlite3(session);

// هذه الدالة تقوم بإنشاء وإعداد middleware الجلسة
function getSession() {
  // نقرأ مفتاح الجلسة السري من متغيرات البيئة
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    // إذا لم يتم تعيين المتغير، نطلق خطأ لمنع تشغيل التطبيق بإعدادات غير آمنة
    throw new Error("SESSION_SECRET environment variable is not set!");
  }

  return session({
    // إعدادات تخزين الجلسة في قاعدة بيانات SQLite
    store: new SQLiteStore({
      db: 'sessions.sqlite', // اسم ملف قاعدة البيانات الذي سيتم إنشاؤه
      dir: './db' // المجلد الذي سيتم تخزين الملف فيه (تأكد من وجوده)
    }),
    secret: sessionSecret,
    resave: false, // لا تعيد حفظ الجلسة إذا لم تتغير
    saveUninitialized: false, // لا تحفظ الجلسات الفارغة
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // صلاحية ملف تعريف الارتباط: 7 أيام
      // في بيئة الإنتاج (production), يجب أن تكون الكوكيز آمنة (secure)
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true, // تمنع الوصول للكوكيز من خلال JavaScript في المتصفح
      sameSite: 'lax' // حماية ضد هجمات CSRF
    }
  });
}
// --- نهاية إعداد الجلسة ---


export async function setupLocalAuth(app: Express) {
  // تمكين confianca no proxy (مهم عند النشر خلف بروكسي مثل Railway)
  app.set("trust proxy", 1);

  // استخدام middleware الجلسة الذي قمنا بإعداده
  app.use(getSession());

  // تهيئة Passport.js
  app.use(passport.initialize());
  app.use(passport.session());

  // إعداد استراتيجية المصادقة المحلية (اسم مستخدم وكلمة مرور)
  passport.use(new LocalStrategy(
    {
      usernameField: 'login', // الحقل الذي سيستخدم كاسم مستخدم (يمكن أن يكون email أو username)
      passwordField: 'password'
    },
    async (login, password, done) => {
      try {
        const user = await storage.findAuthUserByLogin(login);
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }
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

  // تخزين معرّف المستخدم في الجلسة عند تسجيل الدخول
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // استرجاع بيانات المستخدم الكاملة من قاعدة البيانات باستخدام المعرّف المخزن في الجلسة
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.findAuthUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // --- مسارات API للمصادقة ---

  // مسار تسجيل حساب جديد
  app.post('/api/auth/signup', async (req, res, next) => {
    try {
      const { fullName, email, username, phone, password, role, organizationName, adminEmail } = req.body;
      const existingUser = await storage.findAuthUserByLogin(email) || await storage.findAuthUserByLogin(username);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
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
      
      // تسجيل دخول المستخدم الجديد تلقائيًا بعد التسجيل
      req.login(newUser, (err) => {
        if (err) { return next(err); }
        // إزالة كلمة المرور المشفرة قبل إرسال بيانات المستخدم
        const { hashedPassword, ...userWithoutPassword } = newUser;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  // مسار تسجيل الدخول
  app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
    // إذا نجحت المصادقة، يتم إرجاع بيانات المستخدم
    const { hashedPassword, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
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
