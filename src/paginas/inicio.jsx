// src/paginas/inicio.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { API_BASE } from '../lib/api.js';

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!email || !password) {
      setServerError('Correo y contraseña son obligatorios.');
      return;
    }
    setIsLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setServerError(data?.error || 'Credenciales incorrectas.');
        setIsLoading(false);
        return;
      }
      login(data.user);

      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      if (data.user.rol === 'Administrador') navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
    } catch {
      setServerError('No se pudo conectar con el servidor.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="form-shell">
        <h2>Iniciar Sesión</h2>
        {serverError && <div className="server-error-message">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="loginEmail">Correo</label>
            <div className="input-icon-wrapper">
              <input
                id="loginEmail"
                type="email"
                className="form-control"
                placeholder="ejemplo@duoc.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaEnvelope className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="loginPassword">Contraseña</label>
            <div className="input-icon-wrapper">
              <input
                id="loginPassword"
                type="password"
                className="form-control"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className="input-icon" />
            </div>
          </div>

          {/* --- 👇 CAMBIO AQUÍ --- */}
          {/* 1. Agregamos un div contenedor para los dos botones */}
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
            
            {/* 2. Movimos el Link de "Volver a Home" aquí y le dimos estilo de botón */}
            <Link 
              to="/" 
              className="btn btn-ghost" // Le damos estilo de botón fantasma
              style={{ textAlign: 'center' }} // Aseguramos que el texto esté centrado
            >
              Volver a Home
            </Link>

            {/* 3. Quitamos la clase 'btn-block' del botón de Ingresar */}
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
          {/* --- FIN DEL CAMBIO --- */}


          <Link to="/registro" className="text-center" style={{ display: 'block', marginTop: 12 }}>
            ¿No tienes cuenta? Regístrate
          </Link>

          {/* 4. Eliminamos el Link de "Volver a Home" que estaba aquí abajo */}
          
        </form>
      </div>
    </div>
  );
}