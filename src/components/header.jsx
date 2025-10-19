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
          <div className="auth-links hidden-sm" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/inicio" className="auth-link" aria-label="Iniciar sesión">
              <FaUser style={{ marginRight: 6 }} />
              <span>Iniciar Sesión</span>
            </Link>

            <Link to="/registro" className="btn btn-primary" style={{ padding: '6px 10px', fontWeight: 600 }}>
              Regístrate
            </Link>
          </div>

          <div>
            <Link to="/carro" className="cart-link" aria-label="Carrito de compras">
              <BsCart4 className="cart-icon" />
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </Link>
          </div>

          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Abrir menú"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {/* Simple hamburger using CSS bars or text fallback */}
            <div style={{ width: 22, height: 2, background: '#333', marginBottom: 5 }} />
            <div style={{ width: 18, height: 2, background: '#333', marginBottom: 5 }} />
            <div style={{ width: 14, height: 2, background: '#333' }} />
          </button>
        </div>
      </header>

      {/* Mobile dropdown - small inline style so it appears on mobile when open.
          You can move styles into CSS later (class .mobile-nav). */}
      {menuOpen && (
        <nav
          className="mobile-nav"
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            right: 0,
            background: '#fff',
            zIndex: 999,
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 10px',
            gap: 8,
          }}
          aria-label="Mobile navigation"
        >
          <Link to="/" onClick={handleLinkClick}>Home</Link>
          <Link to="/productos" onClick={handleLinkClick}>Productos</Link>
          <Link to="/categorias" onClick={handleLinkClick}>Categorías</Link>
          <Link to="/ofertas" onClick={handleLinkClick}>Ofertas</Link>
          <Link to="/nosotros" onClick={handleLinkClick}>Nosotros</Link>
          <Link to="/blog" onClick={handleLinkClick}>Blog</Link>
          <Link to="/carro" onClick={handleLinkClick} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BsCart4 /> <span>Carrito ({totalItems})</span>
          </Link>
        </nav>
      )}
    </>
  );
}

export default Header;
