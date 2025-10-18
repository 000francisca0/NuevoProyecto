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
    <div className="cart-layout">
      <div className="container">
        <h1 className="mb-2">Tu Carrito de Compras</h1>

        {cartItems.length === 0 ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p>Tu carrito está vacío.</p>
            <Link to="/productos" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div>
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.imagen} alt={item.nombre} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }} />
                  <div style={{ flexGrow: 1 }}>
                    <span className="mb-1" style={{ display: 'block', fontWeight: 700 }}>{item.nombre}</span>
                    <span style={{ color: '#6c757d' }}>{formatPrice(item.precio)}</span>
                  </div>

                  <div className="qty-controls">
                    <button onClick={() => removeFromCart(item)} style={{ width: 30, height: 30, borderRadius: '50%' }}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)} style={{ width: 30, height: 30, borderRadius: '50%' }}>+</button>
                  </div>

                  <div style={{ marginLeft: 12, fontWeight: 700 }}>
                    {formatPrice(item.precio * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <aside className="summary">
              <h2>Resumen de la Compra</h2>
              <div className="summary-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button className="btn btn-primary btn-block" style={{ marginTop: 12 }}>
                Finalizar Compra
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carro;
