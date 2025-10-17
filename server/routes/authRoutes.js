// server/routes/authRoutes.js

import express from 'express';
import { db } from '../database.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Número de "salt rounds" para el cifrado: 10 es un buen balance entre seguridad y rendimiento.
const saltRounds = 10; 

// ------------------------------------------------------------------
// RUTA 1: REGISTRO de Nuevo Usuario (Cliente por defecto) - /api/auth/register
// ------------------------------------------------------------------
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;
  
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    // 1. Cifrar la contraseña
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // 2. Establecer el rol por defecto (Cliente = 2)
    const rol_id = 2; // Cliente por defecto

    const sql = `INSERT INTO usuarios (nombre, email, password_hash, rol_id) 
                 VALUES (?, ?, ?, ?)`;
    const params = [nombre, email, password_hash, rol_id];

    db.run(sql, params, function(err) {
      if (err) {
        // Error 19 es el código de SQLite para restricción de unicidad (email ya existe)
        if (err.errno === 19) {
          return res.status(409).json({ error: "El correo electrónico ya está registrado." });
        }
        return res.status(500).json({ error: err.message });
      }
      
      // Registro exitoso
      res.status(201).json({ 
        message: "Usuario registrado exitosamente.",
        userId: this.lastID,
        rol: 'Cliente'
      });
    });

  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor al cifrar la contraseña." });
  }
});


// ------------------------------------------------------------------
// RUTA 2: INICIO DE SESIÓN - /api/auth/login
// ------------------------------------------------------------------
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
  }

  const sql = `SELECT u.id, u.nombre, u.email, u.password_hash, r.nombre AS rol_nombre 
               FROM usuarios u
               JOIN roles r ON u.rol_id = r.id
               WHERE u.email = ?`;
  
  db.get(sql, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // 1. Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    try {
      // 2. Comparar la contraseña ingresada con el hash almacenado
      const match = await bcrypt.compare(password, user.password_hash);

      if (match) {
        // 3. Inicio de sesión exitoso. Devolver datos del usuario (SIN la contraseña hash)
        // Normalmente aquí se genera un token JWT para mantener la sesión
        const userData = {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol_nombre // 'Administrador' o 'Cliente'
        };
        
        res.json({ 
          message: "Inicio de sesión exitoso.",
          user: userData,
        });

      } else {
        // Contraseña incorrecta
        res.status(401).json({ error: "Credenciales incorrectas." });
      }

    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor al verificar la contraseña." });
    }
  });
});


export default router;