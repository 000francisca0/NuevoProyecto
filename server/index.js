// server/index.js (ACTUALIZADO: Con productos iniciales y categorías)

import express from 'express';
import cors from 'cors';
import { db } from './database.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js'; 

const app = express();
const PORT = 3001; 

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// 💡 DATOS INICIALES (PARA POBLAR LA DB)
// NOTA: Se ha añadido el campo 'categoria_id'
// ----------------------------------------------------
const initialProducts = [
  // Categoria 1: Oso
  { nombre: 'Oso Clásico de Peluche', precio: 19990.00, imagen_url: '/osito.jpg', categoria_id: 1 },
  // Categoria 2: Animales
  { nombre: 'Conejo Saltarin Suave', precio: 15990.00, imagen_url: '/conejo.jpg', categoria_id: 2 },
  { nombre: 'Panda', precio: 18990.00, imagen_url: 'panda.jpg', categoria_id: 2 },
  { nombre: 'Perezoso', precio: 21990.00, imagen_url: '/peresozo.jpg', categoria_id: 2 },
  // Categoria 3: Fantasía
  { nombre: 'Dinosaurio Rex Amigable', precio: 22990.00, imagen_url: '/dinosaurio.jpg', categoria_id: 3 },
  { nombre: 'Unicornio Mágico Brillante', precio: 24990.00, imagen_url: 'unicornio.jpg', categoria_id: 3 },
];


// ----------------------------------------------------
// 3. Inicializar Base de Datos y Creación de Tablas
// ----------------------------------------------------

// 1. Tabla Roles
db.run(`
  CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
  )
`, (err) => {
  if (err) { console.error('Error al crear tabla roles:', err.message); return; }
  db.run("INSERT OR IGNORE INTO roles (id, nombre) VALUES (1, 'Administrador'), (2, 'Cliente')", (err) => {
    if (err) { console.error('Error al insertar roles:', err.message); return; }
    console.log('Roles iniciales verificados.');
  });
});

// 2. Tabla Categorías
db.run(`
  CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
  )
`, (err) => {
    if (err) { console.error('Error al crear tabla categorias:', err.message); return; }
    // Insertar categorías iniciales
    db.run("INSERT OR IGNORE INTO categorias (id, nombre) VALUES (1, 'Oso'), (2, 'Animales'), (3, 'Fantasía')", (err) => {
        if (err) { console.error('Error al insertar categorías:', err.message); }
        else { console.log('Categorías iniciales verificadas.'); }
    });
});


// 3. Tabla Usuarios
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
  if (err) { console.error('Error al crear tabla usuarios:', err.message); }
  else { console.log('Tabla de usuarios lista o creada.'); }
});

// 4. Tabla Productos (CON LÓGICA DE POBLACIÓN)
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
    console.error('Error al crear tabla productos:', err.message);
  } else {
    console.log('Tabla de productos lista o creada.');
    
    // Lógica para poblar la tabla si está vacía
    db.get("SELECT COUNT(*) as count FROM productos", (err, row) => {
      if (err) { console.error('Error al contar productos:', err.message); return; }
      
      if (row.count === 0) {
        console.log('Insertando productos iniciales...');
        initialProducts.forEach((product) => {
          // Asignamos una descripción y stock por defecto
          const descripcion = `Un adorable peluche de ${product.nombre}. Perfecto para abrazar.`;
          const stock = 50; 

          db.run("INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id) VALUES (?, ?, ?, ?, ?, ?)",
            [product.nombre, descripcion, product.precio, stock, product.imagen_url, product.categoria_id],
            (insertErr) => {
              if (insertErr) { console.error(`Error insertando ${product.nombre}:`, insertErr.message); }
            });
        });
        console.log('✅ Productos iniciales insertados para pruebas.');
      }
    });
  }
});


// ----------------------------------------------------
// 5. Rutas de la API
// ----------------------------------------------------
app.use('/api/productos', productRoutes);
app.use('/api/auth', authRoutes); 

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express.js escuchando en http://localhost:${PORT}`);
});