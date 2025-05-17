import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { QRCodeCanvas } from 'qrcode.react';
import './ClienteDashboard.css';

export default function ReservaDetalle() {
  const { salaId } = useParams();
  const navigate = useNavigate();
  const [dates, setDates] = useState([]);
  const [fecha, setFecha] = useState('');
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const [msg, setMsg] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [qrData, setQrData] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const hoy = new Date();
    const arr = [];
    for (let i = 1; i <= 8; i++) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      arr.push(d.toISOString().slice(0,10));
    }
    setDates(arr);
    setFecha(arr[0]);
  }, []);

  useEffect(() => {
    if (!fecha) return;
    API.post('/reservas/disponibilidad', { sala_id: salaId, fecha_reserva: fecha })
      .then(res => setGrid(res.data))
      .catch(() => setMsg('Error al cargar butacas'));
  }, [fecha, salaId]);

  const toggleSeat = (f, c, reserved) => {
    if (reserved) return;
    const exists = selected.some(a => a.fila === f && a.columna === c);
    setSelected(prev => 
      exists ? prev.filter(a => !(a.fila === f && a.columna === c)) 
      : [...prev, { fila: f, columna: c }]
    );
  };

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const res = await API.post('/reservas', {
        sala_id: salaId,
        fecha_reserva: fecha,
        asientos: selected
      });
      
      setQrData(JSON.stringify({
        reservaId: res.data.id,
        sala: salaId,
        fecha,
        asientos: selected
      }));
      
      // Simular pago exitoso
      setTimeout(() => {
        setShowPayment(false);
        navigate('/cliente', { state: { reservationSuccess: true } });
      }, 2000);

    } catch (e) {
      setMsg(e.response?.data?.error || 'Error en el pago');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="reserva-container">
      <button className="back-button" onClick={() => navigate('/cliente')}>
        ← Volver a Películas
      </button>

      <div className="reserva-content">
        <h2 className="section-title">Reserva - Sala {salaId}</h2>
        
        <div className="reserva-form">
          <div className="form-group">
            <label>Selecciona fecha:</label>
            <select
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="date-select"
            >
              {dates.map(d => (
                <option key={d} value={d}>
                  {new Date(d).toLocaleDateString('es-ES', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </option>
              ))}
            </select>
          </div>

          <div className="seats-container">
            <div className="grid-seats">
              {grid.map(row => (
                <div key={row.fila} className="row-seats">
                  {row.columnas.map(col => {
                    const isSelected = selected.some(a => 
                      a.fila === row.fila && a.columna === col.columna
                    );
                    return (
                      <div
                        key={col.columna}
                        className={`seat ${col.reserved ? 'reserved' : 
                          isSelected ? 'selected' : 'available'}`}
                        onClick={() => toggleSeat(row.fila, col.columna, col.reserved)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            
            <div className="seat-legend">
              <div><span className="legend available"></span> Disponible</div>
              <div><span className="legend selected"></span> Seleccionado</div>
              <div><span className="legend reserved"></span> Ocupado</div>
            </div>
          </div>

          <button
            className={`primary-button ${selected.length ? 'active' : 'disabled'}`}
            onClick={() => setShowPayment(true)}
            disabled={!selected.length}
          >
            Pagar ({selected.length} asientos)
          </button>
        </div>

        {msg && <div className="error-message">{msg}</div>}
      </div>

      {showPayment && (
        <div className="payment-modal">
          <div className="modal-content">
            <h3>Confirmación de Pago</h3>
            
            <div className="payment-details">
              <p>Sala: {salaId}</p>
              <p>Fecha: {new Date(fecha).toLocaleDateString()}</p>
              <p>Asientos: {selected.map(a => `${a.fila}-${a.columna}`).join(', ')}</p>
            </div>

            <div className="payment-form">
              <input type="text" placeholder="Número de tarjeta" className="card-input" />
              <div className="card-info">
                <input type="text" placeholder="MM/AA" className="small-input" />
                <input type="text" placeholder="CVV" className="small-input" />
              </div>
            </div>

            <div className="qr-section">
              <QRCodeCanvas value={qrData} size={128} />
              <p>Escanea el QR para verificar</p>
            </div>

            <div className="modal-actions">
              <button 
                className="secondary-button" 
                onClick={() => setShowPayment(false)}
                disabled={isPaying}
              >
                Cancelar
              </button>
              <button 
                className="primary-button" 
                onClick={handlePayment}
                disabled={isPaying}
              >
                {isPaying ? 'Procesando...' : 'Confirmar Pago'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}