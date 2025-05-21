
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFilm, FiCalendar, FiList, FiLogOut } from 'react-icons/fi';
import Peliculas from './Peliculas';
import ReservarDetalle from './ReservarDetalle';
import MisReservaciones from './MisReservaciones';
import './ClienteDashboard.css';

export default function ClientDashboard() {
  const [view, setView] = useState('peliculas');

  return (
    <div className="cliente-container">
      <div className="cliente-sidebar">
        <h2 className="cliente-title">CinePo-lis</h2>
        <nav className="cliente-nav">
          <button 
            className={`cliente-nav-button ${view === 'peliculas' ? 'active' : ''}`}
            onClick={() => setView('peliculas')}
          >
            <FiFilm className="nav-icon" />
            Películas
          </button>
        
          <button 
            className={`cliente-nav-button ${view === 'misReservas' ? 'active' : ''}`}
            onClick={() => setView('misReservas')}
          >
            <FiList className="nav-icon" />
            Mis Reservas
          </button>
        </nav>
        <Link to="/" className="logout-link">
          <FiLogOut />
          Cerrar sesión
        </Link>
      </div>
      
      <div className="cliente-main">
        {view === 'peliculas' && <Peliculas />}
        {view === 'reservar' && <ReservarDetalle />}
        {view === 'misReservas' && <MisReservaciones />}
      </div>
    </div>
  );
}