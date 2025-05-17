
import { useEffect, useState } from 'react';
import './ClienteDashboard.css';

export default function MisReservaciones() {
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservas = async () => {
      const token = localStorage.getItem('token');           
      if (!token) {
        setError('No estás autenticado');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/reservas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`              
          }
        });

        if (res.status === 401) {
          setError('Sesión expirada o no tienes permiso');
          return;
        }
        if (!res.ok) throw new Error();

        const data = await res.json();
        setReservas(data);
      } catch {
        setError('Error al obtener reservaciones');
      }
    };

    fetchReservas();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2 className="section-title">Mis Reservaciones</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="reservaciones-list">
        {reservas.length === 0 ? (
          <p>No tienes reservaciones activas.</p>
        ) : (
          reservas.map(r => (
            <div key={r.id} className="reservacion-card">
              <h4>Sala: {r.sala || 'No especificada'}</h4>
              <p>Fecha: {new Date(r.fecha_reserva).toLocaleDateString()}</p>
              <p>Asientos: {
                Array.isArray(r.asientos) 
                  ? r.asientos.join(', ') 
                  : typeof r.asientos === 'string' 
                    ? r.asientos 
                    : 'No disponible'
              }</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
