import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Minimal server for Azure App Service: serves the built SPA from dist/ and
// hosts the API. App Service provides PORT. Add backend routes under /api
// (e.g. an ElevenLabs text-to-speech proxy that keeps the API key server-side).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");
const port = process.env.PORT || 3000;

const app = express();

// ---- API routes ----
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---- Static SPA + client-side routing fallback ----
app.use(express.static(distDir));
app.use((req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, () => {
  console.log(`FirstStepReading server listening on port ${port}`);
});
