// src/paginas/Sales.jsx
import React, { useEffect, useState } from 'react';
import ProductCard from "../components/ProductCard/productCard.jsx";

function Sales() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3001/api/productos/on-sale');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error fetching');
        setProductos(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="main-content">
      <div className="container">
        <h1 className="mb-2">Ofertas especiales</h1>
        {loading && <p>Cargando ofertas...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && productos.length === 0 && <p>No hay productos en oferta por ahora.</p>}

        <div className="grid" style={{ marginTop: 16 }}>
          {productos.map(p => (
            <ProductCard key={p.id} producto={{...p, imagen: p.imagen_url || p.imagen}} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Sales;
