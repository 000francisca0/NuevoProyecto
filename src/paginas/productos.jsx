// src/paginas/productos.jsx

import React, { useEffect, useState } from 'react';
// ❌ ¡ELIMINA la importación de productosData si todavía existe!
import ProductCard from "../components/ProductCard/productCard.jsx";

function Productos() {
  // 1. Usa useState para guardar los productos cargados de la API
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Función para obtener los datos de la API
  const fetchProductos = async () => {
    try {
      // 💡 LLAMADA A TU API DE EXPRESS
      const response = await fetch('http://localhost:3001/api/productos');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // La API devuelve el arreglo de productos en 'data.data'
      // Esto solo funciona si tu API devuelve { message: "success", data: [...] }
      setProductos(data.data); 
      setError(null);

    } catch (err) {
      console.error("Fallo al cargar productos:", err);
      setError("No se pudieron cargar los productos. Asegúrate que tu servidor (Node.js) esté corriendo.");

    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    // Cargar los productos cuando el componente se monte
    fetchProductos();

    // Lógica para el fondo
    document.body.classList.add('productos-background');
    return () => {
      document.body.classList.remove('productos-background');
    };
  }, []); 

  // 2. Muestra mensajes de estado
  if (loading) {
    return <div className="productos-page-container"><h1 className="productos-title">Cargando productos...</h1></div>;
  }

  if (error) {
    return <div className="productos-page-container"><h1 className="productos-title" style={{color: 'red'}}>{error}</h1></div>;
  }
  
  if (productos.length === 0) {
    return <div className="productos-page-container"><h1 className="productos-title">No hay productos disponibles.</h1></div>;
  }
  
  // 3. Renderiza los productos
  return (
    <div className="productos-page-container">
      <h1 className="productos-title">Nuestros Adorables Peluches</h1>
      
      <div className="productos-grid">
        {productos.map(producto => (
          // Asegúrate de que tu ProductCard pueda manejar el campo 'imagen_url' que viene de la DB
          // Si tu ProductCard espera 'imagen', debes adaptar el objeto aquí:
          <ProductCard 
            key={producto.id} 
            producto={{...producto, imagen: producto.imagen_url}} 
          /> 
        ))}
      </div>
    </div>
  );
}

export default Productos;