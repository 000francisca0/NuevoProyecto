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

function initializeDatabase() {
  db.serialize(() => {
    // Roles
    db.run(`CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT UNIQUE NOT NULL
    );`);

    // Usuarios (con apellidos)
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellidos TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      rol_id INTEGER,
      FOREIGN KEY (rol_id) REFERENCES roles(id)
    );`);

    // Direcciones
    db.run(`CREATE TABLE IF NOT EXISTS direcciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      calle TEXT NOT NULL,
      depto TEXT,
      region TEXT NOT NULL,
      comuna TEXT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );`);

    // Categorías
    db.run(`CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT UNIQUE NOT NULL
    );`);

    // Productos
    db.run(`CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      imagen_url TEXT,
      categoria_id INTEGER,
      on_sale INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    );`);

    // Imágenes extra
    db.run(`CREATE TABLE IF NOT EXISTS producto_imagenes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producto_id INTEGER NOT NULL,
      imagen_url TEXT NOT NULL,
      orden INTEGER NOT NULL,
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    );`);

    // Boletas
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

    // Boleta detalles
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

    // Seed: roles
    db.get('SELECT COUNT(*) AS c FROM roles', (e, r) => {
      if (e) return console.error(e.message);
      if (r.c === 0) {
        db.run("INSERT INTO roles (nombre) VALUES ('Administrador')");
        db.run("INSERT INTO roles (nombre) VALUES ('Cliente')");
      }
    });

    // Seed: categorías
    db.get('SELECT COUNT(*) AS c FROM categorias', (e, r) => {
      if (e) return console.error(e.message);
      if (r.c === 0) {
        db.run("INSERT INTO categorias (nombre) VALUES ('Osos de Peluche')");
        db.run("INSERT INTO categorias (nombre) VALUES ('Animales de Granja')");
        db.run("INSERT INTO categorias (nombre) VALUES ('Criaturas Marinas')");
      }
    });

    // Seed: productos (con stock)
    const initialProducts = [
      { nombre: 'Oso Clásico de Peluche', descripcion: 'El clásico y fiel amigo de peluche.', precio: 19990, stock: 15, imagen_url: '/osito.jpg', categoria_id: 1, on_sale: 1 },
      { nombre: 'Conejo Saltarin Suave', descripcion: 'Ideal para abrazar, con orejas largas y suaves.', precio: 15990, stock: 22, imagen_url: '/conejo.jpg', categoria_id: 2, on_sale: 0 },
      { nombre: 'Panda Abrazable', descripcion: 'Un panda de bambú suave, perfecto para todas las edades.', precio: 18990, stock: 8, imagen_url: '/panda.jpg', categoria_id: 2, on_sale: 1 },
      { nombre: 'Perezoso Colgante', descripcion: 'Con velcro en sus manos, ideal para colgar y abrazar.', precio: 21990, stock: 10, imagen_url: '/peresozo.jpg', categoria_id: null, on_sale: 0 },
      { nombre: 'Dinosaurio Rex Amigable', descripcion: 'Un t-rex de peluche, menos feroz y más tierno.', precio: 22990, stock: 5, imagen_url: '/rex.jpg', categoria_id: null, on_sale: 0 },
      { nombre: 'Delfín Sonriente', descripcion: 'Una criatura marina con una gran sonrisa.', precio: 14990, stock: 18, imagen_url: '/delfin.jpg', categoria_id: 3, on_sale: 0 },
    ];
    db.get('SELECT COUNT(*) AS c FROM productos', (e, r) => {
      if (e) return console.error(e.message);
      if (r.c === 0) {
        const st = db.prepare(`INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, on_sale) VALUES (?,?,?,?,?,?,?)`);
        initialProducts.forEach(p => st.run(p.nombre, p.descripcion, p.precio, p.stock, p.imagen_url, p.categoria_id, p.on_sale));
        st.finalize();
      }
    });

    // Seed: admin (email: admin@duoc.cl / pass: admin123)
    const adminPasswordHash = '$2a$10$wNnI.m9bQ4R0k/P4.hRj.p8oJ1/G9q7H5.Z0Y6S2P.2V4Y8O4W.1'; // bcrypt('admin123')
    const adminEmail = 'admin@duoc.cl';
    db.get('SELECT COUNT(*) AS c FROM usuarios WHERE email = ?', [adminEmail], (err, row) => {
      if (err) return console.error(err.message);
      if (row.c === 0) {
        db.run(`INSERT INTO usuarios (nombre, apellidos, email, password_hash, rol_id) VALUES (?,?,?,?,?)`,
          ['Admin', 'Peluchemania', adminEmail, adminPasswordHash, 1],
          function (insErr) {
            if (insErr) return console.error(insErr.message);
            const uid = this.lastID;
            db.run(`INSERT INTO direcciones (usuario_id, calle, depto, region, comuna) VALUES (?,?,?,?,?)`,
              [uid, 'Av. Siempre Viva 742', 'Oficina 101', 'Región Metropolitana de Santiago', 'Santiago']);
          });
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
