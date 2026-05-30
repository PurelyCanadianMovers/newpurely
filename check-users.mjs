import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const db = await createConnection(process.env.DATABASE_URL);

const [rows] = await db.execute("SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC LIMIT 10");
console.log("Users in database:");
console.table(rows);

await db.end();
