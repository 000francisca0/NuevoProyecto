// src/paginas/checkout.jsx
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaHome } from 'react-icons/fa';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price || 0);

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { cartItems, clearCart } = useContext(CartContext);

  const [boletaId, setBoletaId] = useState(null);

  useEffect(() => {
    // Only redirect if not logged in, OR there is no cart AND no recent boleta
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    if (cartItems.length === 0 && !boletaId) {
      navigate('/carro');
    }
  }, [isLoggedIn, cartItems.length, boletaId, navigate]);

  const defaults = user?.direccion_default || {};
  const [calle, setCalle] = useState(defaults.calle || '');
  const [depto, setDepto] = useState(defaults.depto || '');
  const [region, setRegion] = useState(defaults.region || '');
  const [comuna, setComuna] = useState(defaults.comuna || '');

  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const total = useMemo(
    () => cartItems.reduce((s, it) => s + Number(it.precio || 0) * Number(it.quantity || 0), 0),
    [cartItems]
  );

  const validate = () => {
    if (!calle || calle.trim().length < 5) return 'La calle y numeración son requeridas.';
    if (!region) return 'La Región es requerida.';
    if (!comuna) return 'La Comuna es requerida.';
    return '';
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate(); if (v) return setError(v);

    setIsProcessing(true);
    try {
      const simplifiedCart = cartItems.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: Number(item.precio),
        quantity: Number(item.quantity),
        imagen: item.imagen,
      }));

      const payload = {
        userId: user.id,
        cartItems: simplifiedCart,
        shippingAddress: { calle, depto: depto || null, region, comuna },
      };

      const resp = await fetch('http://localhost:3001/api/checkout/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setIsProcessing(false);
        return setError(data?.error || 'Ocurrió un error al procesar la compra.');
      }
      setBoletaId(data.boletaId);
      clearCart();
      setIsProcessing(false);
    } catch {
      setIsProcessing(false);
      setError('No se pudo conectar con el servidor o ocurrió un error interno.');
    }
  };

  if (boletaId) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="center-card">
          <h2>¡Compra exitosa!</h2>
          <p className="mb-2">Boleta ID:</p>
          <p style={{ fontWeight: 800, fontSize: '1.25rem' }}>{boletaId}</p>
          <p className="mb-2">Envío a:</p>
          <p className="mb-2">
            <strong>{region}</strong>, {comuna}
          </p>
          <p className="mb-2">
            {calle} {depto ? `(${depto})` : ''}
          </p>
          <Link to="/home" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Volver a Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <h1 className="mb-2">Checkout</h1>

      <div className="cart-grid">
        {/* Form */}
        <section>
          <div className="form-shell">
            <h2 style={{ marginTop: 0 }}>Dirección de Envío</h2>
            {error && <div className="server-error-message">{error}</div>}

            <form onSubmit={handlePurchase} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="chkRegion">Región</label>
                <div className="input-icon-wrapper">
                  <input id="chkRegion" className="form-control" type="text" placeholder="Región"
                    value={region} onChange={(e) => setRegion(e.target.value)} />
                  <FaMapMarkerAlt className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="chkComuna">Comuna</label>
                <div className="input-icon-wrapper">
                  <input id="chkComuna" className="form-control" type="text" placeholder="Comuna"
                    value={comuna} onChange={(e) => setComuna(e.target.value)} />
                  <FaMapMarkerAlt className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="chkCalle">Calle y Numeración</label>
                <div className="input-icon-wrapper">
                  <input id="chkCalle" className="form-control" type="text" placeholder="Ej: Av. Vicuña Mackenna 4860"
                    value={calle} onChange={(e) => setCalle(e.target.value)} />
                  <FaHome className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="chkDepto">Departamento / Casa (Opcional)</label>
                <div className="input-icon-wrapper">
                  <input id="chkDepto" className="form-control" type="text" placeholder="Ej: Depto 501"
                    value={depto} onChange={(e) => setDepto(e.target.value)} />
                  <FaHome className="input-icon" />
                </div>
              </div>

              <button className="btn btn-primary btn-block" type="submit" disabled={isProcessing}>
                {isProcessing ? 'Procesando compra...' : 'Confirmar y Pagar'}
              </button>

              <Link to="/carro" className="text-center" style={{ display: 'block', marginTop: 12 }}>
                Volver al Carrito
              </Link>
            </form>
          </div>
        </section>

        {/* Summary */}
        <aside className="summary card">
          <h2>Resumen</h2>
          <div>
            {cartItems.map((it) => (
              <div key={it.id} className="cart-item" style={{ padding: '.75rem 0', boxShadow: 'none' }}>
                <img src={it.imagen} alt={it.nombre} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{it.nombre}</div>
                  <div style={{ color: 'var(--muted)' }}>
                    {it.quantity} × {formatPrice(it.precio)}
                  </div>
                </div>
                <div style={{ fontWeight: 700 }}>
                  {formatPrice(Number(it.precio || 0) * Number(it.quantity || 0))}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>{formatPrice(total)}</span>
          </div>
          <div style={{ marginTop: '.75rem', fontSize: '.9rem', color: 'var(--brand-hover)' }}>
            *El envío usa tu dirección indicada a la izquierda.
          </div>
        </aside>
      </div>
    </div>
  );
}
