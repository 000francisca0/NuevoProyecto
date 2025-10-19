// src/components/header.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import { BsCart4 } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useContext(CartContext);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <header className="header-fixed" role="banner">
        <div className="header-left">
          <Link to="/" onClick={handleLinkClick}>
            <img src="/oso5.jpg" alt="Logo Peluchemania" className="logo" />
          </Link>
        </div>

        <nav className="nav" role="navigation" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/categorias">Categorías</Link>
          <Link to="/ofertas">Ofertas</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/blog">Blog</Link>
        </nav>

        <div className="right-controls">
          {/* Desktop auth links (hidden on small screens) */}
          <div className="auth-links hidden-sm" aria-hidden={menuOpen} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Reuse existing button classes from index.css so no new CSS needed */}
            <Link to="/inicio" className="btn btn-ghost" aria-label="Iniciar sesión">
              Iniciar Sesión
            </Link>

            <Link to="/registro" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Regístrate
            </Link>
          </div>

          <div>
            <Link to="/carro" className="cart-link" aria-label="Carrito de compras">
              <BsCart4 className="cart-icon" />
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </Link>
          </div>

          {/* Mobile toggle (pure CSS bars, stacked vertically) */}
          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Abrir menú"
          >
            <span className={`bar ${menuOpen ? 'open' : ''}`} />
            <span className={`bar ${menuOpen ? 'open' : ''}`} />
            <span className={`bar ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile dropdown - styled via CSS. Auth links are duplicated here for mobile use. */}
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <Link to="/" onClick={handleLinkClick}>Home</Link>
          <Link to="/productos" onClick={handleLinkClick}>Productos</Link>
          <Link to="/categorias" onClick={handleLinkClick}>Categorías</Link>
          <Link to="/ofertas" onClick={handleLinkClick}>Ofertas</Link>
          <Link to="/nosotros" onClick={handleLinkClick}>Nosotros</Link>
          <Link to="/blog" onClick={handleLinkClick}>Blog</Link>

          <hr style={{ width: '100%', border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)', margin: '8px 0' }} />

          <Link to="/inicio" onClick={handleLinkClick} className="btn btn-ghost">Iniciar Sesión</Link>
          <Link to="/registro" onClick={handleLinkClick} className="btn btn-ghost">Regístrate</Link>

          <Link to="/carro" onClick={handleLinkClick} className="mobile-cart-link" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BsCart4 /> <span>Carrito ({totalItems})</span>
          </Link>
        </nav>
      )}
    </>
  );
}

export default Header;
