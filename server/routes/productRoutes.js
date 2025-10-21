// server/routes/productRoutes.js
import express from 'express';
import { db } from '../database.js';

const router = express.Router();

const withDiscount = (row) => {
  const discount = row.discount_percentage ?? 0;
  const discounted_price = discount > 0 ? Math.round(row.precio * (1 - discount)) : null;
  return { ...row, discounted_price };
};

// GET all
router.get('/', (req, res) => {
  db.all("SELECT * FROM productos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "success", data: rows.map(withDiscount) });
  });
});

// GET by category
router.get('/category/:categoryId', (req, res) => {
  db.all("SELECT * FROM productos WHERE categoria_id = ?", [req.params.categoryId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "success", data: rows.map(withDiscount) });
  });
});

// GET on-sale (discount > 0)
router.get('/on-sale', (req, res) => {
  db.all("SELECT * FROM productos WHERE discount_percentage IS NOT NULL AND discount_percentage > 0", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "success", data: rows.map(withDiscount) });
  });
});

// GET details + images
router.get('/:id/details', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM productos WHERE id = ?", [id], (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: "Producto no encontrado." });

    db.all("SELECT imagen_url FROM producto_imagenes WHERE producto_id = ? ORDER BY orden ASC", [id], (imgErr, imgs) => {
      if (imgErr) return res.status(500).json({ error: imgErr.message });
      const imageUrls = imgs?.length ? imgs.map(i => i.imagen_url) : [];
      const enriched = withDiscount(product);
      res.json({ message: "success", data: { ...enriched, images: imageUrls } });
    });
  });
});

// CREATE
router.post('/', (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, categoria_id, discount_percentage } = req.body;
  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ error: "Faltan campos obligatorios: nombre, precio y stock." });
  }
  const sql = `INSERT INTO productos 
    (nombre, descripcion, precio, stock, imagen_url, categoria_id, on_sale, discount_percentage) 
    VALUES (?, ?, ?, ?, ?, ?, 0, ?)`;
  const params = [nombre, descripcion || null, precio, stock, imagen_url || null, categoria_id || null, discount_percentage ?? null];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Producto creado exitosamente", data: { id: this.lastID, ...req.body } });
  });
});

// UPDATE
router.put('/:id', (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, categoria_id, discount_percentage } = req.body;
  const id = req.params.id;

  // If discount_percentage is undefined, don't touch it
  let sql = `UPDATE productos SET 
      nombre = COALESCE(?, nombre),
      descripcion = COALESCE(?, descripcion),
      precio = COALESCE(?, precio),
      stock = COALESCE(?, stock),
      imagen_url = COALESCE(?, imagen_url),
      categoria_id = COALESCE(?, categoria_id)
    WHERE id = ?`;
  let params = [nombre || null, descripcion || null, precio ?? null, stock ?? null, imagen_url || null, categoria_id ?? null, id];

  if (discount_percentage !== undefined) {
    sql = `UPDATE productos SET 
      nombre = COALESCE(?, nombre),
      descripcion = COALESCE(?, descripcion),
      precio = COALESCE(?, precio),
      stock = COALESCE(?, stock),
      imagen_url = COALESCE(?, imagen_url),
      categoria_id = COALESCE(?, categoria_id),
      discount_percentage = ?
    WHERE id = ?`;
    params = [nombre || null, descripcion || null, precio ?? null, stock ?? null, imagen_url || null, categoria_id ?? null, discount_percentage, id];
  }

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Producto no encontrado." });
    res.json({ message: "Producto actualizado exitosamente" });
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM productos WHERE id = ?', req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Producto no encontrado." });
    res.json({ message: "Producto eliminado exitosamente", changes: this.changes });
  });
});

export default router;
