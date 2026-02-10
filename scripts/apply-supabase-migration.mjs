import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env");
const migrationPath = path.join(rootDir, "supabase", "migrations", "0001_init_leaderboard.sql");

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const raw = readFileSync(filePath, "utf8");
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    out[key] = value;
  }
  return out;
}

const fileEnv = parseEnvFile(envPath);
const databaseUrl = process.env.DATABASE_URL || fileEnv.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing DATABASE_URL. Add DATABASE_URL to .env and rerun.");
  process.exit(1);
}

if (!existsSync(migrationPath)) {
  console.error(`Migration not found: ${migrationPath}`);
  process.exit(1);
}

const result = spawnSync(
  "psql",
  ["-v", "ON_ERROR_STOP=1", "-f", migrationPath, databaseUrl],
  { stdio: "inherit", shell: true }
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
