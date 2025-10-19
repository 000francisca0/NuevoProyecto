// src/paginas/detallesProductos.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function DetallesProductos() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3001/api/productos/${id}/details`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error fetching product');
        setProducto(data.data);
        const imgs = data.data.images && data.data.images.length ? data.data.images : [data.data.imagen_url || data.data.imagen];
        setSelectedImage(imgs[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="container"><p>Cargando producto...</p></div>;
  if (error) return <div className="container"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!producto) return <div className="container"><p>Producto no encontrado.</p></div>;

  const images = producto.images && producto.images.length ? producto.images : [producto.imagen_url || producto.imagen];

  return (
    <main className="main-content">
      <div className="container">
        {/* The white background comes from .card (reused) */}
        <article className="card" aria-label={producto.nombre}>
          <div className="card-body" style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
              
              {/* Left column: gallery */}
              <div>
                <div className="card" style={{ padding: 0, marginBottom: 12 }}>
                  {selectedImage ? (
                    <img src={selectedImage} alt={producto.nombre} className="card-media" style={{ height: 420 }} />
                  ) : (
                    <div className="card-media" style={{ height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                      Sin imagen
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(img)} className="btn" style={{ padding: 0 }}>
                      <img src={img} alt={`${producto.nombre}-thumb-${i}`} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '8px' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right column: info */}
              <div>
                <h1 style={{ marginTop: 0 }}>{producto.nombre}</h1>
                <p className="card-sub" style={{ marginBottom: 8 }}>{producto.descripcion}</p>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand)' }}>
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(producto.precio)}
                  </span>
                  {producto.on_sale ? <span style={{ padding: '4px 8px', background: '#fff3f3', borderRadius: 6, fontWeight: 700 }}>En oferta</span> : null}
                </div>

                <p style={{ marginTop: 12 }}><strong>Stock:</strong> {producto.stock}</p>

                <div style={{ marginTop: 18 }}>
                  <button className="btn btn-primary">Agregar al carrito</button>
                </div>
              </div>

            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
