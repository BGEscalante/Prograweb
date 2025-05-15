import { useEffect, useState } from 'react';
import API from '../api';

function ListaSalas() {
  const [salas, setSalas] = useState([]);

  useEffect(() => {
    API.get('/salas')
      .then((res) => setSalas(res.data))
      .catch(() => alert('Error al cargar salas'));
  }, []);

  return (
    <div>
      <h2>Salas disponibles</h2>
      <ul>
        {salas.map((sala) => (
          <li key={sala.id}>
            <strong>{sala.nombre}</strong> - {sala.pelicula_nombre} ({sala.disponibles} asientos)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaSalas;
