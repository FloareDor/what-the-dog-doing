import { promises as fs } from "node:fs";
import path from "node:path";
import { brotliCompressSync, constants as zc } from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.join(__dirname, "build");
const tarPath = path.join(buildDir, "game.tar");
const brPath = path.join(buildDir, "game.tar.br");

function writeOctal(buf, value, offset, len) {
  const s = Math.max(0, value).toString(8);
  const out = s.padStart(len - 1, "0") + "\0";
  buf.write(out.slice(0, len), offset, "ascii");
}

function tarHeader(name, size, mtime) {
  const b = Buffer.alloc(512, 0);
  b.write(name.slice(0, 100), 0, "utf8");
  writeOctal(b, 0o644, 100, 8);
  writeOctal(b, 0, 108, 8);
  writeOctal(b, 0, 116, 8);
  writeOctal(b, size, 124, 12);
  writeOctal(b, Math.floor(mtime / 1000), 136, 12);
  for (let i = 148; i < 156; i++) b[i] = 32;
  b[156] = "0".charCodeAt(0);
  b.write("ustar", 257, "ascii");
  b[262] = 0;
  b.write("00", 263, "ascii");

  let sum = 0;
  for (let i = 0; i < 512; i++) sum += b[i];
  const chk = sum.toString(8).padStart(6, "0");
  b.write(chk, 148, "ascii");
  b[154] = 0;
  b[155] = 32;
  return b;
}

async function listFiles(root, rel = "") {
  const dir = path.join(root, rel);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (e.name === "game.tar" || e.name === "game.tar.br") continue;
    const childRel = rel ? path.join(rel, e.name) : e.name;
    if (e.isDirectory()) out.push(...await listFiles(root, childRel));
    else if (e.isFile()) out.push(childRel);
  }
  return out;
}

const relFiles = await listFiles(buildDir);
const chunks = [];
let payloadBytes = 0;
for (const rel of relFiles) {
  const diskPath = path.join(buildDir, rel);
  const data = await fs.readFile(diskPath);
  const stat = await fs.stat(diskPath);
  const tarName = rel.replace(/\\/g, "/");
  const header = tarHeader(tarName, data.length, stat.mtimeMs);
  const padLen = (512 - (data.length % 512)) % 512;
  chunks.push(header, data, Buffer.alloc(padLen, 0));
  payloadBytes += data.length;
}
chunks.push(Buffer.alloc(1024, 0));
const tar = Buffer.concat(chunks);

await fs.writeFile(tarPath, tar);

const br = brotliCompressSync(tar, {
  params: {
    [zc.BROTLI_PARAM_QUALITY]: 11,
    [zc.BROTLI_PARAM_SIZE_HINT]: tar.length,
  },
});
await fs.writeFile(brPath, br);

const KB = 1024;
console.log(`files: ${relFiles.length}`);
console.log(`payload: ${payloadBytes} bytes`);
console.log(`game.tar: ${tar.length} bytes`);
console.log(`game.tar.br: ${br.length} bytes (${(br.length / KB).toFixed(2)} KiB)`);
console.log(`limit: 15360 bytes => ${br.length <= 15360 ? "PASS" : "FAIL"}`);
