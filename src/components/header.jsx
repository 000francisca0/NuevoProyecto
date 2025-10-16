import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/cartContext'; // 1. Importa el contexto del carrito
import { BsCart4 } from 'react-icons/bs'; 
import './header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  // 2. Usa el contexto para obtener los productos del carrito
  const { cartItems } = useContext(CartContext); 

  // 3. Calcula el número total de productos sumando las cantidades
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="logo-container">
        <Link to="/home">
          <img src="/oso5.jpg" alt="Logo Peluchemania" className="logo" />
        </Link>
      </div>

      <nav className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/nosotros">Nosotros</Link>
        <Link to="/blog">Blog</Link>
      </nav>

      <div className="right-container">
        <div className="cart-container">
          <Link to="/carro" className="cart-link">
            <BsCart4 className="cart-icon" />
            {/* 4. Muestra la "burbuja" con el total solo si es mayor a 0 */}
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>

        <div className="mobile-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-nav-links">
          <Link to="/home" onClick={handleLinkClick}>Home</Link>
          <Link to="/productos" onClick={handleLinkClick}>Productos</Link>
          <Link to="/nosotros" onClick={handleLinkClick}>Nosotros</Link>
          <Link to="/blog" onClick={handleLinkClick}>Blog</Link>
          <Link to="/carro" className="mobile-cart-link" onClick={handleLinkClick}>
            <BsCart4 className="cart-icon-mobile" />
            <span>Carrito</span>
            {totalItems > 0 && <span className="cart-badge-mobile">{totalItems}</span>}
          </Link>
        </nav>
      )}
    </header>
  );
}

export default Header;