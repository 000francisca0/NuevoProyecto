import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

import "./inicio.css"; // Asume que el CSS está en la misma carpeta 'paginas'


function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Detiene el envío normal del formulario

    // --- LÓGICA DE AUTENTICACIÓN ---
    // Aquí pondrías tu validación de usuario y contraseña.
    console.log("Simulando proceso de login...");

    // Redirige a la página /home al completar (simuladamente) el login
    navigate('/home'); 
  };

  return (
    // CAMBIO CLAVE: Nuevo contenedor que aplica el max-width y centra el formulario
    <div className="login-container-wrapper"> 
        
        {/* El contenido original del formulario ('form-container') va dentro */}
        <div className="form-container">
          <h2>¡Bienvenido a Peluchemania! 🧸</h2>
          <p>Ingresa para ver nuestros adorables productos.</p>

          {/* Asignamos la función handleSubmit al evento onSubmit */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="form-group-spacing" controlId="formEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <div className="input-icon-wrapper">
                <Form.Control
                  type="email"
                  placeholder="Escribe tu correo"
                />  
                <FaEnvelope className="input-icon" />
              </div>
            </Form.Group>

            <Form.Group className="form-group-spacing" controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <div className="input-icon-wrapper">
                <Form.Control
                  type="password"
                  placeholder="Escribe tu contraseña"
                />
                <FaLock className="input-icon" />
              </div>
            </Form.Group>

            <Button
              variant="primary"
              type="submit" // ¡Debe ser 'submit' para que funcione el Form onSubmit!
              size="lg"
              className="btn-submit"
            >
              Entrar
            </Button>

            <a href="#" className="forgot-password-link">
              ¿Olvidaste tu contraseña?
            </a>
          </Form>
        </div>
        
    </div> // Cierre del login-container-wrapper
  );
}

export default LoginForm;