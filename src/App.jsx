import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Importa el proveedor del carrito que creamos
import { CartProvider } from './context/cartContext'; 

// Importa el Layout
import MainLayout from './components/layout/MainLayout';

// Importa TODAS tus páginas, incluyendo la nueva del carrito
import LoginForm from './paginas/inicio.jsx';
import Home from './paginas/home.jsx'; 
import Productos from './paginas/productos.jsx';
import Nosotros from './paginas/nosotros.jsx';
import Blog from './paginas/blog.jsx';
import Carro from './paginas/carro.jsx'; // <-- Se importa la nueva página

function App() {
  return (
    // 2. Envuelve toda la aplicación con el CartProvider
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* --- RUTA SIN HEADER --- */}
          <Route path="/" element={<LoginForm />} />

          {/* --- RUTAS CON HEADER --- */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/carro" element={<Carro />} /> {/* <-- 3. Se añade la ruta para el carrito */}
          </Route>
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;