// server/index.js (ACTUALIZADO: migraciones completas + seeding + rutas)

import express from 'express';
import cors from 'cors';
import { db } from './database.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// MIGRACIONES + SEED
// ----------------------------------------------------

// ----------------------------------------------------
// DB SETUP / MIGRATIONS
// ----------------------------------------------------

// Helper: add a column if it doesn't exist (SQLite)
function ensureColumn(table, column, type, cb) {
  db.all(`PRAGMA table_info(${table});`, [], (err, rows) => {
    if (err) {
      console.error(`Error reading PRAGMA table_info(${table}):`, err.message);
      return cb && cb(err);
    }
    const hasCol = rows.some(r => r.name === column);
    if (hasCol) return cb && cb(null);

    const alter = `ALTER TABLE ${table} ADD COLUMN ${column} ${type};`;
    db.run(alter, [], (e) => {
      if (e) console.error(`Error adding column ${column} to ${table}:`, e.message);
      else console.log(`Added column ${column} to ${table}`);
      cb && cb(e);
    });
  });
}

function initializeDatabase() {
  db.serialize(() => {
    // 1. Roles
    db.run(`CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT UNIQUE NOT NULL
    );`);

    // 2. Usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellidos TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      rol_id INTEGER,
      FOREIGN KEY (rol_id) REFERENCES roles(id)
    );`);

    // 3. Categorias
    db.run(`CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT UNIQUE NOT NULL
    );`);

    // 4. Productos (includes discount_percentage)
    db.run(`CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      imagen_url TEXT,
      categoria_id INTEGER,
      on_sale INTEGER NOT NULL DEFAULT 0,
      discount_percentage REAL,         -- 0..1 (nullable)
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    );`);

    // If DB existed before, add the new column
    ensureColumn('productos', 'discount_percentage', 'REAL', () => {});

    // 5. Producto_imagenes
    db.run(`CREATE TABLE IF NOT EXISTS producto_imagenes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producto_id INTEGER NOT NULL,
      imagen_url TEXT NOT NULL,
      orden INTEGER NOT NULL,
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    );`);

    // 6. Direcciones
    db.run(`CREATE TABLE IF NOT EXISTS direcciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      calle TEXT NOT NULL,
      depto TEXT,
      region TEXT NOT NULL,
      comuna TEXT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );`);

    // 7. Boletas
    db.run(`CREATE TABLE IF NOT EXISTS boletas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
      total REAL NOT NULL,
      calle_envio TEXT NOT NULL,
      depto_envio TEXT,
      region_envio TEXT NOT NULL,
      comuna_envio TEXT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );`);

    // 8. Boleta_Detalles
    db.run(`CREATE TABLE IF NOT EXISTS boleta_detalles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      boleta_id INTEGER NOT NULL,
      producto_id INTEGER NOT NULL,
      nombre_producto TEXT NOT NULL,
      precio_unitario REAL NOT NULL,
      cantidad INTEGER NOT NULL,
      imagen_url TEXT,
      FOREIGN KEY (boleta_id) REFERENCES boletas(id),
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    );`);

    // --- SEEDING ---

    // Roles
    db.get('SELECT COUNT(*) AS count FROM roles', (err, row) => {
      if (!err && row.count === 0) {
        db.run("INSERT INTO roles (nombre) VALUES ('Administrador')");
        db.run("INSERT INTO roles (nombre) VALUES ('Cliente')");
      }
    });

    // Categorías EXACTAS: Osos (1), Animales (2), Fantasía (3)
    db.get('SELECT COUNT(*) AS count FROM categorias', (err, row) => {
      if (!err && row.count === 0) {
        db.run("INSERT INTO categorias (nombre) VALUES ('Osos')");      // id 1
        db.run("INSERT INTO categorias (nombre) VALUES ('Animales')");  // id 2
        db.run("INSERT INTO categorias (nombre) VALUES ('Fantasía')");  // id 3
      }
    });

    // Productos iniciales EXACTOS + algunos descuentos de ejemplo
    const initialProducts = [
      { nombre: 'Oso Clásico de Peluche',       descripcion: 'El clásico y fiel amigo de peluche.', precio: 19990, stock: 15, imagen_url: '/osito.jpg',      categoria_id: 1, on_sale: 0, discount_percentage: 0.25 },
      { nombre: 'Conejo Saltarin Suave',        descripcion: 'Ideal para abrazar, orejas largas.',  precio: 15990, stock: 22, imagen_url: '/conejo.jpg',     categoria_id: 2, on_sale: 0, discount_percentage: 0.00 },
      { nombre: 'Dinosaurio Rex Amigable',      descripcion: 'Un T-Rex muy amigable.',              precio: 22990, stock: 5,  imagen_url: '/dinosaurio.jpg', categoria_id: 2, on_sale: 0, discount_percentage: 0.10 },
      { nombre: 'Unicornio Mágico Brillante',   descripcion: 'Brilla con magia.',                   precio: 24990, stock: 8,  imagen_url: '/unicornio.jpg',  categoria_id: 3, on_sale: 0, discount_percentage: 0.15 },
      { nombre: 'Panda',                         descripcion: 'Panda de bambú suave.',              precio: 18990, stock: 12, imagen_url: '/panda.jpg',       categoria_id: 1, on_sale: 0, discount_percentage: 0.20 },
      { nombre: 'Perezoso',                      descripcion: 'Para abrazos lentos.',               precio: 21990, stock: 10, imagen_url: '/peresozo.jpg',    categoria_id: 2, on_sale: 0, discount_percentage: null },
    ];

    db.get('SELECT COUNT(*) AS count FROM productos', (err, row) => {
      if (err) return console.error('Error counting productos:', err.message);
      if (row.count === 0) {
        const stmt = db.prepare(`INSERT INTO productos 
          (nombre, descripcion, precio, stock, imagen_url, categoria_id, on_sale, discount_percentage) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        initialProducts.forEach(p => {
          stmt.run(
            p.nombre, p.descripcion || null, p.precio, p.stock,
            p.imagen_url || null, p.categoria_id || null, p.on_sale ? 1 : 0,
            p.discount_percentage == null ? null : p.discount_percentage
          );
        });
        stmt.finalize(() => console.log('Initial products seeded.'));
      }
    });
  });
}

initializeDatabase();

// ----------------------------------------------------
// RUTAS
// ----------------------------------------------------
app.get('/', (_req, res) => res.send('API de Peluchemania funcionando!'));

app.use('/api/productos', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/checkout', checkoutRoutes);

// ----------------------------------------------------
// START
// ----------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
