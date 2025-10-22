import React, { useEffect, useState } from 'react';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [criticos, setCriticos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: '', precio: '', stock: '', categoria_id: '', imagen_url: '',
    discount_percentage: 0
  });
  const [editando, setEditando] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [p, c, l] = await Promise.all([
      fetch('http://localhost:3001/api/productos').then(r=>r.json()),
      fetch('http://localhost:3001/api/categorias').then(r=>r.json()),
      fetch('http://localhost:3001/api/productos/low-stock').then(r=>r.json()),
    ]);
    setProductos(p.data || []);
    setCategorias(c.data || []);
    setCriticos(l.data || []);
  }

  async function crearProducto() {
    await fetch('http://localhost:3001/api/productos', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        ...nuevo,
        precio: Number(nuevo.precio || 0),
        stock: Number(nuevo.stock || 0),
        discount_percentage: nuevo.discount_percentage === '' ? null : Number(nuevo.discount_percentage)
      }),
    });
    setNuevo({ nombre:'', precio:'', stock:'', categoria_id:'', imagen_url:'', discount_percentage:0 });
    loadAll();
  }

  async function eliminarProducto(id) {
    if (!window.confirm('¿Eliminar producto?')) return;
    await fetch(`http://localhost:3001/api/productos/${id}`, { method:'DELETE' });
    loadAll();
  }

  async function guardarEdicion() {
    await fetch(`http://localhost:3001/api/productos/${editando.id}`, {
      method: 'PUT',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        ...editando,
        precio: Number(editando.precio || 0),
        stock: Number(editando.stock || 0),
        discount_percentage: editando.discount_percentage === '' ? null : Number(editando.discount_percentage)
      }),
    });
    setEditando(null);
    loadAll();
  }

  async function subirImagen(file, setTarget) {
    const fd = new FormData();
    fd.append('image', file);
    try {
      setUploading(true);
      const res = await fetch('http://localhost:3001/api/productos/upload-image', {
        method:'POST',
        body: fd,
      });
      const j = await res.json();
      if (res.ok && j.url) {
        setTarget(j.url);
      } else {
        alert(j.error || 'Error subiendo imagen');
      }
    } finally {
      setUploading(false);
    }
  }

  const Precio = ({ p }) => (
    <span>
      {new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(Number(p || 0))}
    </span>
  );

  return (
    <main className="main-content">
      <div className="container">

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">
            <h1 style={{ marginTop:0 }}>Administrar Productos</h1>
            <p className="card-sub">Crear / editar / eliminar. También verás productos con stock crítico.</p>

            {/* Form nuevo */}
            <div style={{ display:'grid', gap:8, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', marginTop:12 }}>
              <input placeholder="Nombre" value={nuevo.nombre} onChange={e=>setNuevo({...nuevo, nombre:e.target.value})}/>
              <input placeholder="Precio" type="number" value={nuevo.precio} onChange={e=>setNuevo({...nuevo, precio:e.target.value})}/>
              <input placeholder="Stock" type="number" value={nuevo.stock} onChange={e=>setNuevo({...nuevo, stock:e.target.value})}/>
              <select value={nuevo.categoria_id} onChange={e=>setNuevo({...nuevo, categoria_id:e.target.value})}>
                <option value="">Categoría</option>
                {categorias.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <input placeholder="Descuento (0..1)" type="number" step="0.01" value={nuevo.discount_percentage}
                     onChange={e=>setNuevo({...nuevo, discount_percentage:e.target.value})}/>
              <div>
                <input type="text" placeholder="Imagen URL" value={nuevo.imagen_url}
                       onChange={e=>setNuevo({...nuevo, imagen_url:e.target.value})}/>
                <input type="file" accept="image/*" onChange={(e)=> e.target.files?.[0] && subirImagen(e.target.files[0], (url)=>setNuevo({...nuevo, imagen_url:url}))}/>
                {uploading && <p className="card-sub">Subiendo...</p>}
              </div>
            </div>

            <button className="btn btn-primary" style={{ marginTop:10 }} onClick={crearProducto}>Agregar Producto</button>
          </div>
        </div>

        {/* Stock crítico */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">
            <h2 style={{ marginTop:0 }}>Productos con Stock Crítico</h2>
            {criticos.length === 0 ? (
              <p>No hay productos críticos.</p>
            ) : (
              <div className="grid">
                {criticos.map(p=>(
                  <div key={p.id} className="card" style={{ padding:12 }}>
                    <h3 style={{ marginTop:0 }}>{p.nombre}</h3>
                    <p>Stock: <strong>{p.stock}</strong></p>
                    <p>Precio: <Precio p={p.precio}/></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lista y edición */}
        <div className="card">
          <div className="card-body">
            <h2 style={{ marginTop:0 }}>Todos los Productos</h2>
            <div className="grid">
              {productos.map(p=>(
                <div key={p.id} className="card" style={{ padding:12 }}>
                  {editando?.id === p.id ? (
                    <>
                      <input value={editando.nombre} onChange={e=>setEditando({...editando, nombre:e.target.value})}/>
                      <input type="number" value={editando.precio} onChange={e=>setEditando({...editando, precio:e.target.value})}/>
                      <input type="number" value={editando.stock} onChange={e=>setEditando({...editando, stock:e.target.value})}/>
                      <select value={editando.categoria_id || ''} onChange={e=>setEditando({...editando, categoria_id:e.target.value})}>
                        <option value="">(Sin categoría)</option>
                        {categorias.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                      <input type="number" step="0.01" value={editando.discount_percentage ?? ''} onChange={e=>setEditando({...editando, discount_percentage:e.target.value})} placeholder="Descuento (0..1)"/>
                      <input value={editando.imagen_url || ''} onChange={e=>setEditando({...editando, imagen_url:e.target.value})} placeholder="Imagen URL"/>
                      <input type="file" accept="image/*" onChange={(e)=> e.target.files?.[0] && subirImagen(e.target.files[0], (url)=>setEditando({...editando, imagen_url:url}))}/>
                      {uploading && <p className="card-sub">Subiendo...</p>}

                      <div style={{ display:'flex', gap:8, marginTop:8 }}>
                        <button className="btn btn-primary" onClick={guardarEdicion}>Guardar</button>
                        <button className="btn btn-ghost" onClick={()=>setEditando(null)}>Cancelar</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 style={{ marginTop:0 }}>{p.nombre}</h3>
                      {p.imagen_url && <img src={p.imagen_url} alt={p.nombre} style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8 }}/>}
                      <p className="card-sub">Precio: <Precio p={p.precio}/></p>
                      <p className="card-sub">Stock: {p.stock}</p>
                      {p.discount_percentage ? (
                        <p style={{ color:'var(--brand)', fontWeight:700 }}>
                          Descuento: {Math.round(p.discount_percentage * 100)}%
                        </p>
                      ) : null}

                      <div style={{ display:'flex', gap:8, marginTop:8 }}>
                        <button className="btn btn-primary" onClick={()=>setEditando(p)}>Editar</button>
                        <button className="btn btn-ghost" onClick={()=>eliminarProducto(p.id)}>Eliminar</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
