import React, { useEffect, useState } from 'react';

export default function AdminUsuarios() {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState(null); // selected user with history
  const [editing, setEditing] = useState(null);

  useEffect(()=>{ load(); },[]);
  async function load(){
    const r = await fetch('http://localhost:3001/api/users');
    const j = await r.json();
    setUsers(j.data || []);
  }

  async function openUser(u){
    const r = await fetch(`http://localhost:3001/api/users/${u.id}/boletas`);
    const j = await r.json();
    setView({ ...u, boletas: j.data || [] });
  }

  async function saveEdit(){
    await fetch(`http://localhost:3001/api/users/${editing.id}`, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(editing)
    });
    setEditing(null); setView(null); load();
  }

  return (
    <main className="main-content">
      <div className="container">

        <div className="card" style={{marginBottom:20}}>
          <div className="card-body">
            <h1 style={{marginTop:0}}>Usuarios</h1>
            <div className="grid">
              {users.map(u=>(
                <div key={u.id} className="card" style={{padding:12}}>
                  <h3 style={{marginTop:0}}>{u.nombre} {u.apellidos}</h3>
                  <p className="card-sub">{u.email}</p>
                  <p className="card-sub">Rol: {u.rol}</p>
                  <div style={{display:'flex', gap:8}}>
                    <button className="btn btn-primary" onClick={()=>openUser(u)}>Ver</button>
                    <button className="btn btn-ghost" onClick={()=>setEditing(u)}>Editar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VIEW */}
        {view && (
          <div className="card" style={{marginBottom:20}}>
            <div className="card-body">
              <h2 style={{marginTop:0}}>Detalle de {view.nombre} {view.apellidos}</h2>
              <p>Email: {view.email}</p>
              <p>Dirección: {view.calle} {view.depto ? `(${view.depto})` : ''}, {view.comuna}, {view.region}</p>

              <h3>Boletas</h3>
              {view.boletas.length === 0 ? <p>Sin compras.</p> : (
                <div className="grid">
                  {view.boletas.map(b=>(
                    <div key={b.id} className="card" style={{padding:12}}>
                      <p><strong>ID:</strong> {b.id}</p>
                      <p><strong>Fecha:</strong> {new Date(b.fecha_compra).toLocaleString()}</p>
                      <p><strong>Total:</strong> {new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(b.total)}</p>
                      <details>
                        <summary>Detalles</summary>
                        <ul>
                          {b.detalles.map(d=><li key={d.id}>{d.nombre_producto} x{d.cantidad} — {new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(d.precio_unitario)}</li>)}
                        </ul>
                      </details>
                    </div>
                  ))}
                </div>
              )}
              <div style={{marginTop:10}}>
                <button className="btn btn-ghost" onClick={()=>setView(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT */}
        {editing && (
          <div className="card">
            <div className="card-body">
              <h2 style={{marginTop:0}}>Editar Usuario</h2>
              <div style={{display:'grid', gap:8, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
                <input value={editing.nombre} onChange={e=>setEditing({...editing, nombre:e.target.value})} placeholder="Nombre"/>
                <input value={editing.apellidos} onChange={e=>setEditing({...editing, apellidos:e.target.value})} placeholder="Apellidos"/>
                <input value={editing.email} onChange={e=>setEditing({...editing, email:e.target.value})} placeholder="Email"/>
                <input value={editing.calle || ''} onChange={e=>setEditing({...editing, calle:e.target.value})} placeholder="Calle"/>
                <input value={editing.depto || ''} onChange={e=>setEditing({...editing, depto:e.target.value})} placeholder="Depto (opcional)"/>
                <input value={editing.region || ''} onChange={e=>setEditing({...editing, region:e.target.value})} placeholder="Región"/>
                <input value={editing.comuna || ''} onChange={e=>setEditing({...editing, comuna:e.target.value})} placeholder="Comuna"/>
              </div>
              <div style={{display:'flex', gap:8, marginTop:10}}>
                <button className="btn btn-primary" onClick={saveEdit}>Guardar</button>
                <button className="btn btn-ghost" onClick={()=>setEditing(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
