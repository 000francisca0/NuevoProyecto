// 👇 1. Importa 'useEffect'
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

function Home() {
  const navigate = useNavigate();

  const handleGoToProducts = () => {
    navigate('/productos');
  };

  // 👇 2. Agrega este bloque de código completo
  useEffect(() => {
    // Al entrar a Home, añadimos una clase específica al body
    document.body.classList.add('home-background');

    // Esta función se ejecuta al salir de la página de Home
    return () => {
      // Limpiamos la clase para que las otras páginas no la tengan
      document.body.classList.remove('home-background');
    };
  }, []); // El [] vacío asegura que solo se ejecute al entrar y salir

  return (
    <div className="home-container">
      <div className="content-card">
        <h1>¡Bienvenido a Peluchemania! 🧸</h1>
        <p>
          Aquí puedes ver nuestros adorables productos y encontrar a tu próximo amigo de peluche.
        </p>

        <button className="btn-products" onClick={handleGoToProducts}>
          Ver Productos
        </button>
      </div>
    </div>
  );
}

export default Home;