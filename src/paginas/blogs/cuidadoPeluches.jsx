// src/paginas/blogs/CuidadoPeluches.jsx

import React from 'react';

function CuidadoPeluches() {
  // Estilo para el contenedor principal: Elimina la altura forzada y añade padding.
  const layoutStyle = {
    // IMPORTANTE: Quita el min-height: 100vh de home-container
    minHeight: 'auto', 
    // Añade un padding superior para despegar del Header (similar al MainLayout)
    padding: '100px 2rem 40px 2rem', 
    width: '100%',
    boxSizing: 'border-box',
    // Usamos el color de fondo general (si no lo da el MainLayout)
    };
  
  // Estilo para la tarjeta: Centrado horizontal y ancho máximo.
  const cardStyle = {
    maxWidth: '900px',
    // 💡 SOLUCIÓN DE CENTRADO: Centra la tarjeta (que tiene un ancho fijo) horizontalmente
    margin: '0 auto', 
  };

  return (
    // Reemplazamos home-container por un div con estilo en línea
    <div style={layoutStyle}> 
      
      {/* Aplicamos los estilos de centrado y ancho a la content-card */}
      <div className="content-card" style={cardStyle}>
        <h1 className="productos-title" style={{ fontSize: '2rem' }}>Guía de Cuidado: Cómo Mantener tu Peluche como Nuevo</h1>
        <p>Publicado el 16 de Octubre de 2025</p>
        <hr />
        
        <h2>El Lavado Suave es la Clave</h2>
        <p>
          Para la mayoría de los peluches, el **lavado a mano** es la opción más segura. 
          Utiliza agua tibia y un detergente suave para ropa delicada. Nunca uses 
          blanqueadores...
        </p>

        <h2>Secado Correcto</h2>
        <p>
          Evita la secadora, ya que el calor puede dañar las fibras y el relleno. 
          Envuelve el peluche en una toalla limpia para absorber el exceso de agua y luego
          déjalo secar al aire libre...
        </p>
      </div>
    </div>
  );
}
export default CuidadoPeluches;