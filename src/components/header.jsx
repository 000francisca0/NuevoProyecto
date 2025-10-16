import React, { useState } from 'react';
import './header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="logo-container">
        <img src="/oso5.jpg" alt="Logo Peluchemania" className="logo" />
      </div>

      {/* Navegación para escritorio */}
      <nav className="nav-links">
        <a href="/productos">Productos</a>
        <a href="/nosotros">Nosotros</a>
        <a href="/blog">Blog</a>
      </nav>

      <div className="right-container">
        {/* Este carrito solo se verá en la versión de escritorio */}
        <div className="cart-container">
          <img src="/carrito.svg" alt="Carrito de compras" className="cart-icon" />
        </div>

        {/* Icono de hamburguesa (visible solo en móvil) */}
        <div className="mobile-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>

      {/* --- CAMBIO AQUÍ --- */}
      {/* 2. Añadimos el enlace del carrito al menú desplegable */}
      {menuOpen && (
        <nav className="mobile-nav-links">
          <a href="/productos" onClick={handleLinkClick}>Productos</a>
          <a href="/nosotros" onClick={handleLinkClick}>Nosotros</a>
          <a href="/blog" onClick={handleLinkClick}>Blog</a>
          
          {/* Enlace del carrito añadido para la vista móvil */}
          <a href="/carrito" onClick={handleLinkClick}>
            <img src="/carrito.svg" alt="Carrito de compras" className="cart-icon" />
            <span>Carrito</span>
          </a>
        </nav>
      )}
    </header>
  );
}

export default Header;