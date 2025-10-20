// server/index.js (UPDATED with migrations and initial data)

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { db } from './database.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// INITIAL DATA
// ----------------------------------------------------
const initialProducts = [
  { nombre: 'Oso Clásico de Peluche', precio: 19990.00, imagen_url: '/osito.jpg', categoria_id: 1, on_sale: 1 },
  { nombre: 'Conejo Saltarin Suave', precio: 15990.00, imagen_url: '/conejo.jpg', categoria_id: 2, on_sale: 0 },
  { nombre: 'Panda', precio: 18990.00, imagen_url: '/panda.jpg', categoria_id: 2, on_sale: 1 },
  { nombre: 'Perezoso', precio: 21990.00, imagen_url: '/peresozo.jpg', categoria_id: 2, on_sale: 0 },
  { nombre: 'Dinosaurio Rex Amigable', precio: 22990.00, imagen_url: '/dinosaurio.jpg', categoria_id: 3, on_sale: 0 },
  { nombre: 'Unicornio Mágico Brillante', precio: 24990.00, imagen_url: '/unicornio.jpg', categoria_id: 3, on_sale: 0 },
];

// ----------------------------------------------------
// DB MIGRATIONS & TABLE CREATION (safe & idempotent)
// ----------------------------------------------------
db.serialize(() => { 
  // 1) roles
  db.run(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY,
      nombre TEXT NOT NULL UNIQUE
    )
  `, (err) => {
    if (err) return console.error('Error creating roles table:', err.message);
    db.run("INSERT OR IGNORE INTO roles (id, nombre) VALUES (1, 'Administrador'), (2, 'Cliente')", (err) => {
      if (err) console.error('Error inserting roles:', err.message);
      else console.log('Roles ensured.');
    });
  });

  // 2) categorias
  db.run(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY,
      nombre TEXT NOT NULL UNIQUE
    )
  `, (err) => {
    if (err) return console.error('Error creating categorias table:', err.message);
    db.run("INSERT OR IGNORE INTO categorias (id, nombre) VALUES (1, 'Oso'), (2, 'Animales'), (3, 'Fantasía')", (err) => {
      if (err) console.error('Error inserting categorias:', err.message);
      else console.log('Categorias ensured.');
    });
  });

  // 3) usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      rol_id INTEGER NOT NULL,
      direccion_envio TEXT,
      FOREIGN KEY (rol_id) REFERENCES roles(id)
    )
  `, (err) => {
    if (err) console.error('Error creating usuarios table:', err.message);
    else console.log('Usuarios table ready.');
  });

  // 4) productos (ensure table exists - we'll migrate columns after)
  db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      stock INTEGER NOT NULL,
      imagen_url TEXT,
      categoria_id INTEGER,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating productos table:', err.message);
      return;
    }
    console.log('Productos table ready.');

    // Check if on_sale column exists; if not, add it
    db.all("PRAGMA table_info(productos)", (pragmaErr, columns) => {
      if (pragmaErr) {
        console.error('Error reading productos table info:', pragmaErr.message);
        return;
      }
      const hasOnSale = columns.some(col => col.name === 'on_sale');
      if (!hasOnSale) {
        db.run("ALTER TABLE productos ADD COLUMN on_sale INTEGER DEFAULT 0", (alterErr) => {
          if (alterErr) console.error('Error adding on_sale column:', alterErr.message);
          else console.log('on_sale column added to productos (if previously missing).');
        });
      } else {
        console.log('on_sale column already exists.');
      }

      // After ensuring column exists, populate initial data if needed
      db.get("SELECT COUNT(*) as count FROM productos", (countErr, row) => {
        if (countErr) {
          console.error('Error counting productos:', countErr.message);
          return;
        }
        if (row.count === 0) {
          console.log('Seeding initial productos...');
          const insertStmt = db.prepare("INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, on_sale) VALUES (?, ?, ?, ?, ?, ?, ?)");
          initialProducts.forEach((p) => {
            const descripcion = `Un adorable peluche: ${p.nombre}. Perfecto para abrazar.`;
            const stock = 50;
            insertStmt.run(p.nombre, descripcion, p.precio, stock, p.imagen_url, p.categoria_id, p.on_sale ? 1 : 0, (insErr) => {
              if (insErr) console.error(`Error inserting ${p.nombre}:`, insErr.message);
            });
          });
          insertStmt.finalize(() => {
            console.log('Initial products seeded.');
            // Optionally seed some product images
            seedProductImagesIfEmpty();
          });
        } else {
          // Ensure producto_imagenes exists even if productos already present
          seedProductImagesIfEmpty();
        }
      });
    });
  });

  // 5) producto_imagenes table for extra images
  db.run(`
    CREATE TABLE IF NOT EXISTS producto_imagenes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producto_id INTEGER NOT NULL,
      imagen_url TEXT NOT NULL,
      orden INTEGER DEFAULT 0,
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    )
  `, (err) => {
    if (err) console.error('Error creating producto_imagenes table:', err.message);
    else console.log('producto_imagenes table ensured.');
  });

}); // end serialize

// Helper to seed images if table empty
function seedProductImagesIfEmpty() {
  db.get("SELECT COUNT(*) as count FROM producto_imagenes", (err, row) => {
    if (err) {
      console.error('Error counting producto_imagenes:', err.message);
      return;
    }
    if (row.count === 0) {
      console.log('Seeding some example product images...');
      const images = [
        // for product 1 (Oso Clásico)
        { producto_id: 1, imagen_url: '/osito-1.jpg', orden: 0 },
        { producto_id: 1, imagen_url: '/osito-2.jpg', orden: 1 },
        // for product 2 (Conejo)
        { producto_id: 2, imagen_url: '/conejo-1.jpg', orden: 0 },
        // for product 3 (Panda)
        { producto_id: 3, imagen_url: '/panda-1.jpg', orden: 0 },
      ];
      const stmt = db.prepare("INSERT INTO producto_imagenes (producto_id, imagen_url, orden) VALUES (?, ?, ?)");
      images.forEach(img => {
        stmt.run(img.producto_id, img.imagen_url, img.orden, (insErr) => {
          if (insErr) console.error('Error inserting product image:', insErr.message);
        });
      });
      stmt.finalize(() => console.log('Product images seeded.'));
    } else {
      console.log('Product images already present.');
    }
  });
}

// ----------------------------------------------------
// RUTAS API
// ----------------------------------------------------
app.use('/api/productos', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express.js escuchando en http://localhost:${PORT}`);
});
