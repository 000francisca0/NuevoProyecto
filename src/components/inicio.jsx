

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./inicio.css";
import { FaEnvelope, FaLock } from "react-icons/fa";



function FormFloatingCustom() {
  return (
    <div className="form-container">
      <h2>¡Bienvenido a Peluchemania! 🧸</h2>
      <p>Ingresa para ver nuestros adorables productos.</p>

      <Form>
        {/* CAMBIO: Usamos FormGroup en lugar de Form.Floating */}
        <Form.Group className="form-group-spacing" controlId="formEmail">
          {/* 1. La etiqueta ahora va primero y por fuera */}
          <Form.Label>Correo Electrónico</Form.Label>
          <div className="input-icon-wrapper">
            <Form.Control
              type="email"
              placeholder="Escribe tu correo"
            />
            <FaEnvelope className="input-icon" />
          </div>
        </Form.Group>

        {/* CAMBIO: Repetimos la misma estructura para la contraseña */}
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
          type="submit"
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
  );
}

export default FormFloatingCustom;