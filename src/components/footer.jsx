import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-section">
          <h3>Navegación</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Síguenos</h3>
          <div className="social">
            <Link to="/social/facebook" aria-label="Facebook"><FaFacebookF /></Link>
            <Link to="/social/instagram" aria-label="Instagram"><FaInstagram /></Link>
            <Link to="/social/twitter" aria-label="Twitter"><FaTwitter /></Link>
          </div>
          <p className="mb-2">Email: contacto@tiendapeluche.com</p>
        </div>

        <div className="footer-section">
          <h3>Tienda de Peluches</h3>
          <p>Tus amigos suaves te esperan. ¡Abrazos garantizados!</p>
        </div>
      </div>

      <div className="footer-bottom text-center">
        <p>&copy; {new Date().getFullYear()} Nuestros Adorables Peluches. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
