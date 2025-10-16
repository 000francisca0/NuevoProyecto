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
        <a href="/home">🧸</a>
      </div>

      {/* Navegación para escritorio */}
      <nav className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/nosotros">Nosotros</Link>
        <Link to="/blog">Blog</Link>
      </nav>

      <div className="right-container">
        {/* Este carrito solo se verá en la versión de escritorio  <img src="/oso5.jpg" alt="Logo Peluchemania" className="logo" />*/}
        <div className="cart-container">
          <img src="/carro.jpg" alt="Carrito de compras" className="cart-icon" />
        </div>

        {/* Icono de hamburguesa (visible solo en móvil) */}
        <div className="mobile-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>

      {/* --- CAMBIO AQUÍ --- */}
      {/* 2. Añadimos el enlace del carrito al menú desplegable */}
      {menuOpen && (
      <nav className="mobile-nav-links">
          <Link to="/home" onClick={handleLinkClick}>Home</Link>
          <Link to="/productos" onClick={handleLinkClick}>Productos</Link>
          <Link to="/nosotros" onClick={handleLinkClick}>Nosotros</Link>
          <Link to="/blog" onClick={handleLinkClick}>Blog</Link>
          
          {/* Enlace del carrito añadido para la vista móvil */}
          <a href="/carrito" onClick={handleLinkClick}>
            <img src="/carro.jpg" alt="Carrito de compras" className="cart-icon" />
            <span>Carrito</span>
          </a>
        </nav>
      )}
    </header>
  );
}

export default Header;
