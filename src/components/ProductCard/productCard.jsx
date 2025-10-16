import React from 'react';
import './productCard.css'; // Enlazamos su hoja de estilos

// Este componente recibe un 'producto' con sus datos (nombre, precio, etc.)
function ProductCard({ producto }) {
  
  // Función para simular "Ver Detalles"
  const handleViewDetails = () => {
    console.log(`Viendo detalles de: ${producto.nombre}`);
    // Más adelante, esto podría llevar a una página nueva: navigate(`/producto/${producto.id}`);
  };

  // Función para simular "Agregar al Carrito"
  const handleAddToCart = () => {
    console.log(`Agregando al carrito: ${producto.nombre}`);
    // Aquí irá la lógica para el carrito de compras
  };

  // Damos formato al precio para que se vea como moneda ($19.990)
  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(producto.precio);

  return (
    <div className="product-card">
      <img src={producto.imagen} alt={producto.nombre} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{producto.nombre}</h3>
        <p className="product-price">{formattedPrice}</p>
      </div>
      <div className="product-actions">
        <button className="btn-details" onClick={handleViewDetails}>Ver Detalle</button>
        <button className="btn-add-cart" onClick={handleAddToCart}>Agregar</button>
      </div>
    </div>
  );
}

export default ProductCard;