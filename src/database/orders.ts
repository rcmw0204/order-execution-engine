// src/database/orders.ts
import { pool } from "./db.js";

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY,
        payload JSONB,
        status TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        meta JSONB
      );
    `);
  } finally {
    client.release();
  }
}

export async function createOrderRecord(id: string, payload: any) {
  await pool.query(
    `INSERT INTO orders (id, payload, status) VALUES ($1, $2, $3)`,
    [id, payload, "queued"]
  );
}

export async function saveOrderUpdate(id: string, status: string, meta: any = {}) {
  await pool.query(
    `UPDATE orders SET status = $2, updated_at = NOW(), meta = COALESCE(meta, '{}'::jsonb) || $3 WHERE id = $1`,
    [id, status, JSON.stringify(meta)]
  );
}
