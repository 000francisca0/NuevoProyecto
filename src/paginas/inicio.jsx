import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};

    // --- LÓGICA DE VALIDACIÓN ---

    // A. Validación del Correo
    const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    if (!email) {
      newErrors.email = 'El correo es requerido.';
    } else if (email.length > 100) {
      newErrors.email = 'El correo no puede tener más de 100 caracteres.';
    } else if (!allowedDomains.some(domain => email.endsWith(domain))) {
      // --- CAMBIO AQUÍ ---
      // Modificamos el mensaje de error para que coincida con tu solicitud.
      newErrors.email = 'Correo incorrecto, solo correos con @duoc.cl, @profesor.duoc.cl y @gmail.com';
    }

    // B. Validación de la Contraseña
    if (!password) {
      newErrors.password = 'La contraseña es requerida.';
    } else if (password.length < 4 || password.length > 10) {
      newErrors.password = 'La contraseña debe tener entre 4 y 10 caracteres.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Validación exitosa. Redirigiendo...");
      navigate('/home');
    }
  };

  return (
    <div className="login-container-wrapper">
      <div className="form-container">
        <h2>¡Bienvenido a Peluchemania!</h2>
        <h2>🧸</h2>
        <p>Ingresa para ver nuestros adorables productos.</p>

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

          <Button variant="primary" type="submit" size="lg" className="btn-submit">
            Entrar
          </Button>

          <a href="#" className="forgot-password-link">
            ¿Olvidaste tu contraseña?
          </a>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;