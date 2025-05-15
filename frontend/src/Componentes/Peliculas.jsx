
import { useEffect, useState } from 'react';
import API from '../api';

export default function Peliculas() {
  const [pelis, setPelis] = useState([]);

  useEffect(() => {
    API.get('/salas') 
       .then(res => setPelis(res.data))
       .catch(()=>alert('Error al cargar datos'));
  }, []);

  return (
    <div>
      <h3>Películas disponibles</h3>
      <ul>
        {pelis.map(p => (
          <li key={p.id}>
            <img src={p.pelicula_imagen_url} alt={p.pelicula_nombre} width="80"/>
            <strong>{p.pelicula_nombre}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
