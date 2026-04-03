import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

type SqliteDb = InstanceType<typeof Database>;

function shouldUseSqlite(): boolean {
  if (process.env.VERCEL) return false;
  if (process.env.AGENTOPS_DISABLE_LOCAL_DB === 'true') return false;
  return true;
}

let db: SqliteDb | null = null;
let sqliteUnavailable = false;

function openDb(): SqliteDb | null {
  if (sqliteUnavailable) return null;
  if (!shouldUseSqlite()) return null;
  if (db) return db;

  try {
    const baseDir = process.env.AGENTOPS_DATA_DIR
      ? path.join(process.env.AGENTOPS_DATA_DIR, 'data')
      : path.join(process.cwd(), 'data');
    mkdirSync(baseDir, { recursive: true });
    const dbPath = path.join(baseDir, 'agentops.db');
    const instance = new Database(dbPath);
    instance.pragma('journal_mode = WAL');
    instance.exec(`
      CREATE TABLE IF NOT EXISTS store_kv (
        collection TEXT NOT NULL,
        id TEXT NOT NULL,
        json TEXT NOT NULL,
        PRIMARY KEY (collection, id)
      );
    `);
    db = instance;
    console.log(`[agentops] local store: ${dbPath}`);
    return db;
  } catch (err) {
    sqliteUnavailable = true;
    console.warn(
      `[agentops] SQLite unavailable (${(err as Error).message}); using in-memory store only`,
    );
    return null;
  }
}

export function loadCollection(collection: string): Array<[string, unknown]> {
  const database = openDb();
  if (!database) return [];

  const rows = database
    .prepare('SELECT id, json FROM store_kv WHERE collection = ?')
    .all(collection) as { id: string; json: string }[];

  const out: Array<[string, unknown]> = [];
  for (const row of rows) {
    try {
      out.push([row.id, JSON.parse(row.json) as unknown]);
    } catch {
      /* skip corrupt row */
    }
  }
  return out;
}

export function persistUpsert(collection: string, id: string, value: unknown): void {
  const database = openDb();
  if (!database) return;
  database
    .prepare(
      `INSERT INTO store_kv (collection, id, json) VALUES (?, ?, ?)
       ON CONFLICT(collection, id) DO UPDATE SET json = excluded.json`,
    )
    .run(collection, id, JSON.stringify(value));
}

export function persistDelete(collection: string, id: string): void {
  const database = openDb();
  if (!database) return;
  database.prepare('DELETE FROM store_kv WHERE collection = ? AND id = ?').run(collection, id);
}
