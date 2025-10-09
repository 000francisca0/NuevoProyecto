import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Inicio from './components/inicio.jsx';

function App() {
  return (
    <div className="App">
      {/* Usando el componente con Mayúscula inicial */}
      <Inicio /> 
    </div>
  );
}

export default App
