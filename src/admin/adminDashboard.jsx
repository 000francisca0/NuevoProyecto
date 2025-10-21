// src/admin/adminDashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="center-card">
        <h2>Panel de Administración</h2>
        <p className="mb-2">Bienvenido, {user?.nombre} {user?.apellidos}.</p>
        <p className="mb-2" style={{ color: 'var(--muted)' }}>
          (Aquí puedes implementar CRUD de productos/categorías, ver boletas, etc.)
        </p>
        <button className="btn btn-ghost" onClick={logout}>Cerrar sesión</button>
      </div>
    </div>
  );
}
