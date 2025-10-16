// src/paginas/blogs/HistoriaOsoTeddy.jsx

import React from 'react';

function HistoriaOsoTeddy() {
  // Estilo para el contenedor principal: Elimina la altura forzada y añade padding.
  const layoutStyle = {
    // IMPORTANTE: Quita el min-height: 100vh de home-container
    minHeight: 'auto', 
    // Añade un padding superior para despegar del Header (similar al MainLayout)
    padding: '100px 2rem 40px 2rem', 
    width: '100%',
    boxSizing: 'border-box',
  };

  // Estilo para la tarjeta: Centrado horizontal y ancho máximo.
  const cardStyle = {
    maxWidth: '900px',
    // 💡 SOLUCIÓN DE CENTRADO: Centra la tarjeta horizontalmente
    margin: '0 auto', 
  };

  return (
    <div style={layoutStyle}> 
      
      <div className="content-card" style={cardStyle}>
        <h1 className="productos-title" style={{ fontSize: '2rem' }}>La Historia del Oso Teddy: Un Clásico Atemporal</h1>
        <p>Publicado el 16 de Octubre de 2025</p>
        <hr />
        
        <h2>Dos Orígenes, Una Leyenda</h2>
        <p>
          El Oso Teddy tiene dos historias de origen paralelas a principios del siglo XX. 
          Una involucra a **Morris Michtom** en EE. UU., inspirado por un dibujo animado 
          sobre el presidente Theodore "Teddy" Roosevelt...
        </p>

        <h2>Un Símbolo de Confort</h2>
        <p>
          Desde entonces, el Oso Teddy se ha convertido en un símbolo universal de 
          inocencia y confort. Su diseño clásico ha evolucionado poco, manteniendo su 
          lugar como el peluche más vendido en la historia.
        </p>
      </div>
    </div>
  );
}
export default HistoriaOsoTeddy;