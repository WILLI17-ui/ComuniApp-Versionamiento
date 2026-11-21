import { readFile } from 'node:fs/promises';
import { pool } from './pool.js';

// Crea las tablas a4_* si no existen.
const sql = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
await pool.query(sql);
console.log('Tablas de la Actividad 4 listas.');
await pool.end();
