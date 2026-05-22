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

try {
  const res = await fetch("http://localhost:5000/api/inscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Body:", text);
} catch (err) {
  console.error("Fetch failed:", err);
}
process.exit(0);
