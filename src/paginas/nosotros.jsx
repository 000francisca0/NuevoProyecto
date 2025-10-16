// src/paginas/Nosotros.jsx (Versión Corregida)

import React from 'react';
// No requiere importación CSS, usa el estilo global

function Nosotros() {
  return (
    // 💡 CAMBIO: Usamos la clase 'home-container' para el centrado
    <div className="home-container"> 
      
      <div className="content-card"> {/* Tarjeta de contenido */}
        <h1>Nuestra Historia: El Origen de Peluchemania 🧸</h1>
        
        <p>
          En **Peluchemania**, nuestra historia comienza con un simple osito de peluche, 
          un regalo de la abuela que despertó la imaginación. Fundada en **2015**, 
          nuestra misión ha sido siempre la misma: llevar consuelo, alegría y un amigo 
          suave a cada hogar, sin importar la edad.
        </p>

        <h2>Nuestra Promesa de Calidad</h2>
        <p>
          Cada uno de nuestros peluches es seleccionado y fabricado con el más alto 
          estándar de calidad, utilizando materiales hipoalergénicos y duraderos. 
          Creemos que un peluche no es solo un juguete, sino un compañero de vida 
          que merece durar.
        </p>
        
        <h2>Visión a Futuro</h2>
        <p>
          Queremos ser la tienda de peluches favorita de Chile, expandiendo nuestra 
          colección para incluir personajes únicos y ediciones limitadas. Gracias por 
          ser parte de nuestra suave y adorable aventura.
        </p>
      </div>
      
    </div>
  );
}

export default Nosotros;