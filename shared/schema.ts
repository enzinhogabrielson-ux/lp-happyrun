import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const inscriptions = sqliteTable("inscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  telefone: text("telefone").notNull(),
  tamanho: text("tamanho").notNull(),
  trabalhaBandeiras: integer("trabalha_bandeiras", { mode: 'boolean' }).notNull().default(false),
  empresaBandeiras: text("empresa_bandeiras"),
  presencaSpinning: integer("presenca_spinning", { mode: 'boolean' }).notNull().default(false),
  pagamentoConfirmado: integer("pagamento_confirmado", { mode: 'boolean' }).notNull().default(false),
  // SQLite doesnt have defaultNow() natively in drizzle the same way, we use standard text or integer for dates, or just default sql func
  dataInscricao: integer("data_inscricao", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const configs = sqliteTable("configs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertInscriptionSchema = createInsertSchema(inscriptions).omit({
  id: true,
  dataInscricao: true,
});

export const insertConfigSchema = createInsertSchema(configs).pick({
  key: true,
  value: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Inscription = typeof inscriptions.$inferSelect;
export type InsertInscription = z.infer<typeof insertInscriptionSchema>;
export type Config = typeof configs.$inferSelect;
export type InsertConfig = z.infer<typeof insertConfigSchema>;
