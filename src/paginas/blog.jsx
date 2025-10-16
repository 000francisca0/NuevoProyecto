// src/paginas/Blog.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function Blog() {
  // Array de artículos (se podría cargar desde la base de datos más adelante)
  const articulos = [
    { 
      id: 1, 
      titulo: "Guía de Cuidado: Cómo Mantener tu Peluche como Nuevo", 
      resumen: "Consejos y trucos esenciales para la limpieza y el almacenamiento de tus compañeros suaves.", 
      path: "/blog/cuidado-de-peluches" 
    },
    { 
      id: 2, 
      titulo: "La Historia del Oso Teddy: Un Clásico Atemporal", 
      resumen: "Descubre el origen legendario del peluche más famoso del mundo y su impacto en la cultura pop.", 
      path: "/blog/historia-oso-teddy" 
    },
  ];

  return (
    <div className="page-background-theme">
      <div className="productos-page-container">
        <h1 className="productos-title">Nuestro Blog de Peluches</h1>
        
        {/* Reutilizamos el grid de productos para listar las tarjetas del blog */}
        <div className="productos-grid">
          {articulos.map((articulo) => (
            <Link 
              key={articulo.id}
              to={articulo.path}
              // Reutilizamos el estilo de tarjeta de producto para las entradas del blog
              className="product-card" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="product-info" style={{ flexGrow: 1, padding: '20px' }}>
                <h3 className="product-name" style={{ fontSize: '1.4rem' }}>{articulo.titulo}</h3>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>{articulo.resumen}</p>
              </div>
              <div className="product-actions" style={{ justifyContent: 'flex-end', padding: '0 20px 20px 20px' }}>
                <button className="btn-details">Leer Más</button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;