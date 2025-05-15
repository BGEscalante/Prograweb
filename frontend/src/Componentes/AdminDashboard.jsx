
import { useState } from 'react';
import { Link } from 'react-router-dom';
import GestionSalas from './GestionSalas';
import GestionPeliculas from './GestionPeliculas';

export default function AdminDashboard() {
  const [view, setView] = useState('salas');

  return (
    <div>
      <h2>Panel Admin</h2>
      <nav>
        <button onClick={()=>setView('salas')}>Gestionar Salas</button>
        <button onClick={()=>setView('peliculas')}>Gestionar Películas</button>
        <Link to="/">Cerrar sesión</Link>
      </nav>
      <hr/>
      {view==='salas' && <GestionSalas />}
      {view==='peliculas' && <GestionPeliculas />}
    </div>
  );
}
