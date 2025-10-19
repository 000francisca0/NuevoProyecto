// server/routes/productRoutes.js

import express from 'express';
import { db } from '../database.js'; // Importamos nuestra conexión

const router = express.Router();

// ------------------------------------------------------------------
// RUTA 1: LEER TODOS (READ All) - /api/productos
// ------------------------------------------------------------------
router.get('/', (req, res) => {
  const sql = "SELECT * FROM productos";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "success", data: rows });
  });
});

// ------------------------------------------------------------------
// RUTA: LEER POR CATEGORÍA - /api/productos/category/:categoryId
// ------------------------------------------------------------------
router.get('/category/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const sql = "SELECT * FROM productos WHERE categoria_id = ?";
  db.all(sql, [categoryId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "success", data: rows });
  });
});

// ------------------------------------------------------------------
// RUTA: PRODUCTOS EN OFERTA - /api/productos/on-sale
// ------------------------------------------------------------------
router.get('/on-sale', (req, res) => {
  const sql = "SELECT * FROM productos WHERE on_sale = 1";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "success", data: rows });
  });
});

// ------------------------------------------------------------------
// RUTA: DETALLES DEL PRODUCTO + IMÁGENES - /api/productos/:id/details
// ------------------------------------------------------------------
router.get('/:id/details', (req, res) => {
  const { id } = req.params;
  const productSql = "SELECT * FROM productos WHERE id = ?";
  db.get(productSql, [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    // Traer imágenes extra (si existen)
    const imagesSql = "SELECT imagen_url FROM producto_imagenes WHERE producto_id = ? ORDER BY orden ASC";
    db.all(imagesSql, [id], (imgErr, imgs) => {
      if (imgErr) {
        return res.status(500).json({ error: imgErr.message });
      }
      const imageUrls = imgs && imgs.length ? imgs.map(i => i.imagen_url) : [];
      res.json({ message: "success", data: { ...product, images: imageUrls } });
    });
  });
});

// ------------------------------------------------------------------
// RUTA 2 (CREAR): CREAR (CREATE) - /api/productos
// ------------------------------------------------------------------
router.post('/', (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, categoria_id, on_sale } = req.body;
  
  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ error: "Faltan campos obligatorios: nombre, precio y stock." });
  }

  const sql = `INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, on_sale) 
               VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, 0))`;
  const params = [nombre, descripcion || null, precio, stock, imagen_url || null, categoria_id || null, on_sale ? 1 : 0];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Producto creado exitosamente", data: { id: this.lastID, ...req.body } });
  });
});

// ------------------------------------------------------------------
// RUTA 3 (UPDATE): ACTUALIZAR (UPDATE) - /api/productos/:id
// ------------------------------------------------------------------
router.put('/:id', (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, categoria_id, on_sale } = req.body;
  const id = req.params.id;

  const sql = `UPDATE productos SET 
                  nombre = COALESCE(?, nombre), 
                  descripcion = COALESCE(?, descripcion), 
                  precio = COALESCE(?, precio),
                  stock = COALESCE(?, stock),
                  imagen_url = COALESCE(?, imagen_url),
                  categoria_id = COALESCE(?, categoria_id),
                  on_sale = COALESCE(?, on_sale)
               WHERE id = ?`;
  const params = [nombre, descripcion, priceOrNull(descripcion, precio), precio, stock, imagen_url, categoria_id, on_sale == null ? null : (on_sale ? 1 : 0), id];

  // Note: we want to preserve values if fields are not provided.
  // Use a simpler param array but ensure order matches the SQL above.
  const runParams = [nombre, descripcion, precio, stock, imagen_url, categoria_id, on_sale == null ? null : (on_sale ? 1 : 0), id];

  db.run(sql, runParams, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    res.json({ message: "Producto actualizado exitosamente" });
  });
});

// ------------------------------------------------------------------
// RUTA 4 (DELETE): ELIMINAR (DELETE) - /api/productos/:id
// ------------------------------------------------------------------
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM productos WHERE id = ?';
  const id = req.params.id;

  db.run(sql, id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    res.json({ message: "Producto eliminado exitosamente", changes: this.changes });
  });
});

export default router;


// Helper used in the file (kept at bottom). If you want to keep the file clean,
// you can remove priceOrNull and use runParams directly. It's here to be explicit.
function priceOrNull(desc, price) {
  return price == null ? null : price;
}
