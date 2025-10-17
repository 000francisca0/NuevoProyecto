// server/database.js

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Crea la conexión a la base de datos y la exporta
// Usamos sqlite.verbose() para ver mensajes útiles en la consola
const db = new (sqlite3.verbose().Database)('./peluchemania.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite: peluchemania.db');
  }
});

// Se exporta la instancia de la base de datos
export { db };