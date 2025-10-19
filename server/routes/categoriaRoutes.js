import express from 'express';
import { db } from '../database.js';
const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM categorias ORDER BY id', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'success', data: rows });
  });
});

export default router;
