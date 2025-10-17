// src/paginas/inicio.jsx (VERSIÓN FINAL CON API)

import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaEnvelope, FaLock } from "react-icons/fa";
// 💡 Importar Link para el enlace de registro
import { useNavigate, Link } from 'react-router-dom'; 


function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  // 💡 Estados para manejar la comunicación con el servidor
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 💡 Función asíncrona para llamar a la API
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    setServerError(''); 

    // --- LÓGICA DE VALIDACIÓN (Tu lógica de longitud y dominio) ---
    const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    if (!email) {
      newErrors.email = 'El correo es requerido.';
    } else if (email.length > 100) {
      newErrors.email = 'El correo no puede tener más de 100 caracteres.';
    } else if (!allowedDomains.some(domain => email.endsWith(domain))) {
      newErrors.email = 'Correo incorrecto, solo correos con @duoc.cl, @profesor.duoc.cl y @gmail.com';
    }
    if (!password) {
      newErrors.password = 'La contraseña es requerida.';
    } else if (password.length < 4 || password.length > 10) {
      newErrors.password = 'La contraseña debe tener entre 4 y 10 caracteres.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Si la validación local pasa, llamar a la API
    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user } = data;
        // Almacenar datos del usuario (id, nombre, rol)
        localStorage.setItem('userPeluchemania', JSON.stringify(user));
        // Navegar a la ruta Home (/)
        navigate('/'); 

      } else {
        // Error de servidor (ej: credenciales incorrectas)
        setServerError(data.error || 'Credenciales incorrectas o error de servidor.');
      }

    } catch (error) {
      setServerError('No se pudo conectar con el servidor. Verifica que Node.js esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container-wrapper">
      <div className="form-container">
        <h2>¡Bienvenido a Peluchemania!</h2>
        <h2>🧸</h2>
        <p>Ingresa para ver nuestros adorables productos.</p>
        {/* Muestra el error del servidor */}
        {serverError && <div className="server-error-message">{serverError}</div>} 

        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group-spacing" controlId="formEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <div className="input-icon-wrapper">
              <Form.Control
                type="email"
                placeholder="Escribe tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
              />
              <FaEnvelope className="input-icon" />
            </div>
            {errors.email && <div className="error-message">{errors.email}</div>}
          </Form.Group>

          <Form.Group className="form-group-spacing" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <div className="input-icon-wrapper">
              <Form.Control
                type="password"
                placeholder="Escribe tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
              />
              <FaLock className="input-icon" />
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            size="lg" 
            className="btn-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Entrar'} 
          </Button>

          {/* 💡 Enlace al registro */}
          <Link to="/registro" className="forgot-password-link">
            ¿No tienes cuenta? Regístrate
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;