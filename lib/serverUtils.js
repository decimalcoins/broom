import fs from "fs";
import path from "path";

const DATA_DIR = process.env.PROJECT_DATA_DIR || path.resolve(process.cwd(), "project_data");

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readJson(name) {
  ensureDataDir();
  const p = path.join(DATA_DIR, name);
  if (!fs.existsSync(p)) return {};
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch (e) {
    return {};
  }
}

export function writeJson(name, obj) {
  ensureDataDir();
  const p = path.join(DATA_DIR, name);
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), "utf-8");
  return true;
}
