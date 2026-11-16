import * as SQLite from 'expo-sqlite';
import { criptografar, descriptografar } from '../utils/cripto';

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

async function decifrar(linha: Entrada): Promise<Entrada> {
  return {
    ...linha,
    titulo: await descriptografar(linha.titulo),
    texto: await descriptografar(linha.texto),
  };
}

export async function listarEntradas(): Promise<Entrada[]> {
  const db = await getDb();
  const linhas = await db.getAllAsync<Entrada>(
    'SELECT id, titulo, texto, humor, criada_em AS criadaEm FROM entradas ORDER BY id DESC'
  );
  return Promise.all(linhas.map(decifrar));
}

export async function buscarEntrada(id: number): Promise<Entrada | null> {
  const db = await getDb();
  const linha = await db.getFirstAsync<Entrada>(
    'SELECT id, titulo, texto, humor, criada_em AS criadaEm FROM entradas WHERE id = ?',
    id
  );
  return linha ? decifrar(linha) : null;
}

export async function criarEntrada(titulo: string, texto: string, humor: string) {
  const db = await getDb();
  const tituloCifrado = await criptografar(titulo);
  const textoCifrado = await criptografar(texto);
  await db.runAsync(
    'INSERT INTO entradas (titulo, texto, humor, criada_em) VALUES (?, ?, ?, ?)',
    tituloCifrado,
    textoCifrado,
    humor,
    new Date().toISOString()
  );
}

export async function atualizarEntrada(id: number, titulo: string, texto: string, humor: string) {
  const db = await getDb();
  const tituloCifrado = await criptografar(titulo);
  const textoCifrado = await criptografar(texto);
  await db.runAsync(
    'UPDATE entradas SET titulo = ?, texto = ?, humor = ? WHERE id = ?',
    tituloCifrado,
    textoCifrado,
    humor,
    id
  );
}

export async function apagarEntrada(id: number) {
  const db = await getDb();
  await db.runAsync('DELETE FROM entradas WHERE id = ?', id);
}