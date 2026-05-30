import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env if present
try {
  const env = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  for (const line of env.split("\n")) {
    const [k, ...v] = line.split("=");
    if (k && v.length) process.env[k.trim()] = v.join("=").trim();
  }
} catch {}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const conn = await mysql.createConnection(url);
const [result] = await conn.execute(
  "UPDATE users SET role = 'admin' WHERE email = 'ekita@pcmovers.ca'"
);
console.log("Rows affected:", result.affectedRows);

if (result.affectedRows === 0) {
  // Show existing users to help diagnose
  const [rows] = await conn.execute("SELECT id, email, role FROM users LIMIT 20");
  console.log("Existing users:", rows);
}

await conn.end();
