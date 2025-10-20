// src/paginas/Carro.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/cartContext';

function Carro() {
  const { cartItems, addToCart, removeFromCart, removeItem, clearCart } = useContext(CartContext);

  // Detectar móvil (<=768px)
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

  const formatPrice = (price) => new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP'
  }).format(price);

  // estilos en línea mínimos para evitar overflow y mantener footer abajo
  const pageStyle = { minHeight: 'calc(100vh - 140px)' };
  const containerSafe = { boxSizing: 'border-box', maxWidth: '100%', overflowX: 'hidden' };

  const imgStyleMobile = { width: 64, height: 64, objectFit: 'cover', borderRadius: 6, flex: '0 0 64px' };
  const textBlockMobile = { flex: '1 1 auto', minWidth: 0, overflowWrap: 'break-word' };
  const cartItemWrapMobile = { display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', flexWrap: 'wrap' };
  const qtyStyleMobile = { display: 'flex', gap: '.5rem', alignItems: 'center', flex: '0 0 auto' };

  // Render del bloque resumen (lo reutilizamos tanto para móvil como desktop)
  const Summary = () => (
    <aside className="summary" aria-label="Resumen de la compra">
      <h2>Resumen de la Compra</h2>

      <div className="summary-total">
        <span>Total</span>
        <span><strong>{formatPrice(total)}</strong></span>
      </div>

      <div className="card-actions">
        <button className="btn btn-primary btn-block">Finalizar Compra</button>
        <button className="btn btn-ghost" onClick={clearCart}>Vaciar</button>
      </div>
    </aside>
  );

  return (
    <div className="cart-layout" style={pageStyle}>
      <div className="container" style={containerSafe}>
        <h1 className="mb-2">Tu Carrito de Compras</h1>

        {cartItems.length === 0 ? (
          <div className="card">
            <div className="card-body text-center">
              <p>Tu carrito está vacío.</p>
              <Link to="/productos" className="btn btn-primary btn-block">
                Ver Productos
              </Link>
            </div>
          </div>
        ) : (
          // DESKTOP: mantenemos grid con productos a la izquierda y resumen a la derecha
          // MOBILE: mostramos productos primero y luego el resumen debajo
          <>
            {!isMobile && (
              <div className="cart-grid">
                <div>
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <img
                        src={item.imagen || item.imagen_url || '/placeholder.jpg'}
                        alt={item.nombre}
                      />

                      <div className="card-body">
                        <strong className="mb-1" style={{ display: 'block' }}>{item.nombre}</strong>
                        <span className="card-sub">{formatPrice(Number(item.precio || 0))}</span>
                      </div>

                      <div className="qty-controls" aria-label="Controles de cantidad">
                        <button
                          onClick={() => removeFromCart(item)}
                          className="btn btn-ghost"
                          aria-label={`Disminuir cantidad de ${item.nombre}`}
                        >
                          -
                        </button>
                        <span aria-live="polite">{item.quantity || 0}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="btn btn-ghost"
                          aria-label={`Aumentar cantidad de ${item.nombre}`}
                        >
                          +
                        </button>
                      </div>

                      <div><strong>{formatPrice(Number(item.precio || 0) * Number(item.quantity || 0))}</strong></div>

                      <div>
                        <button
                          className="btn btn-ghost"
                          onClick={() => removeItem(item)}
                          aria-label={`Eliminar ${item.nombre} del carrito`}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <Summary />
              </div>
            )}

            {isMobile && (
              // MOBILE layout: stacked flows so resumen queda debajo
              <div>
                <div>
                  {cartItems.map(item => (
                    <div
                      key={item.id}
                      className="cart-item"
                      style={cartItemWrapMobile}
                    >
                      <img
                        src={item.imagen || item.imagen_url || '/placeholder.jpg'}
                        alt={item.nombre}
                        style={imgStyleMobile}
                      />

                      <div className="card-body" style={textBlockMobile}>
                        <strong className="mb-1">{item.nombre}</strong>
                        <span className="card-sub">{formatPrice(Number(item.precio || 0))}</span>
                      </div>

                      <div className="qty-controls" style={qtyStyleMobile} aria-label="Controles de cantidad">
                        <button
                          onClick={() => removeFromCart(item)}
                          className="btn btn-ghost"
                          aria-label={`Disminuir cantidad de ${item.nombre}`}
                        >
                          -
                        </button>
                        <span aria-live="polite" style={{ minWidth: 26, textAlign: 'center' }}>{item.quantity || 0}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="btn btn-ghost"
                          aria-label={`Aumentar cantidad de ${item.nombre}`}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ flex: '0 0 auto', fontWeight: 700 }}>
                        <strong>{formatPrice(Number(item.precio || 0) * Number(item.quantity || 0))}</strong>
                      </div>

                      <div>
                        <button
                          className="btn btn-ghost"
                          onClick={() => removeItem(item)}
                          aria-label={`Eliminar ${item.nombre} del carrito`}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* resumen abajo en móvil */}
                <div style={{ marginTop: '1rem' }}>
                  <Summary />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Carro;
