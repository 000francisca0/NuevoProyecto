// src/paginas/Home.jsx

import React from 'react';
import './home.css'; // Crearemos este archivo a continuación

function Home() {
  return (
    // 1. Contenedor principal que ocupará toda la pantalla
    <div className="home-container">
      
      {/* 2. Este es el rectángulo blanco que vamos a centrar */}
      <div className="content-card">
        <h1>¡Bienvenido a Peluchemania! 🐻</h1>
        <p>
          Este es el contenido principal de la aplicación.
        </p>
        <p>
          El rectángulo blanco central facilita la visualización sobre cualquier fondo.
        </p>
      </div>

    </div>
  );
}

export default Home;