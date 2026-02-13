import { inscriptions, type Inscription, type InsertInscription, users, type User, type InsertUser, configs, type Config, type InsertConfig } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Inscriptions
  getInscriptions(): Promise<Inscription[]>;
  createInscription(inscription: InsertInscription): Promise<Inscription>;
  updateInscriptionPayment(id: number, confirmed: boolean): Promise<Inscription | undefined>;
  deleteInscription(id: number): Promise<void>;
  clearInscriptions(): Promise<void>;

  // Configs
  getConfig(key: string): Promise<Config | undefined>;
  setConfig(key: string, value: string): Promise<Config>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getInscriptions(): Promise<Inscription[]> {
    return await db.select().from(inscriptions);
  }

  async createInscription(insertInscription: InsertInscription): Promise<Inscription> {
    const [inscription] = await db.insert(inscriptions).values(insertInscription).returning();
    return inscription;
  }

  async updateInscriptionPayment(id: number, confirmed: boolean): Promise<Inscription | undefined> {
    const [inscription] = await db.update(inscriptions)
      .set({ pagamentoConfirmado: confirmed })
      .where(eq(inscriptions.id, id))
      .returning();
    return inscription;
  }

  async deleteInscription(id: number): Promise<void> {
    await db.delete(inscriptions).where(eq(inscriptions.id, id));
  }

  async clearInscriptions(): Promise<void> {
    await db.delete(inscriptions);
  }

  async getConfig(key: string): Promise<Config | undefined> {
    const [config] = await db.select().from(configs).where(eq(configs.key, key));
    return config;
  }

  async setConfig(key: string, value: string): Promise<Config> {
    const existing = await this.getConfig(key);
    if (existing) {
      const [config] = await db.update(configs)
        .set({ value })
        .where(eq(configs.key, key))
        .returning();
      return config;
    }
    const [config] = await db.insert(configs).values({ key, value }).returning();
    return config;
  }
}

export const storage = new DatabaseStorage();
