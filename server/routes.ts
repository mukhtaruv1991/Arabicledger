import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupTelegramBot } from "./telegramBot";
import {
  insertCompanySchema,
  insertAccountSchema,
  insertJournalEntrySchema,
  insertJournalEntryDetailSchema,
  insertTelegramSettingsSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Setup Telegram bot
  setupTelegramBot(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Company routes
  app.get('/api/companies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const companies = await storage.getCompanies(userId);
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get('/api/companies/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const company = await storage.getCompany(id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.post('/api/companies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const companyData = insertCompanySchema.parse({
        ...req.body,
        createdBy: userId,
      });
      const company = await storage.createCompany(companyData);
      res.status(201).json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ message: "Failed to create company" });
    }
  });

  app.put('/api/companies/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const companyData = insertCompanySchema.partial().parse(req.body);
      const company = await storage.updateCompany(id, companyData);
      res.json(company);
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ message: "Failed to update company" });
    }
  });

  app.delete('/api/companies/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCompany(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting company:", error);
      res.status(500).json({ message: "Failed to delete company" });
    }
  });

  // Account routes
  app.get('/api/companies/:companyId/accounts', isAuthenticated, async (req: any, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const accounts = await storage.getAccounts(companyId);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      res.status(500).json({ message: "Failed to fetch accounts" });
    }
  });

  app.get('/api/accounts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const account = await storage.getAccount(id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(account);
    } catch (error) {
      console.error("Error fetching account:", error);
      res.status(500).json({ message: "Failed to fetch account" });
    }
  });

  app.post('/api/accounts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const accountData = insertAccountSchema.parse({
        ...req.body,
        createdBy: userId,
      });
      
      // Check if account code already exists
      const existingAccount = await storage.getAccountByCode(accountData.code, accountData.companyId);
      if (existingAccount) {
        return res.status(400).json({ message: "Account code already exists" });
      }

      const account = await storage.createAccount(accountData);
      res.status(201).json(account);
    } catch (error) {
      console.error("Error creating account:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.put('/api/accounts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const accountData = insertAccountSchema.partial().parse(req.body);
      const account = await storage.updateAccount(id, accountData);
      res.json(account);
    } catch (error) {
      console.error("Error updating account:", error);
      res.status(500).json({ message: "Failed to update account" });
    }
  });

  app.delete('/api/accounts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAccount(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // Journal Entry routes
  app.get('/api/companies/:companyId/journal-entries', isAuthenticated, async (req: any, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const entries = await storage.getJournalEntries(companyId, limit);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.get('/api/journal-entries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const entry = await storage.getJournalEntry(id);
      if (!entry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      res.status(500).json({ message: "Failed to fetch journal entry" });
    }
  });

  const journalEntryWithDetailsSchema = z.object({
    entry: insertJournalEntrySchema,
    details: z.array(insertJournalEntryDetailSchema),
  });

  app.post('/api/journal-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { entry, details } = journalEntryWithDetailsSchema.parse(req.body);
      
      // Validate that total debits equal total credits
      const totalDebit = details.reduce((sum, detail) => sum + Number(detail.debit || 0), 0);
      const totalCredit = details.reduce((sum, detail) => sum + Number(detail.credit || 0), 0);
      
      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return res.status(400).json({ message: "Total debits must equal total credits" });
      }

      const entryData = {
        ...entry,
        createdBy: userId,
        totalDebit: totalDebit.toString(),
        totalCredit: totalCredit.toString(),
      };

      const journalEntry = await storage.createJournalEntry(entryData, details);
      res.status(201).json(journalEntry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ message: "Failed to create journal entry" });
    }
  });

  app.put('/api/journal-entries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { entry, details } = journalEntryWithDetailsSchema.parse(req.body);
      
      // Validate that total debits equal total credits
      const totalDebit = details.reduce((sum, detail) => sum + Number(detail.debit || 0), 0);
      const totalCredit = details.reduce((sum, detail) => sum + Number(detail.credit || 0), 0);
      
      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return res.status(400).json({ message: "Total debits must equal total credits" });
      }

      const entryData = {
        ...entry,
        totalDebit: totalDebit.toString(),
        totalCredit: totalCredit.toString(),
      };

      const journalEntry = await storage.updateJournalEntry(id, entryData, details);
      res.json(journalEntry);
    } catch (error) {
      console.error("Error updating journal entry:", error);
      res.status(500).json({ message: "Failed to update journal entry" });
    }
  });

  app.delete('/api/journal-entries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteJournalEntry(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      res.status(500).json({ message: "Failed to delete journal entry" });
    }
  });

  // Financial summary routes
  app.get('/api/companies/:companyId/financial-summary', isAuthenticated, async (req: any, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const summary = await storage.getFinancialSummary(companyId);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching financial summary:", error);
      res.status(500).json({ message: "Failed to fetch financial summary" });
    }
  });

  app.get('/api/companies/:companyId/account-balances', isAuthenticated, async (req: any, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const balances = await storage.getAccountBalances(companyId);
      res.json(balances);
    } catch (error) {
      console.error("Error fetching account balances:", error);
      res.status(500).json({ message: "Failed to fetch account balances" });
    }
  });

  // Telegram bot routes
  app.get('/api/companies/:companyId/telegram-settings', isAuthenticated, async (req: any, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const settings = await storage.getTelegramSettings(companyId);
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching telegram settings:", error);
      res.status(500).json({ message: "Failed to fetch telegram settings" });
    }
  });

  app.post('/api/telegram-settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settingsData = insertTelegramSettingsSchema.parse({
        ...req.body,
        createdBy: userId,
      });
      const settings = await storage.upsertTelegramSettings(settingsData);
      res.json(settings);
    } catch (error) {
      console.error("Error saving telegram settings:", error);
      res.status(500).json({ message: "Failed to save telegram settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
