// src/components/header.jsx (VERSIÓN CORREGIDA Y COMPLETA)

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/cartContext'; 
import { BsCart4 } from 'react-icons/bs'; 
// 💡 Importamos el ícono de Usuario
import { FaUser } from 'react-icons/fa'; 

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useContext(CartContext); 

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="logo-container">
        {/* Usamos "/" como la nueva ruta Home */}
        <Link to="/"> 
          <img src="/oso5.jpg" alt="Logo Peluchemania" className="logo" />
        </Link>
      </div>

      <nav className="nav-links">
        {/* Links principales */}
        <Link to="/">Home</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/nosotros">Nosotros</Link>
        <Link to="/blog">Blog</Link>
      </nav>

      <div className="right-container">
        
        {/* 💡 AÑADIMOS ESTE BLOQUE DE CÓDIGO CON LAS CLASES CSS */}
        <div className="auth-links">
          <Link to="/inicio" className="auth-link">
            <FaUser className="auth-icon" /> 
            <span>Iniciar Sesión</span>
          </Link>
          <Link to="/registro" className="auth-link btn-register">
            <span>Regístrate</span>
          </Link>
        </div>
        
        <div className="cart-container">
          <Link to="/carro" className="cart-link">
            <BsCart4 className="cart-icon" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>

        {/* Ícono de menú móvil */}
        <div className="mobile-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {menuOpen && (
        <nav className="mobile-nav-links">
          <Link to="/" onClick={handleLinkClick}>Home</Link>
          <Link to="/productos" onClick={handleLinkClick}>Productos</Link>
          <Link to="/nosotros" onClick={handleLinkClick}>Nosotros</Link>
          <Link to="/blog" onClick={handleLinkClick}>Blog</Link>
          
          {/* Enlaces de Auth en menú móvil */}
          <Link to="/inicio" onClick={handleLinkClick}>Iniciar Sesión</Link>
          <Link to="/registro" onClick={handleLinkClick}>Registrarse</Link>
          
          <Link to="/carro" className="mobile-cart-link" onClick={handleLinkClick}>
            <BsCart4 className="cart-icon-mobile" />
            <span>Carrito ({totalItems})</span>
          </Link>
        </nav>
      )}
    </header>
  );
}

export default Header;