// src/paginas/carro.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import { useAuth } from '../context/authContext';
import { FaMapMarkerAlt } from 'react-icons/fa';

function Carro() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { cartItems, addToCart, removeFromCart, removeItem } = useContext(CartContext);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  useEffect(() => {
    const mm = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mm.matches);
    if (mm.addEventListener) mm.addEventListener('change', handler);
    else mm.addListener(handler);
    return () => {
      if (mm.removeEventListener) mm.removeEventListener('change', handler);
      else mm.removeListener(handler);
    };
  }, []);

  const total = cartItems.reduce((sum, item) => {
    const precio = Number(item.precio || 0);
    const qty = Number(item.quantity || 0);
    return sum + precio * qty;
  }, 0);

  const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

  const handleGoToCheckout = () => {
    if (!isLoggedIn || !user) {
      alert('Debes iniciar sesión para finalizar la compra.');
      navigate('/');
      return;
    }
    if (cartItems.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    navigate('/checkout');
  };

  const Summary = () => (
    <aside className="summary card">
      <h2>Resumen de la Compra</h2>

      <div className="summary-section">
        <h3 style={{ fontSize: '1.1rem', marginTop: 0 }}>
          <FaMapMarkerAlt style={{ marginRight: 6 }} />
          Dirección de Envío
        </h3>

        {!isLoggedIn && (
          <p style={{ color: 'var(--muted)' }}>
            <Link to="/" style={{ fontWeight: 700 }}>Inicia sesión</Link> para ver tu dirección de envío por defecto.
          </p>
        )}

        {isLoggedIn && user?.direccion_default && (
          <div className="address-info">
            <p className="mb-0">
              <strong>{user.direccion_default.region}</strong>, {user.direccion_default.comuna}
            </p>
            <p className="mb-0">
              {user.direccion_default.calle} {user.direccion_default.depto ? `(${user.direccion_default.depto})` : ''}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--brand-hover)' }}>
              *Dirección registrada. Para cambiarla, actualiza tu perfil.
            </p>
          </div>
        )}

        {isLoggedIn && !user?.direccion_default && (
          <p style={{ color: 'red' }}>Error: No hay dirección registrada. Actualiza tu perfil.</p>
        )}
      </div>

      <hr className="my-3" />

      <div className="summary-section">
        <div className="summary-total">
          <span style={{ fontWeight: 700 }}>Total a Pagar</span>
          <span style={{ fontWeight: 800, fontSize: '1.3rem' }}>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        className="btn btn-primary btn-block"
        onClick={handleGoToCheckout}
        disabled={cartItems.length === 0 || !isLoggedIn}
        style={{ marginTop: 12 }}
      >
        Ir a Checkout
      </button>
    </aside>
  );

  return (
    <div className="cart-layout main-content">
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
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item card">
                  <img src={item.imagen} alt={item.nombre} className="cart-item-img" />

                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.nombre}</span>
                    <span className="cart-item-price-unit">{formatPrice(item.precio)} c/u</span>
                  </div>

                  <div className="qty-controls">
                    <button onClick={() => removeFromCart(item)} className="btn btn-ghost" aria-label={`Reducir cantidad de ${item.nombre}`}>-</button>
                    <span aria-live="polite" style={{ minWidth: 26, textAlign: 'center' }}>{item.quantity || 0}</span>
                    <button onClick={() => addToCart(item)} className="btn btn-ghost" aria-label={`Aumentar cantidad de ${item.nombre}`}>+</button>
                  </div>

                  <div className="cart-item-subtotal">
                    <strong>{formatPrice(Number(item.precio || 0) * Number(item.quantity || 0))}</strong>
                  </div>

                  <div>
                    <button className="btn btn-ghost" onClick={() => removeItem(item)} aria-label={`Eliminar ${item.nombre} del carrito`}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!isMobile && <Summary />}
            {isMobile && (
              <div style={{ marginTop: '1rem' }}>
                <Summary />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Carro;
