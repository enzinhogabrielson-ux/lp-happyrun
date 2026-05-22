import { insertInscriptionSchema } from "../shared/schema.ts";
import { storage } from "../server/storage.ts";

const payload = {
  nome: "Test Name",
  telefone: "(15) 99999-9999",
  tamanho: "M",
  corCamisa: "Azul",
  trabalhaBandeiras: false,
  empresaBandeiras: "",
  presencaSpinning: false,
  pagamentoConfirmado: false
};

console.log("Validating payload with insertInscriptionSchema...");
const result = insertInscriptionSchema.safeParse(payload);
if (!result.success) {
  console.error("Schema validation failed:", result.error);
} else {
  console.log("Schema validation succeeded!", result.data);
  try {
    const created = await storage.createInscription(result.data);
    console.log("Database insertion succeeded!", created);
  } catch (error) {
    console.error("Database insertion failed:", error);
  }
}
process.exit(0);
