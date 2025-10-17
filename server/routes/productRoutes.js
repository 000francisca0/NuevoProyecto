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
      res.status(500).json({ "error": err.message });
      return;
    }
    // Devuelve un arreglo de productos
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

// ------------------------------------------------------------------
// RUTA 2: CREAR (CREATE) - /api/productos
// ------------------------------------------------------------------
router.post('/', (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, categoria_id } = req.body;
  
  // Validación simple (debes hacer una más robusta)
  if (!nombre || !precio || !stock) {
    return res.status(400).json({ "error": "Faltan campos obligatorios: nombre, precio y stock." });
  }

  const sql = `INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [nombre, descripcion, precio, stock, imagen_url, categoria_id];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ "error": err.message });
      return;
    }
    // Devuelve el producto creado con su nuevo ID
    res.json({
      "message": "Producto creado exitosamente",
      "data": { id: this.lastID, ...req.body }
    });
  });
});


// ------------------------------------------------------------------
// RUTA 3: ACTUALIZAR (UPDATE) - /api/productos/:id
// ------------------------------------------------------------------
router.put('/:id', (req, res) => {
    const { nombre, descripcion, precio, stock, imagen_url, categoria_id } = req.body;
    const id = req.params.id;

    const sql = `UPDATE productos SET 
                  nombre = COALESCE(?, nombre), 
                  descripcion = COALESCE(?, descripcion), 
                  precio = COALESCE(?, precio),
                  stock = COALESCE(?, stock),
                  imagen_url = COALESCE(?, imagen_url),
                  categoria_id = COALESCE(?, categoria_id)
                WHERE id = ?`;
    
    const params = [nombre, descripcion, precio, stock, imagen_url, categoria_id, id];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Producto no encontrado." });
        }
        res.json({ "message": "Producto actualizado exitosamente" });
    });
});

// ------------------------------------------------------------------
// RUTA 4: ELIMINAR (DELETE) - /api/productos/:id
// ------------------------------------------------------------------
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM productos WHERE id = ?';
  const id = req.params.id;

  db.run(sql, id, function(err) {
    if (err) {
      res.status(500).json({ "error": err.message });
      return;
    }
    if (this.changes === 0) {
        return res.status(404).json({ "error": "Producto no encontrado." });
    }
    res.json({ "message": "Producto eliminado exitosamente", "changes": this.changes });
  });
});


export default router;