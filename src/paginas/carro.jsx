// src/paginas/carro.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/cartContext';

function Carro() {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  const formatPrice = (price) => new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP'
  }).format(price);

  return (
    <div className="cart-page-container">
      <h1 className="cart-title">Tu Carrito de Compras</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Tu carrito está vacío.</p>
          <Link to="/productos" className="btn-go-products">Ver Productos</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.imagen} alt={item.nombre} className="cart-item-image" />
                <div className="cart-item-details">
                  <span className="cart-item-name">{item.nombre}</span>
                  <span className="cart-item-price">{formatPrice(item.precio)}</span>
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => removeFromCart(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}>+</button>
                </div>
                <div className="cart-item-subtotal">
                  {formatPrice(item.precio * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Resumen de la Compra</h2>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button className="btn-checkout">Finalizar Compra</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carro;