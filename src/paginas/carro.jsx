// src/paginas/carro.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt } from 'react-icons/fa';

function Carro() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { cartItems, addToCart, removeFromCart, removeItem } = useContext(CartContext);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [notice, setNotice] = useState('');

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

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

  const handleGoToCheckout = () => {
    if (!isLoggedIn || !user) {
      if (isMobile) {
        alert('Debes iniciar sesión para finalizar la compra.');
        navigate('/inicio');
      } else {
        setNotice('Debes iniciar sesión para finalizar la compra.');
      }
      return;
    }
    if (cartItems.length === 0) {
      if (!isMobile) setNotice('El carrito está vacío.');
      return;
    }
    setNotice('');
    navigate('/checkout');
  };

  // --- COMPONENTES DE RESUMEN ---
  
  // (Resumen para ESCRITORIO - sin cambios)
  const Summary = () => (
    <aside className={`summary card ${isMobile ? 'sticky-mobile' : ''}`}>
      <h2>Resumen de la Compra</h2>
      {notice && (
        <div className="server-error-message" style={{ marginBottom: 10 }}>
          {notice}
        </div>
      )}
      <div className="summary-section">
        <h3 style={{ fontSize: '1.1rem', marginTop: 0 }}>
          <FaMapMarkerAlt style={{ marginRight: 6 }} />
          Dirección de Envío
        </h3>
        {!isLoggedIn && (
          <p style={{ color: 'var(--muted)' }}>
            <Link to="/inicio" style={{ fontWeight: 700 }}>Inicia sesión</Link> para ver tu dirección.
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
              *Dirección registrada.
            </p>
          </div>
        )}
        {isLoggedIn && !user?.direccion_default && (
          <p style={{ color: 'red' }}>Error: No hay dirección registrada.</p>
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

  // (Barra fija para MÓVIL - sin cambios)
  const MobileSummaryBar = () => (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      backgroundColor: 'var(--card-bg, #fff)',
      padding: '1rem',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000, display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', gap: '1rem'
    }}>
      <div>
        <span style={{ color: 'var(--muted)', fontSize: '0.9rem', display: 'block' }}>Total</span>
        <strong style={{ fontSize: '1.3rem', color: 'var(--text, #000)' }}>{formatPrice(total)}</strong>
      </div>
      <button
        className="btn btn-primary"
        onClick={handleGoToCheckout}
        disabled={cartItems.length === 0 || !isLoggedIn}
        style={{ minWidth: '140px', flexShrink: 0 }}
      >
        Ir a Checkout
      </button>
    </div>
  );

  // --- RENDERIZADO PRINCIPAL ---

  return (
    <div className="cart-layout main-content" style={{ paddingBottom: isMobile ? '120px' : '0' }}>
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
            {/* 👇 --- INICIO DE CAMBIOS EN EL ITEM DEL CARRITO --- 👇
            */}
            <div>
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  // 1. Quita la clase 'card' (que fuerza la columna) y usa 'cart-item'
                  //    que ya es flex (de tu index.css)
                  className="cart-item" 
                  style={{ 
                    width: '100%', 
                    alignItems: 'center', // Centra verticalmente
                    padding: '1rem',
                    borderBottom: '1px solid #eee' // Separador
                  }}
                >
                  
                  {/* 2. Hacemos la imagen un poco más grande */}
                  <img 
                    src={item.imagen} 
                    alt={item.nombre} 
                    className="cart-item-img"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
                  />

                  {/* 3. La información crece para empujar los controles a la derecha */}
                  <div className="cart-item-info" style={{ flexGrow: 1, padding: '0 1rem' }}>
                    <span className="cart-item-name" style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.nombre}</span>
                    <span className="cart-item-price-unit">{formatPrice(item.precio)} c/u</span>
                  </div>

                  <div className="qty-controls">
                    <button
                      onClick={() => {
                        setNotice('');
                        removeFromCart(item);
                      }}
                      className="btn btn-ghost btn-qty"
                      aria-label={`Reducir cantidad de ${item.nombre}`}
                    >
                      -
                    </button>
                    <span aria-live="polite" style={{ minWidth: 26, textAlign: 'center' }}>{item.quantity || 0}</span>
                    <button
                      onClick={() => {
                        setNotice('');
                        addToCart(item);
                      }}
                      className="btn btn-ghost btn-qty"
                      aria-label={`Aumentar cantidad de ${item.nombre}`}
                    >
                      +
                    </button>
                  </div>
                  {/* 4. Agrupamos TODOS los controles en un nuevo div */}
                  <div className="cart-item-controls-group" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', // Los apilamos verticalmente
                    alignItems: 'flex-end', // Los alineamos a la derecha
                    gap: '0.5rem', 
                    minWidth: '150px' // Damos un ancho mínimo
                  }}>

                    {/* Controles de Cantidad con botones más pequeños */}
                    <div className="qty-controls">
                      <button
                        onClick={() => { setNotice(''); removeFromCart(item); }}
                        // 5. Estilo de botón más pequeño
                        className="btn" 
                        style={{ padding: '0.25rem 0.75rem', fontSize: '1rem' }}
                        aria-label={`Reducir cantidad de ${item.nombre}`}
                      >
                        -
                      </button>
                      <span aria-live="polite" style={{ minWidth: 26, textAlign: 'center' }}>{item.quantity || 0}</span>
                      <button
                        onClick={() => { setNotice(''); addToCart(item); }}
                        // 5. Estilo de botón más pequeño
                        className="btn"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '1rem' }}
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="cart-item-subtotal">
                      <strong style={{ fontSize: '1.1rem' }}>
                        {formatPrice(Number(item.precio || 0) * Number(item.quantity || 0))}
                      </strong>
                    </div>

                    {/* Botón Eliminar (más sutil) */}
                    <div>
                      <button
                        // 5. Botón más sutil (sin fondo ni borde)
                        className="btn" 
                        style={{ 
                          padding: '0.25rem', 
                          fontSize: '0.85rem', 
                          color: 'var(--muted)', 
                          background: 'transparent', 
                          border: 'none',
                          textDecoration: 'underline'
                        }}
                        onClick={() => { setNotice(''); removeItem(item); }}
                        aria-label={`Eliminar ${item.nombre} del carrito`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div> 
                  {/* --- Fin del nuevo div de controles --- */}
                </div> // Fin de cart-item
              ))}
            </div>
            {/* 👆 --- FIN DE CAMBIOS EN EL ITEM DEL CARRITO --- 👆
            */}

            {/* Resumen (Desktop) */}
            {!isMobile && <Summary />}
          </div>
        )}
      </div>

      {/* Barra Fija (Móvil) */}
      {isMobile && cartItems.length > 0 && <MobileSummaryBar />}
    </div>
  );
}

export default Carro;