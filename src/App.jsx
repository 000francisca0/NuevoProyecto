// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';

import { CartProvider } from './context/cartContext';
import { AuthProvider, RequireAuth, RequireAdmin } from './context/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Auth pages (no layout)
import LoginForm from './paginas/inicio.jsx';
import RegisterForm from './paginas/registro.jsx';

// Public pages (with layout)
import Home from './paginas/home.jsx';
import Productos from './paginas/productos.jsx';
import Nosotros from './paginas/nosotros.jsx';
import Blog from './paginas/blog.jsx';
import Category from './paginas/categoria.jsx';
import Categorias from './paginas/categorias.jsx';
import Sales from './paginas/ofertas.jsx';
import ProductDetails from './paginas/detallesProductos.jsx';
import CuidadoPeluches from './paginas/blogs/cuidadoPeluches.jsx';
import HistoriaOsoTeddy from './paginas/blogs/historiaOsoTeddy.jsx';

// Cart / Checkout (require auth)
import Carro from './paginas/carro.jsx';
import Checkout from './paginas/checkout.jsx';

// Admin (require admin)
import AdminDashboard from './admin/adminDashboard.jsx';

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* AUTH ROUTES (NO LAYOUT) */}
            <Route path="/" element={<LoginForm />} />
            <Route path="/registro" element={<RegisterForm />} />

            {/* ROUTES WITH LAYOUT */}
            <Route element={<MainLayout />}>
              {/* Public */}
              <Route path="/home" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/cuidado-de-peluches" element={<CuidadoPeluches />} />
              <Route path="/blog/historia-oso-teddy" element={<HistoriaOsoTeddy />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/categoria/:categoryId" element={<Category />} />
              <Route path="/ofertas" element={<Sales />} />
              <Route path="/producto/:id" element={<ProductDetails />} />

              {/* Require login */}
              <Route
                path="/carro"
                element={
                  <RequireAuth>
                    <Carro />
                  </RequireAuth>
                }
              />
              <Route
                path="/checkout"
                element={
                  <RequireAuth>
                    <Checkout />
                  </RequireAuth>
                }
              />

              {/* Require admin */}
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                }
              />
            </Route>

            {/* 404 */}
            <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
