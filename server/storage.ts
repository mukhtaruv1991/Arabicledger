import {
  users,
  companies,
  accounts,
  journalEntries,
  journalEntryDetails,
  accountBalances,
  telegramSettings,
  authUsers, // --- إضافة جديدة ---
  type User,
  type UpsertUser,
  type Company,
  type InsertCompany,
  type Account,
  type InsertAccount,
  type JournalEntry,
  type InsertJournalEntry,
  type JournalEntryDetail,
  type InsertJournalEntryDetail,
  type AccountBalance,
  type TelegramSettings,
  type InsertTelegramSettings,
  type AuthUser, // --- إضافة جديدة ---
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sum, sql, or } from "drizzle-orm"; // --- إضافة or ---

export interface IStorage {
  // --- دوال جديدة للمصادقة المحلية ---
  findAuthUserByLogin(login: string): Promise<AuthUser | undefined>;
  findAuthUserById(id: number): Promise<AuthUser | undefined>;
  createAuthUser(userData: Omit<AuthUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<AuthUser>;

  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Company operations
  getCompanies(userId: string): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company>;
  deleteCompany(id: number): Promise<void>;

  // Account operations
  getAccounts(companyId: number): Promise<Account[]>;
  getAccount(id: number): Promise<Account | undefined>;
  getAccountByCode(code: string, companyId: number): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: number, account: Partial<InsertAccount>): Promise<Account>;
  deleteAccount(id: number): Promise<void>;

  // Journal Entry operations
  getJournalEntries(companyId: number, limit?: number): Promise<(JournalEntry & { details: (JournalEntryDetail & { account: Account })[] })[]>;
  getJournalEntry(id: number): Promise<(JournalEntry & { details: (JournalEntryDetail & { account: Account })[] }) | undefined>;
  createJournalEntry(entry: InsertJournalEntry, details: InsertJournalEntryDetail[]): Promise<JournalEntry>;
  updateJournalEntry(id: number, entry: Partial<InsertJournalEntry>, details?: InsertJournalEntryDetail[]): Promise<JournalEntry>;
  deleteJournalEntry(id: number): Promise<void>;

  // Balance operations
  getAccountBalances(companyId: number): Promise<AccountBalance[]>;
  updateAccountBalance(accountId: number, companyId: number): Promise<void>;

  // Financial summary operations
  getFinancialSummary(companyId: number): Promise<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalAccounts: number;
  }>;

  // Telegram operations
  getTelegramSettings(companyId: number): Promise<TelegramSettings | undefined>;
  upsertTelegramSettings(settings: InsertTelegramSettings): Promise<TelegramSettings>;
}

export class DatabaseStorage implements IStorage {
  // --- دوال المصادقة المحلية الجديدة ---
  async findAuthUserByLogin(login: string): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(
      or(
        eq(authUsers.email, login),
        eq(authUsers.username, login),
        eq(authUsers.phone, login)
      )
    );
    return user;
  }

  async findAuthUserById(id: number): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.id, id));
    return user;
  }

  async createAuthUser(userData: Omit<AuthUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<AuthUser> {
    const [newUser] = await db.insert(authUsers).values(userData).returning();
    return newUser;
  }

  // --- بقية الدوال تبقى كما هي ---

  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Company operations
  async getCompanies(userId: string): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.createdBy, userId));
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  async updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company> {
    const [updatedCompany] = await db
      .update(companies)
      .set({ ...company, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    return updatedCompany;
  }

  async deleteCompany(id: number): Promise<void> {
    await db.delete(companies).where(eq(companies.id, id));
  }

  // Account operations
  async getAccounts(companyId: number): Promise<Account[]> {
    return await db
      .select()
      .from(accounts)
      .where(eq(accounts.companyId, companyId))
      .orderBy(asc(accounts.code));
  }

  async getAccount(id: number): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    return account;
  }

  async getAccountByCode(code: string, companyId: number): Promise<Account | undefined> {
    const [account] = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.code, code), eq(accounts.companyId, companyId)));
    return account;
  }

  async createAccount(account: InsertAccount): Promise<Account> {
    const [newAccount] = await db.insert(accounts).values(account).returning();
    return newAccount;
  }

  async updateAccount(id: number, account: Partial<InsertAccount>): Promise<Account> {
    const [updatedAccount] = await db
      .update(accounts)
      .set({ ...account, updatedAt: new Date() })
      .where(eq(accounts.id, id))
      .returning();
    return updatedAccount;
  }

  async deleteAccount(id: number): Promise<void> {
    await db.delete(accounts).where(eq(accounts.id, id));
  }

  // Journal Entry operations
  async getJournalEntries(companyId: number, limit = 50): Promise<(JournalEntry & { details: (JournalEntryDetail & { account: Account })[] })[]> {
    const entries = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.companyId, companyId))
      .orderBy(desc(journalEntries.date))
      .limit(limit);

    const entriesWithDetails = await Promise.all(
      entries.map(async (entry) => {
        const details = await db
          .select({
            id: journalEntryDetails.id,
            journalEntryId: journalEntryDetails.journalEntryId,
            accountId: journalEntryDetails.accountId,
            debit: journalEntryDetails.debit,
            credit: journalEntryDetails.credit,
            description: journalEntryDetails.description,
            descriptionArabic: journalEntryDetails.descriptionArabic,
            createdAt: journalEntryDetails.createdAt,
            account: {
              id: accounts.id,
              code: accounts.code,
              name: accounts.name,
              nameArabic: accounts.nameArabic,
              type: accounts.type,
              subType: accounts.subType,
              parentId: accounts.parentId,
              level: accounts.level,
              isParent: accounts.isParent,
              isActive: accounts.isActive,
              companyId: accounts.companyId,
              createdBy: accounts.createdBy,
              createdAt: accounts.createdAt,
              updatedAt: accounts.updatedAt,
            },
          })
          .from(journalEntryDetails)
          .innerJoin(accounts, eq(journalEntryDetails.accountId, accounts.id))
          .where(eq(journalEntryDetails.journalEntryId, entry.id));

        return { ...entry, details };
      })
    );

    return entriesWithDetails;
  }

  async getJournalEntry(id: number): Promise<(JournalEntry & { details: (JournalEntryDetail & { account: Account })[] }) | undefined> {
    const [entry] = await db.select().from(journalEntries).where(eq(journalEntries.id, id));
    if (!entry) return undefined;

    const details = await db
      .select({
        id: journalEntryDetails.id,
        journalEntryId: journalEntryDetails.journalEntryId,
        accountId: journalEntryDetails.accountId,
        debit: journalEntryDetails.debit,
        credit: journalEntryDetails.credit,
        description: journalEntryDetails.description,
        descriptionArabic: journalEntryDetails.descriptionArabic,
        createdAt: journalEntryDetails.createdAt,
        account: {
          id: accounts.id,
          code: accounts.code,
          name: accounts.name,
          nameArabic: accounts.nameArabic,
          type: accounts.type,
          subType: accounts.subType,
          parentId: accounts.parentId,
          level: accounts.level,
          isParent: accounts.isParent,
          isActive: accounts.isActive,
          companyId: accounts.companyId,
          createdBy: accounts.createdBy,
          createdAt: accounts.createdAt,
          updatedAt: accounts.updatedAt,
        },
      })
      .from(journalEntryDetails)
      .innerJoin(accounts, eq(journalEntryDetails.accountId, accounts.id))
      .where(eq(journalEntryDetails.journalEntryId, entry.id));

    return { ...entry, details };
  }

  async createJournalEntry(entry: InsertJournalEntry, details: InsertJournalEntryDetail[]): Promise<JournalEntry> {
    const [newEntry] = await db.insert(journalEntries).values(entry).returning();

    const entryDetails = details.map(detail => ({
      ...detail,
      journalEntryId: newEntry.id,
    }));

    await db.insert(journalEntryDetails).values(entryDetails);

    for (const detail of details) {
      await this.updateAccountBalance(detail.accountId, entry.companyId);
    }

    return newEntry;
  }

  async updateJournalEntry(id: number, entry: Partial<InsertJournalEntry>, details?: InsertJournalEntryDetail[]): Promise<JournalEntry> {
    const [updatedEntry] = await db
      .update(journalEntries)
      .set({ ...entry, updatedAt: new Date() })
      .where(eq(journalEntries.id, id))
      .returning();

    if (details) {
      await db.delete(journalEntryDetails).where(eq(journalEntryDetails.journalEntryId, id));

      const entryDetails = details.map(detail => ({
        ...detail,
        journalEntryId: id,
      }));

      await db.insert(journalEntryDetails).values(entryDetails);

      for (const detail of details) {
        await this.updateAccountBalance(detail.accountId, updatedEntry.companyId);
      }
    }

    return updatedEntry;
  }

  async deleteJournalEntry(id: number): Promise<void> {
    const entry = await this.getJournalEntry(id);
    if (!entry) return;

    await db.delete(journalEntryDetails).where(eq(journalEntryDetails.journalEntryId, id));
    await db.delete(journalEntries).where(eq(journalEntries.id, id));

    for (const detail of entry.details) {
      await this.updateAccountBalance(detail.accountId, entry.companyId);
    }
  }

  // Balance operations
  async getAccountBalances(companyId: number): Promise<AccountBalance[]> {
    return await db
      .select()
      .from(accountBalances)
      .where(eq(accountBalances.companyId, companyId));
  }

  async updateAccountBalance(accountId: number, companyId: number): Promise<void> {
    const result = await db
      .select({
        totalDebit: sum(journalEntryDetails.debit),
        totalCredit: sum(journalEntryDetails.credit),
      })
      .from(journalEntryDetails)
      .innerJoin(journalEntries, eq(journalEntryDetails.journalEntryId, journalEntries.id))
      .where(
        and(
          eq(journalEntryDetails.accountId, accountId),
          eq(journalEntries.companyId, companyId)
        )
      );

    const totalDebit = Number(result[0]?.totalDebit || 0);
    const totalCredit = Number(result[0]?.totalCredit || 0);
    const netBalance = totalDebit - totalCredit;

    await db
      .insert(accountBalances)
      .values({
        accountId,
        companyId,
        debitBalance: totalDebit.toString(),
        creditBalance: totalCredit.toString(),
        netBalance: netBalance.toString(),
        lastUpdated: new Date(),
      })
      .onConflictDoUpdate({
        target: [accountBalances.accountId, accountBalances.companyId],
        set: {
          debitBalance: totalDebit.toString(),
          creditBalance: totalCredit.toString(),
          netBalance: netBalance.toString(),
          lastUpdated: new Date(),
        },
      });
  }

  // Financial summary operations
  async getFinancialSummary(companyId: number): Promise<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalAccounts: number;
  }> {
    const revenueResult = await db
      .select({
        total: sum(accountBalances.creditBalance),
      })
      .from(accountBalances)
      .innerJoin(accounts, eq(accountBalances.accountId, accounts.id))
      .where(
        and(
          eq(accountBalances.companyId, companyId),
          eq(accounts.type, 'revenue')
        )
      );

    const expenseResult = await db
      .select({
        total: sum(accountBalances.debitBalance),
      })
      .from(accountBalances)
      .innerJoin(accounts, eq(accountBalances.accountId, accounts.id))
      .where(
        and(
          eq(accountBalances.companyId, companyId),
          eq(accounts.type, 'expenses')
        )
      );

    const accountCountResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(accounts)
      .where(eq(accounts.companyId, companyId));

    const totalRevenue = Number(revenueResult[0]?.total || 0);
    const totalExpenses = Number(expenseResult[0]?.total || 0);
    const netProfit = totalRevenue - totalExpenses;
    const totalAccounts = Number(accountCountResult[0]?.count || 0);

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      totalAccounts,
    };
  }

  // Telegram operations
  async getTelegramSettings(companyId: number): Promise<TelegramSettings | undefined> {
    const [settings] = await db
      .select()
      .from(telegramSettings)
      .where(eq(telegramSettings.companyId, companyId));
    return settings;
  }

  async upsertTelegramSettings(settings: InsertTelegramSettings): Promise<TelegramSettings> {
    const [result] = await db
      .insert(telegramSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: telegramSettings.companyId,
        set: {
          ...settings,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
