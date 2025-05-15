
import { useEffect, useState } from 'react';
import API from '../api';

export default function GestionPeliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [form, setForm] = useState({ nombre: '', imagen_url: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/peliculas')
      .then(res => setPeliculas(res.data))
      .catch(() => setError('Error al cargar películas'));
  }, []);

  const handleCrear = async () => {
    setError('');
    try {
      const res = await API.post('/peliculas', form);
      setPeliculas([...peliculas, { id: res.data.id, ...form }]);
      setForm({ nombre: '', imagen_url: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear película');
    }
  };

  const handleBorrar = async id => {
    setError('');
    try {
      await API.delete(`/peliculas/${id}`);
      setPeliculas(peliculas.filter(p => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar película');
    }
  };

  return (
    <div>
      <h3>Gestión de Películas</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <input
          placeholder="Nombre de película"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
        />
        <input
          placeholder="URL de imagen"
          value={form.imagen_url}
          onChange={e => setForm({ ...form, imagen_url: e.target.value })}
        />
        <button onClick={handleCrear}>Crear película</button>
      </div>
      <ul>
        {peliculas.map(p => (
          <li key={p.id}>
            <img src={p.imagen_url} alt={p.nombre} width="50" />
            {p.nombre}
            <button onClick={() => handleBorrar(p.id)} style={{ marginLeft: '1rem' }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
