// src/paginas/registro.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"; 

function RegisterForm() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (event) => { 
    event.preventDefault();
    const newErrors = {};
    setServerError(''); 

    // --- LÓGICA DE VALIDACIÓN ---

    if (!nombre || nombre.length < 3 || nombre.length > 50) {
        newErrors.nombre = 'El nombre es requerido y debe tener entre 3 y 50 caracteres.';
    }

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

    if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        alert('Registro exitoso! Ya puedes iniciar sesión.');
        navigate('/inicio'); // Navegar al Login

      } else {
        // Error de servidor (ej: correo ya existe)
        setServerError(data.error || 'Ocurrió un error al registrarse. Intenta con otro correo.');
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
        <h2>Crear Cuenta</h2>
        {serverError && <div className="server-error-message">{serverError}</div>} 

        <Form onSubmit={handleSubmit}>
          {/* CAMPO NOMBRE */}
          <Form.Group className="form-group-spacing" controlId="formNombre">
            <Form.Label className="form-label">Nombre Completo</Form.Label>
            <div className="input-icon-wrapper">
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                isInvalid={!!errors.nombre}
              />
              <FaUser className="input-icon" />
            </div>
            {errors.nombre && <div className="error-message">{errors.nombre}</div>}
          </Form.Group>
          
          {/* CAMPO CORREO */}
          <Form.Group className="form-group-spacing" controlId="formEmail">
            <Form.Label className="form-label">Correo Electrónico</Form.Label>
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

          {/* CAMPO CONTRASEÑA */}
          <Form.Group className="form-group-spacing" controlId="formPassword">
            <Form.Label className="form-label">Contraseña</Form.Label>
            <div className="input-icon-wrapper">
              <Form.Control
                type="password"
                placeholder="Entre 4 y 10 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
              />
              <FaLock className="input-icon" />
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </Form.Group>

          {/* CAMPO CONFIRMAR CONTRASEÑA */}
          <Form.Group className="form-group-spacing" controlId="formConfirmPassword">
            <Form.Label className="form-label">Confirmar Contraseña</Form.Label>
            <div className="input-icon-wrapper">
              <Form.Control
                type="password"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isInvalid={!!errors.confirmPassword}
              />
              <FaLock className="input-icon" />
            </div>
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </Form.Group>


          <Button 
            variant="primary" 
            type="submit" 
            size="lg" 
            className="btn-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrarme'}
          </Button>

          {/* Enlace de vuelta al Login */}
          <Link to="/inicio" className="forgot-password-link">
            ¿Ya tienes cuenta? Inicia Sesión
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default RegisterForm;