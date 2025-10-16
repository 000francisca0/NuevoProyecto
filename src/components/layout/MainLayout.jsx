
import React from 'react';
import { Outlet } from 'react-router-dom';
// La ruta '../header/header' sube un nivel desde 'layout' a 'components',
// y luego entra a la carpeta 'header' para encontrar el archivo 'header.jsx'
// CORRECTO
import Header from '../header.jsx';

function MainLayout() {
  return (
    <>
      <Header />
      <main>
        {/* Aquí se renderizará el contenido de cada página (Productos, Nosotros, etc.) */}
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;