import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    setServerError('');

    const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    if (!email) newErrors.email = 'El correo es requerido.';
    else if (email.length > 100) newErrors.email = 'El correo no puede tener más de 100 caracteres.';
    else if (!allowedDomains.some(domain => email.endsWith(domain))) newErrors.email = 'Correo incorrecto, solo correos con @duoc.cl, @profesor.duoc.cl y @gmail.com';

    if (!password) newErrors.password = 'La contraseña es requerida.';
    else if (password.length < 4 || password.length > 10) newErrors.password = 'La contraseña debe tener entre 4 y 10 caracteres.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user } = data;
        localStorage.setItem('userPeluchemania', JSON.stringify(user));
        navigate('/');
      } else {
        setServerError(data.error || 'Credenciales incorrectas o error de servidor.');
      }
    } catch (error) {
      setServerError('No se pudo conectar con el servidor. Verifica que Node.js esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-dark-layer" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="form-shell">
        <h2>¡Bienvenido a Peluchemania!</h2>
        <h2 className="text-center">🧸</h2>
        <p style={{ textAlign: 'center' }}>Ingresa para ver nuestros adorables productos.</p>

        {serverError && <div className="server-error-message">{serverError}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group" controlId="formEmail">
            <Form.Label className="form-label">Correo Electrónico</Form.Label>
            <div className="input-icon-wrapper">
              <Form.Control
                type="email"
                placeholder="Escribe tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
                className="form-control"
              />
              <FaEnvelope className="input-icon" />
            </div>
            {errors.email && <div className="error-message">{errors.email}</div>}
          </Form.Group>

          <Form.Group className="form-group" controlId="formPassword">
            <Form.Label className="form-label">Contraseña</Form.Label>
            <div className="input-icon-wrapper">
              <Form.Control
                type="password"
                placeholder="Escribe tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
                className="form-control"
              />
              <FaLock className="input-icon" />
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </Form.Group>

          <Button variant="primary" type="submit" size="lg" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Entrar'}
          </Button>

          <Link to="/registro" className="forgot-password-link" style={{ display: 'block', marginTop: 16, textAlign: 'center' }}>
            ¿No tienes cuenta? Regístrate
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;
