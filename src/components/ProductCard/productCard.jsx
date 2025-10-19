// src/components/ProductCard/productCard.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/cartContext';

function ProductCard({ producto }) {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/producto/${producto.id}`);
  };

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(producto.precio);

  return (
    <article className="card" role="article" aria-label={producto.nombre}>
      {/* Clickable media */}
      <button
        onClick={goToDetails}
        style={{ border: 'none', padding: 0, background: 'transparent', cursor: 'pointer' }}
        aria-label={`Ver detalles de ${producto.nombre}`}
      >
        <img src={producto.imagen || producto.imagen_url} alt={producto.nombre} className="card-media" />
      </button>

      {/* body */}
      <div className="card-body">
        <h3 className="card-title">{producto.nombre}</h3>
        <p className="card-sub">{formattedPrice}</p>
      </div>

      {/* actions */}
      <div className="card-actions">
        <button type="button" className="btn btn-ghost" onClick={goToDetails}>
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
