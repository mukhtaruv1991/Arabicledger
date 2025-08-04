import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';

function createDbPool() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set!");
  }

  // **هذا هو التعديل المهم**
  // الاتصال الداخلي في Railway لا يتطلب SSL
  return new pg.Pool({
    connectionString: databaseUrl,
    ssl: false, // <-- قمنا بتعطيل SSL
  });
}

const pool = createDbPool();
const PgStore = connectPgSimple(session);

function getSession() {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error("SESSION_SECRET environment variable is not set!");
  }

  return session({
    store: new PgStore({
      pool: pool,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    }
  });
}

// بقية الملف يبقى كما هو
export async function setupLocalAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
    { usernameField: 'login', passwordField: 'password' },
    async (login, password, done) => {
      try {
        const user = await storage.findAuthUserByLogin(login);
        if (!user) return done(null, false, { message: 'Incorrect username or password.' });
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) return done(null, false, { message: 'Incorrect username or password.' });
        return done(null, user);
      } catch (err) { return done(err); }
    }
  ));

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.findAuthUserById(id);
      done(null, user);
    } catch (err) { done(err); }
  });

  app.post('/api/auth/signup', async (req, res, next) => {
    try {
      const { fullName, email, username, phone, password } = req.body;
      const existingUser = await storage.findAuthUserByLogin(email) || await storage.findAuthUserByLogin(username);
      if (existingUser) return res.status(400).json({ message: 'User already exists.' });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await storage.createAuthUser({ fullName, email, username, phone, hashedPassword, role: 'user' });
      req.login(newUser, (err) => {
        if (err) return next(err);
        const { hashedPassword, ...userWithoutPassword } = newUser;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) { next(error); }
  });

  app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
    const { hashedPassword, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  app.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
      });
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
};
