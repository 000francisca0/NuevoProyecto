// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CartProvider } from './context/cartContext'; 

// Importa el Layout
import MainLayout from './components/layout/MainLayout';

// Importa TODAS tus páginas
import LoginForm from './paginas/inicio.jsx';
import RegisterForm from './paginas/registro.jsx'; // Nuevo componente de registro
import Home from './paginas/home.jsx'; 
import Productos from './paginas/productos.jsx';
import Nosotros from './paginas/nosotros.jsx';
import Blog from './paginas/blog.jsx';
import Carro from './paginas/carro.jsx'; 
import CuidadoPeluches from './paginas/blogs/cuidadoPeluches.jsx';
import HistoriaOsoTeddy from './paginas/blogs/historiaOsoTeddy.jsx';
import './index.css';


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* 💡 RUTAS DE AUTENTICACIÓN (SIN HEADER/FOOTER) */}
          <Route path="/inicio" element={<LoginForm />} />
          <Route path="/registro" element={<RegisterForm />} /> 

          {/* 💡 RUTAS CON LAYOUT (Ahora Home está aquí) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} /> {/* RUTA RAÍZ es ahora Home */}
            <Route path="/productos" element={<Productos />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/carro" element={<Carro />} /> 
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/cuidado-de-peluches" element={<CuidadoPeluches />} />
            <Route path="/blog/historia-oso-teddy" element={<HistoriaOsoTeddy />} />

          </Route>
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;