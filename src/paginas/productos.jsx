import React, { useEffect, useState } from 'react';
import ProductCard from "../components/ProductCard/productCard.jsx";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/productos');
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setProductos(data.data || []);
      setError(null);
    } catch (err) {
      console.error("Fallo al cargar productos:", err);
      setError("No se pudieron cargar los productos. Asegúrate que tu servidor (Node.js) esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();

    // Use white layer background for products
    document.body.classList.add('bg-white-layer');
    return () => {
      document.body.classList.remove('bg-white-layer');
    };
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <h1 className="mb-2">Cargando productos...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <h1 className="mb-2" style={{ color: 'red' }}>{error}</h1>
        </div>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="main-content">
        <div className="container">
          <h1 className="mb-2">No hay productos disponibles.</h1>
        </div>
      </div>
    );
  }

  return (
    <main className="main-content">
      <div className="container">
        <h1 className="mb-2" style={{ fontSize: '2.2rem', fontWeight: 800 }}>Nuestros Adorables Peluches</h1>

        <div className="grid">
          {productos.map(producto => (
            <ProductCard
              key={producto.id}
              producto={{ ...producto, imagen: producto.imagen_url || producto.imagen }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Productos;
