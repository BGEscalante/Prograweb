
import { useEffect, useState } from 'react';
import API from '../api';

export default function ReservarSala() {
  const [salas, setSalas] = useState([]);
  const [salaId, setSalaId] = useState('');
  const [fecha, setFecha] = useState('');
  const [asientos, setAsientos] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get('/salas')
      .then(r => {
        console.log('Salas recibidas:', r.data);
        setSalas(r.data);
      })
      .catch(err => {
        console.error('Error al cargar salas:', err);
      });
  }, []);

  const handleReserva = async e => {
    e.preventDefault();
    try {
      await API.post('/reservas', { sala_id: salaId, fecha_reserva: fecha, asientos });
      setMsg('Reserva exitosa ✓');
    } catch (e) {
      setMsg(e.response?.data?.error || 'Error al reservar');
    }
  };

  return (
    <div>
      <h3>Reservar Sala</h3>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleReserva}>
        <label>Sala:</label>
        <select 
          value={salaId}
          onChange={e => setSalaId(e.target.value)}
        >
          <option value="">Seleccione</option>
          {salas.map(s => (
             <option key={s.id} value={s.id}>
                 {s.sala_nombre} 
             </option>
            ))}
        </select>
        <br/>
        <label>Fecha:</label>
        <input 
          type="date" 
          value={fecha}
          onChange={e => setFecha(e.target.value)} 
        />
        <br/>
        <button type="submit">Reservar</button>
      </form>

      <p>Asientos seleccionados: {asientos.map(a => `${a.fila}-${a.columna}`).join(', ')}</p>
    </div>
  );
}
