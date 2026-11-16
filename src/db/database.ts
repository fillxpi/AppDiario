import * as SQLite from 'expo-sqlite';

export type Entrada = {
  id: number;
  titulo: string;
  texto: string;
  humor: string;
  criadaEm: string;
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('diario.db').then(async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS entradas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          texto TEXT NOT NULL,
          humor TEXT NOT NULL,
          criada_em TEXT NOT NULL
        );
      `);
      return db;
    });
  }
  return dbPromise;
}

export async function listarEntradas(): Promise<Entrada[]> {
  const db = await getDb();
  return db.getAllAsync<Entrada>(
    'SELECT id, titulo, texto, humor, criada_em AS criadaEm FROM entradas ORDER BY id DESC'
  );
}

export async function criarEntrada(titulo: string, texto: string, humor: string) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO entradas (titulo, texto, humor, criada_em) VALUES (?, ?, ?, ?)',
    titulo,
    texto,
    humor,
    new Date().toISOString()
  );
}

export async function buscarEntrada(id: number) {
  const db = await getDb();
  return db.getFirstAsync<Entrada>(
    'SELECT id, titulo, texto, humor, criada_em AS criadaEm FROM entradas WHERE id = ?',
    id
  );
}

export async function atualizarEntrada(id: number, titulo: string, texto: string, humor: string) {
  const db = await getDb();
  await db.runAsync(
    'UPDATE entradas SET titulo = ?, texto = ?, humor = ? WHERE id = ?',
    titulo,
    texto,
    humor,
    id
  );
}

export async function apagarEntrada(id: number) {
  const db = await getDb();
  await db.runAsync('DELETE FROM entradas WHERE id = ?', id);
}