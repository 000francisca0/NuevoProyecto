import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';

// *** Importaciones actualizadas para la carpeta 'paginas' ***
import LoginForm from './paginas/inicio.jsx'; 
import Home from './paginas/home.jsx'; 

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Ruta principal: Muestra el formulario de inicio de sesión */}
          <Route path="/" element={<LoginForm />} />
          
          {/* Ruta de destino: Muestra la página principal después del login */}
          <Route path="/home" element={<Home />} />
          
          {/* Ruta 404 para URLs no encontradas */}
          <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;