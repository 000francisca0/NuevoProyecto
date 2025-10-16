import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Importa tu Layout
// Este componente ya contiene el <Header />
import MainLayout from './components/layout/MainLayout';

// 2. Importa TODAS tus páginas
import LoginForm from './paginas/inicio.jsx'; // Renombrado de 'inicio' a 'LoginForm' para claridad
import Home from './paginas/home.jsx'; 
import Productos from './paginas/productos.jsx';
import Nosotros from './paginas/nosotros.jsx';
import Blog from './paginas/blog.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTA SIN HEADER --- */}
        {/* La ruta raíz "/" muestra tu formulario de login, sin el Layout. */}
        <Route path="/" element={<LoginForm />} />

        {/* --- RUTAS CON HEADER --- */}
        {/* Usamos MainLayout como plantilla para todas las rutas que necesitan el header. */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
        </Route>
        
        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;