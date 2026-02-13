import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInscriptionSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/inscriptions", async (_req, res) => {
    const inscriptions = await storage.getInscriptions();
    res.json(inscriptions);
  });

  app.post("/api/inscriptions", async (req, res) => {
    const result = insertInscriptionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const inscription = await storage.createInscription(result.data);
    res.json(inscription);
  });

  app.patch("/api/inscriptions/:id/payment", async (req, res) => {
    const id = parseInt(req.params.id);
    const { confirmed } = req.body;
    const inscription = await storage.updateInscriptionPayment(id, confirmed);
    res.json(inscription);
  });

  app.delete("/api/inscriptions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteInscription(id);
    res.sendStatus(204);
  });

  app.post("/api/inscriptions/clear", async (_req, res) => {
    await storage.clearInscriptions();
    res.sendStatus(204);
  });

  app.get("/api/config/:key", async (req, res) => {
    const config = await storage.getConfig(req.params.key);
    res.json(config || { key: req.params.key, value: "" });
  });

  app.post("/api/config", async (req, res) => {
    const { key, value } = req.body;
    const config = await storage.setConfig(key, value);
    res.json(config);
  });

  return httpServer;
}
