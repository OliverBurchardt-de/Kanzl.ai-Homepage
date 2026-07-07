// Minimaler, abhängigkeitsfreier statischer Server für die lokale Vorschau.
// Start: npm start  ->  http://localhost:4173
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PORT = process.env.PORT || 4173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (path.endsWith("/")) path += "index.html";
    const filePath = normalize(join(ROOT, path));
    if (!filePath.startsWith(ROOT)) { res.writeHead(403).end("Forbidden"); return; }

    let target = filePath;
    try {
      const s = await stat(target);
      if (s.isDirectory()) target = join(target, "index.html");
    } catch {
      if (!extname(target)) target += ".html";
    }

    const data = await readFile(target);
    res.writeHead(200, { "content-type": TYPES[extname(target)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end("<h1>404 — nicht gefunden</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`Kanzl.ai läuft auf http://localhost:${PORT}`);
});
