// src/paginas/Categorias.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Categorias() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/categorias')
      .then(res => res.json())
      .then(json => {
        setCats(json.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="main-content">
      <div className="container">
        <div className="content-card">
          <h1>Categorías</h1>
          {loading && <p>Cargando categorías...</p>}
          <div className="grid" style={{ marginTop: 12 }}>
            {cats.map(c => (
              <div key={c.id} className="card">
                <div className="card-body">
                  <h3 className="card-title">{c.nombre}</h3>
                </div>
                <div className="card-actions">
                  <Link to={`/categoria/${c.id}`} className="btn btn-ghost">Ver</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
