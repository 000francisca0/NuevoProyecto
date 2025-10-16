// src/pages/Productos.jsx

import React, { useEffect } from 'react';
import productosData from './productos.js';
import ProductCard from "../components/ProductCard/productCard.jsx";

function Productos() {
  
  // 👇 BLOQUE DE CÓDIGO ACTUALIZADO
  useEffect(() => {
    // Al entrar a esta página, añadimos una clase para el fondo
    document.body.classList.add('productos-background');

    // Esta función se ejecuta al salir de la página de productos
    return () => {
      // Limpiamos la clase para que las otras páginas no la hereden
      document.body.classList.remove('productos-background'); 
    };
  }, []); // El [] vacío asegura que solo se ejecute al entrar y salir

  return (
    <div className="productos-page-container">
      <h1 className="productos-title">Nuestros Adorables Peluches</h1>
      
      <div className="productos-grid">
        {productosData.map(producto => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}

export default Productos;