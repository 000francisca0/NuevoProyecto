import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleGoToProducts = () => {
    navigate('/productos');
  };

  useEffect(() => {
    // set base background for general site
    document.body.classList.add('bg-base');
    return () => {
      document.body.classList.remove('bg-base');
    };
  }, []);

  return (
    <main className="main-content">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)' }}>
        <div className="center-card">
          <h1>¡Bienvenido a Peluchemania! 🧸</h1>
          <p>
            Aquí puedes ver nuestros adorables productos y encontrar a tu próximo amigo de peluche.
          </p>

          <button className="btn btn-primary" onClick={handleGoToProducts} style={{ marginTop: 16 }}>
            Ver Productos
          </button>
        </div>
      </div>
    </main>
  );
}

export default Home;
