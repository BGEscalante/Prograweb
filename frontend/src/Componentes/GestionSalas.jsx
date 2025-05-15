
import { useEffect, useState } from 'react';
import API from '../api';

export default function GestionSalas() {
  const [salas, setSalas] = useState([]);
  const [peliculas, setPeliculas] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    pelicula_id: '',
    filas: '',
    columnas: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/salas').then(r => setSalas(r.data));
    API.get('/peliculas').then(r => setPeliculas(r.data));
  }, []);

  const handleCrear = async () => {
    setError('');
    try {
      const payload = {
        nombre: form.nombre,
        pelicula_id: Number(form.pelicula_id),
        filas: Number(form.filas),
        columnas: Number(form.columnas)
      };
      const res = await API.post('/salas', payload);
      setSalas([...salas, {
        id: res.data.id,
        sala_nombre: form.nombre,
        pelicula_nombre: peliculas.find(p => p.id === payload.pelicula_id)?.nombre || '',
        pelicula_imagen_url: peliculas.find(p => p.id === payload.pelicula_id)?.imagen_url || '',
        disponibles: payload.filas * payload.columnas
      }]);
      setForm({ nombre: '', pelicula_id: '', filas: '', columnas: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear sala');
    }
  };

  const handleBorrar = async id => {
    setError('');
    try {
      await API.delete(`/salas/${id}`);
      setSalas(salas.filter(s => s.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar sala');
    }
  };

  return (
    <div>
      <h3>Gestionar Salas</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '2rem' }}>
        <h4>Crear Sala</h4>
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
        />
        <select
          value={form.pelicula_id}
          onChange={e => setForm({ ...form, pelicula_id: e.target.value })}
        >
          <option value="">Selecciona película</option>
          {peliculas.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
        <input
          placeholder="Filas"
          type="number"
          value={form.filas}
          onChange={e => setForm({ ...form, filas: e.target.value })}
        />
        <input
          placeholder="Columnas"
          type="number"
          value={form.columnas}
          onChange={e => setForm({ ...form, columnas: e.target.value })}
        />
        <button onClick={handleCrear}>Crear</button>
      </div>

      <h4>Salas existentes</h4>
      <ul>
        {salas.map(s => (
          <li key={s.id} style={{ marginBottom: '1rem' }}>
            {s.sala_nombre} — <em>{s.pelicula_nombre}</em> — {s.disponibles} disponibles
            <button
              style={{ marginLeft: '1rem' }}
              onClick={() => handleBorrar(s.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
