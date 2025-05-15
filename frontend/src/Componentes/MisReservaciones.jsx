
import { useEffect, useState } from 'react';

export default function MisReservaciones() {
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservas = async () => {
      const token = localStorage.getItem('token');            // 1️⃣
      if (!token) {
        setError('No estás autenticado');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/reservas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`              // 2️⃣
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
      <h3>Mis Reservaciones</h3>
      {reservas.length === 0
        ? <p>No tienes reservaciones.</p>
        : (
          <ul>
            {reservas.map(r => (
              <li key={r.id}>
                Sala: {r.sala} — Fecha: {r.fecha_reserva} — Asientos: {r.asientos}
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
