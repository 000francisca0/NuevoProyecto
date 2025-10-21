// src/paginas/ofertas.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

export default function Sales() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:3001/api/productos/on-sale');
        const json = await res.json();
        setItems(json?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="container"><div className="center-card">Cargando ofertas…</div></div>;

  return (
    <div className="container main-content">
      <h1 className="mb-2">Ofertas</h1>
      {items.length === 0 ? (
        <div className="center-card">No hay productos en oferta por el momento.</div>
      ) : (
        <div className="grid">
          {items.map(p => (
            <Link key={p.id} to={`/producto/${p.id}`} className="card">
              <img className="card-media" src={p.imagen_url} alt={p.nombre} />
              <div className="card-body">
                <h3 className="card-title">{p.nombre}</h3>
                <div>
                  <div style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>
                    {formatPrice(p.precio)}
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--brand)', fontSize: '1.2rem' }}>
                    {formatPrice(p.discounted_price)}
                  </div>
                  <div style={{ fontSize: '.9rem', color: 'var(--muted)' }}>
                    Descuento: {Math.round((p.discount_percentage || 0) * 100)}%
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <span className="btn btn-primary">Ver Detalle</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
