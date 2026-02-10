import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "build");
const resolvedRoot = path.resolve(root);
const port = Number(process.env.PORT || 8000);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    let staticPath = requestUrl.pathname;
    if (staticPath === "/") staticPath = "/index.html";
    const safePath = path.normalize(staticPath).replace(/^([\\/])+/g, "");
    const diskPath = path.resolve(root, safePath);

    if (diskPath !== resolvedRoot && !diskPath.startsWith(`${resolvedRoot}${path.sep}`)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const data = await readFile(diskPath);
    res.setHeader("Content-Type", mime[path.extname(diskPath)] || "application/octet-stream");
    res.writeHead(200);
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`serving ${root} on http://localhost:${port}`);
});
