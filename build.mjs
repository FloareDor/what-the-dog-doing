import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcPath = path.join(__dirname, "src", "index.html");
const outPath = path.join(__dirname, "build", "index.html");
const spriteDirName = "black_scottish_terrier_dog_with_red_scarf";
const spriteSrcDir = path.join(__dirname, "src", spriteDirName);
const spriteOutDir = path.join(__dirname, "build", spriteDirName);
const spriteFiles = [
  "rotations/east.png",
  "rotations/west.png",
  "rotations/north-east.png",
  "rotations/north-west.png",
  "rotations/south-east.png",
  "rotations/south-west.png",
];
const extraStaticFiles = ["leaderboard.html", "leaderboard-config.js"];

const raw = await fs.readFile(srcPath, "utf8");

const scriptMatch = raw.match(/<script>([\s\S]*?)<\/script>/i);
const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/i);

if (!scriptMatch || !styleMatch) {
  throw new Error("Expected one inline <style> and one inline <script>");
}

const jsRaw = scriptMatch[1];
const cssRaw = styleMatch[1];

const minCss = cssRaw
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{}:;,>])\s*/g, "$1")
  .replace(/;}/g, "}")
  .trim();

let minJs = jsRaw;
try {
  const terserUrl = pathToFileURL(path.join(__dirname, "..", "clawstrike", "node_modules", "terser", "dist", "bundle.min.js")).href;
  const terser = await import(terserUrl);
  const result = await terser.minify(jsRaw, {
    compress: {
      passes: 3,
      unsafe: true,
      ecma: 2020,
    },
    mangle: {
      toplevel: true,
    },
    ecma: 2020,
  });
  if (result.code) minJs = result.code;
} catch {
  // Syntax-safe fallback for environments where terser isn't available
  // (e.g., GitHub Actions without sibling repos). Keep raw JS.
  minJs = jsRaw;
}

let out = raw
  .replace(styleMatch[0], `<style>${minCss}</style>`)
  .replace(scriptMatch[0], `<script>${minJs}</script>`)
  .replace(/>\s+</g, "><")
  .trim();

out = "<!doctype html>" + out.replace(/^<!doctype html>/i, "");

await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, out, "utf8");

await fs.rm(spriteOutDir, { recursive: true, force: true });
for (const rel of spriteFiles) {
  const src = path.join(spriteSrcDir, rel);
  const dst = path.join(spriteOutDir, rel);
  await fs.mkdir(path.dirname(dst), { recursive: true });
  await fs.copyFile(src, dst);
}

for (const fileName of extraStaticFiles) {
  const src = path.join(__dirname, "src", fileName);
  const dst = path.join(__dirname, "build", fileName);
  await fs.copyFile(src, dst);
}

const srcBytes = Buffer.byteLength(raw);
const outBytes = Buffer.byteLength(out);
console.log(`build done: ${srcBytes} -> ${outBytes} bytes`);
console.log(`copied sprites: ${spriteFiles.length} files`);
console.log(`copied static files: ${extraStaticFiles.length}`);
