// المحتوى الكامل لملف shared/schema.ts
import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// الكود القديم يبقى كما هو
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameArabic: varchar("name_arabic", { length: 255 }).notNull(),
  taxNumber: varchar("tax_number", { length: 50 }),
  address: text("address"),
  addressArabic: text("address_arabic"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  logo: varchar("logo"),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  nameArabic: varchar("name_arabic", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  subType: varchar("sub_type", { length: 50 }),
  parentId: integer("parent_id"),
  level: integer("level").default(1),
  isParent: boolean("is_parent").default(false),
  isActive: boolean("is_active").default(true),
  companyId: integer("company_id").notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  entryNumber: varchar("entry_number", { length: 50 }).notNull().unique(),
  date: timestamp("date").notNull(),
  description: text("description").notNull(),
  descriptionArabic: text("description_arabic").notNull(),
  reference: varchar("reference", { length: 100 }),
  totalDebit: decimal("total_debit", { precision: 15, scale: 2 }).notNull(),
  totalCredit: decimal("total_credit", { precision: 15, scale: 2 }).notNull(),
  companyId: integer("company_id").notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const journalEntryDetails = pgTable("journal_entry_details", {
  id: serial("id").primaryKey(),
  journalEntryId: integer("journal_entry_id").notNull(),
  accountId: integer("account_id").notNull(),
  debit: decimal("debit", { precision: 15, scale: 2 }).default("0"),
  credit: decimal("credit", { precision: 15, scale: 2 }).default("0"),
  description: text("description"),
  descriptionArabic: text("description_arabic"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accountBalances = pgTable("account_balances", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull(),
  companyId: integer("company_id").notNull(),
  debitBalance: decimal("debit_balance", { precision: 15, scale: 2 }).default("0"),
  creditBalance: decimal("credit_balance", { precision: 15, scale: 2 }).default("0"),
  netBalance: decimal("net_balance", { precision: 15, scale: 2 }).default("0"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const telegramSettings = pgTable("telegram_settings", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  botToken: varchar("bot_token", { length: 255 }),
  webhookUrl: varchar("webhook_url", { length: 500 }),
  isActive: boolean("is_active").default(false),
  allowedUsers: text("allowed_users"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- الإضافات الجديدة والآمنة ---
export const authRoleEnum = pgEnum('auth_role', ['user', 'admin', 'superadmin']);

export const authUsers = pgTable("auth_users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).unique(),
  hashedPassword: text("hashed_password").notNull(),
  role: authRoleEnum("role").default("user").notNull(),
  organizationName: varchar("organization_name", { length: 255 }),
  adminEmail: varchar("admin_email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// الكود القديم يبقى كما هو
export const usersRelations = relations(users, ({ many }) => ({
  companies: many(companies),
  journalEntries: many(journalEntries),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [companies.createdBy],
    references: [users.id],
  }),
  accounts: many(accounts),
  journalEntries: many(journalEntries),
  telegramSettings: many(telegramSettings),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  company: one(companies, {
    fields: [accounts.companyId],
    references: [companies.id],
  }),
  parent: one(accounts, {
    fields: [accounts.parentId],
    references: [accounts.id],
  }),
  children: many(accounts),
  journalEntryDetails: many(journalEntryDetails),
  balances: many(accountBalances),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one, many }) => ({
  company: one(companies, {
    fields: [journalEntries.companyId],
    references: [companies.id],
  }),
  createdByUser: one(users, {
    fields: [journalEntries.createdBy],
    references: [users.id],
  }),
  details: many(journalEntryDetails),
}));

export const journalEntryDetailsRelations = relations(journalEntryDetails, ({ one }) => ({
  journalEntry: one(journalEntries, {
    fields: [journalEntryDetails.journalEntryId],
    references: [journalEntries.id],
  }),
  account: one(accounts, {
    fields: [journalEntryDetails.accountId],
    references: [accounts.id],
  }),
}));

export const accountBalancesRelations = relations(accountBalances, ({ one }) => ({
  account: one(accounts, {
    fields: [accountBalances.accountId],
    references: [accounts.id],
  }),
  company: one(companies, {
    fields: [accountBalances.companyId],
    references: [companies.id],
  }),
}));

export const telegramSettingsRelations = relations(telegramSettings, ({ one }) => ({
  company: one(companies, {
    fields: [telegramSettings.companyId],
    references: [companies.id],
  }),
}));

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJournalEntryDetailSchema = createInsertSchema(journalEntryDetails).omit({
  id: true,
  createdAt: true,
});

export const insertTelegramSettingsSchema = createInsertSchema(telegramSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntryDetail = z.infer<typeof insertJournalEntryDetailSchema>;
export type JournalEntryDetail = typeof journalEntryDetails.$inferSelect;
export type InsertTelegramSettings = z.infer<typeof insertTelegramSettingsSchema>;
export type TelegramSettings = typeof telegramSettings.$inferSelect;
export type AccountBalance = typeof accountBalances.$inferSelect;

// --- أنواع ومخططات الإدخال الجديدة والآمنة ---
export const insertAuthUserSchema = createInsertSchema(authUsers, {
  email: z.string().email(),
}).omit({
  id: true,
  hashedPassword: true,
  createdAt: true,
  updatedAt: true,
});
export type AuthUser = typeof authUsers.$inferSelect;
