import React, { useContext } from 'react';
import { CartContext } from '../../context/cartContext';

function ProductCard({ producto }) {
  const { addToCart } = useContext(CartContext);

  const handleViewDetails = () => {
    console.log(`Viendo detalles de: ${producto.nombre}`);
  };

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(producto.precio);

  return (
    <article className="card" role="article" aria-label={producto.nombre}>
      {/* media */}
      <img src={producto.imagen} alt={producto.nombre} className="card-media" />

      {/* body */}
      <div className="card-body">
        <h3 className="card-title">{producto.nombre}</h3>
        <p className="card-sub">{formattedPrice}</p>
      </div>

      {/* actions */}
      <div className="card-actions">
        <button type="button" className="btn btn-ghost" onClick={handleViewDetails}>
          Ver Detalle
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => addToCart(producto)}
        >
          Agregar
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
