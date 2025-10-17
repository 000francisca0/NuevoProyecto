import React from 'react';
import { Link } from 'react-router-dom';
// Ejemplo usando Font Awesome (Fa)
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'; 
// Si usas otra librería, ajusta las importaciones: ej. import { IoLogoFacebook } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* Sección 1: Navegación */}
        <div className="footer-section">
          <h3>Navegación</h3>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        {/* Sección 2: Contacto y Redes (Usando React Icons y Links simulados) */}
        <div className="footer-section">
          <h3>Síguenos</h3>
          {/* Se usa "Link to" para simular que son enlaces internos o no funcionales */}
          <div className="social-links">
            <Link to="/social/facebook" aria-label="Facebook"><FaFacebookF /></Link>
            <Link to="/social/instagram" aria-label="Instagram"><FaInstagram /></Link>
            <Link to="/social/twitter" aria-label="Twitter"><FaTwitter /></Link>
          </div>
          
          <p className="contact-info">Email: contacto@tiendapeluche.com</p>
        </div>
        
        {/* Sección 3: Logo/Misión Breve */}
        <div className="footer-section footer-logo">
          <h3>Tienda de Peluches</h3>
          <p>Tus amigos suaves te esperan. ¡Abrazos garantizados!</p>
        </div>
        
      </div>
      
      {/* Aviso de Copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Nuestros Adorables Peluches. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;