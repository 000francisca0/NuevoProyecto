// 1. Importamos las herramientas de React que necesitamos
import React, { useContext } from 'react';
import { CartContext } from '../../context/cartContext'; // Importamos nuestro contexto del carrito

// Este componente recibe un 'producto' con sus datos
function ProductCard({ producto }) {
  // 2. Obtenemos la función addToCart de nuestro contexto global
  const { addToCart } = useContext(CartContext);

  // La función "Ver Detalles" se mantiene igual por ahora
  const handleViewDetails = () => {
    console.log(`Viendo detalles de: ${producto.nombre}`);
  };

  // La función para formatear el precio también se mantiene
  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
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
        {/* 3. Conectamos el botón para que llame a la función del contexto */}
        <button className="btn-add-cart" onClick={() => addToCart(producto)}>
          Agregar
        </button>
      </div>
    </div>
  );
}

export default ProductCard;