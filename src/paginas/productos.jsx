// src/paginas/productos.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard/productCard.jsx";
import { Link } from 'react-router-dom';

export default function Productos() {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // load categories first, then products by category
    async function loadAll() {
      try {
        setLoading(true);
        const [catsRes, prodsRes] = await Promise.all([
          fetch('http://localhost:3001/api/categorias'),
          fetch('http://localhost:3001/api/productos')
        ]);

        const catsJson = await catsRes.json();
        const prodsJson = await prodsRes.json();

        if (!catsRes.ok) throw new Error(catsJson.error || 'Error loading categories');
        if (!prodsRes.ok) throw new Error(prodsJson.error || 'Error loading products');

        const cats = catsJson.data || [];
        const prods = prodsJson.data || [];

        // group products by categoria_id (use 0 for uncategorized)
        const grouped = {};
        prods.forEach(p => {
          const key = p.categoria_id || 0;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push({ ...p, imagen: p.imagen_url || p.imagen });
        });

        setCategories(cats);
        setProductsByCategory(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  return (
    <main className="main-content">
      <div className="container">

        {/* ===== TOP CARD: Title + Quick links - reusing .card/.card-body from index.css ===== */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body" style={{ paddingBottom: 16 }}>
            <h1 className="productos-title" style={{ margin: 0 }}>Nuestros Adorables Peluches</h1>
            <p className="mb-2" style={{ color: '#6c757d', marginTop: 8 }}>
              Explora por categoría o haz clic en "Ver" para ver los detalles.
            </p>

            {loading && <p style={{ marginTop: 8 }}>Cargando productos y categorías...</p>}
            {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}

            {/* Category quick links */}
            {!loading && !error && (
              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/productos" className="btn btn-ghost">Todos</Link>
                {categories.map(cat => (
                  <Link key={cat.id} to={`/categoria/${cat.id}`} className="btn btn-ghost">
                    {cat.nombre}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* ===== end TOP CARD ===== */}

        {/* Now each category section (product grid) */}
        {!loading && !error && (
          <>
            {categories.map(cat => (
              <section key={cat.id} style={{ marginBottom: 36 }}>
                <h2 style={{ margin: '12px 0', fontSize: '1.6rem' }}>{cat.nombre}</h2>
                <div className="grid">
                  {(productsByCategory[cat.id] || []).map(prod => (
                    <ProductCard key={prod.id} producto={prod} />
                  ))}

                  {((productsByCategory[cat.id] || []).length === 0) && (
                    <div className="card" style={{ padding: 20 }}>
                      <div className="card-body">
                        <p>No hay productos en esta categoría.</p>
                        <Link to="/productos" className="btn btn-ghost">Ver todos</Link>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))}

            {productsByCategory[0] && productsByCategory[0].length > 0 && (
              <section style={{ marginBottom: 36 }}>
                <h2 style={{ margin: '12px 0', fontSize: '1.6rem' }}>Otros</h2>
                <div className="grid">
                  {productsByCategory[0].map(prod => (
                    <ProductCard key={prod.id} producto={prod} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Loading / error fallback when still busy */}
        {loading && <div className="card"><div className="card-body"><p>Cargando...</p></div></div>}
        {error && <div className="card"><div className="card-body"><p style={{ color: 'red' }}>{error}</p></div></div>}

      </div>
    </main>
  );
}
