import React, { useEffect, useState } from 'react';

export default function AdminBoletas() {
  const [boletas, setBoletas] = useState([]);
  const [view, setView] = useState(null);

  useEffect(()=>{ load(); },[]);
  async function load(){
    const r = await fetch('http://localhost:3001/api/boletas');
    const j = await r.json();
    setBoletas(j.data || []);
  }

  async function open(id){
    const r = await fetch(`http://localhost:3001/api/boletas/${id}`);
    const j = await r.json();
    setView(j.data);
  }

  const CLP = (n)=> new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(Number(n||0));

  return (
    <main className="main-content">
      <div className="container">
        <div className="card"><div className="card-body">
          <h1 style={{marginTop:0}}>Boletas</h1>
          <div className="grid">
            {boletas.map(b=>(
              <div key={b.id} className="card" style={{padding:12}}>
                <p><strong>ID:</strong> {b.id}</p>
                <p><strong>Cliente:</strong> {b.cliente}</p>
                <p><strong>Fecha:</strong> {new Date(b.fecha_compra).toLocaleString()}</p>
                <p><strong>Total:</strong> {CLP(b.total)}</p>
                <button className="btn btn-primary" onClick={()=>open(b.id)}>Ver</button>
              </div>
            ))}
          </div>
        </div></div>

        {view && (
          <div className="card" style={{marginTop:20}}>
            <div className="card-body">
              <h2 style={{marginTop:0}}>Boleta #{view.id}</h2>
              <p><strong>Fecha:</strong> {new Date(view.fecha_compra).toLocaleString()}</p>
              <p><strong>Envío:</strong> {view.calle_envio} {view.depto_envio ? `(${view.depto_envio})` : ''}, {view.comuna_envio}, {view.region_envio}</p>
              <h3>Detalles</h3>
              <ul>
                {view.detalles.map(d=>(
                  <li key={d.id}>{d.nombre_producto} x{d.cantidad} — {CLP(d.precio_unitario)}</li>
                ))}
              </ul>
              <div style={{marginTop:10}}>
                <button className="btn btn-ghost" onClick={()=>setView(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
