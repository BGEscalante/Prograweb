import { useState } from 'react';
import { Link } from 'react-router-dom';
import GestionSalas from './GestionSalas';
import GestionPeliculas from './GestionPeliculas';
import GestionUsuarios from './GestionUsuarios'; 
import { FiSettings, FiFilm, FiLogOut, FiGrid, FiUsers } from 'react-icons/fi';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [view, setView] = useState('salas');

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2 className="admin-title">
          <FiSettings size={24} />
          Panel Administrador
        </h2>
        
        <nav className="admin-nav">
          <button 
            className={`nav-button ${view === 'salas' ? 'active' : ''}`}
            onClick={() => setView('salas')}
          >
            <FiGrid size={20} />
            Gestionar Salas
          </button>
          
          <button 
            className={`nav-button ${view === 'peliculas' ? 'active' : ''}`}
            onClick={() => setView('peliculas')}
          >
            <FiFilm size={20} />
            Gestionar Películas
          </button>

          <button 
            className={`nav-button ${view === 'usuarios' ? 'active' : ''}`}
            onClick={() => setView('usuarios')}
        >
            <FiUsers size={20} />
            Gestionar Usuarios
          </button>

        </nav>
        
        <Link to="/" className="logout-link">
          <FiLogOut size={18} />
          Cerrar sesión
        </Link>
      </div>
      
      <div className="admin-main">
        <div className="dashboard-content">
          {view === 'salas' && <GestionSalas />}
          {view === 'peliculas' && <GestionPeliculas />}
          {view === 'usuarios' && <GestionUsuarios />}
        </div>
      </div>
    </div>
  );
}