
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Peliculas from './Peliculas';
import ReservarSala from './ReservarSala';
import MisReservaciones from './MisReservaciones';

export default function ClientDashboard() {
  const [view, setView] = useState('peliculas');

  return (
    <div>
      <h2>Panel Cliente</h2>
      <nav>
        <button onClick={()=>setView('peliculas')}>Películas</button>
        <button onClick={()=>setView('reservar')}>Reservar Sala</button>
        <button onClick={()=>setView('misReservas')}>Mis Reservaciones</button>
        <Link to="/">Cerrar sesión</Link>
      </nav>
      <hr/>
      {view==='peliculas' && <Peliculas />}
      {view==='reservar'  && <ReservarSala />}
      {view==='misReservas' && <MisReservaciones />}
    </div>
  );
}
