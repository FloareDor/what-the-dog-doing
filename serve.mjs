import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "build");
const port = 8000;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  try {
    let reqPath = (req.url || "/").split("?")[0];
    if (reqPath === "/") reqPath = "/index.html";
    const safePath = path.normalize(reqPath).replace(/^([\\/])+/g, "");
    const diskPath = path.join(root, safePath);

    if (!diskPath.startsWith(root)) {
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
