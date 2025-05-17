// src/Componentes/GestionSalas.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent,
  Grid, MenuItem, Select, TextField, Typography
} from '@mui/material';
import API from '../api';
import './AdminDashboard.css';

export default function GestionSalas() {
  const [salas, setSalas] = useState([]);
  const [pelis, setPelis] = useState([]);
  const [form, setForm] = useState({ nombre:'', pelicula_id:'', filas:'', columnas:'' });
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/salas').then(r=>setSalas(r.data));
    API.get('/peliculas').then(r=>setPelis(r.data));
  }, []);

  const crear = async () => {
    setError('');
    try {
      const payload = {
        nombre: form.nombre,
        pelicula_id: Number(form.pelicula_id),
        filas: Number(form.filas),
        columnas: Number(form.columnas)
      };
      const res = await API.post('/salas', payload);
      const pelicula = pelis.find(p=>p.id===payload.pelicula_id);
      setSalas([...salas, {
        id: res.data.id,
        sala_nombre: payload.nombre,
        pelicula_nombre: pelicula.nombre,
        pelicula_imagen_url: pelicula.imagen_url,
        disponibles: payload.filas*payload.columnas
      }]);
      setForm({ nombre:'', pelicula_id:'', filas:'', columnas:'' });
    } catch (e) {
      setError(e.response?.data?.error || 'Error al crear sala');
    }
  };

  const borrar = async id => {
    setError('');
    try {
      await API.delete(`/salas/${id}`);
      setSalas(salas.filter(s=>s.id!==id));
    } catch (e) {
      setError(e.response?.data?.error || 'Error al eliminar sala');
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1600px',
      margin: '0 auto',
      p: 3 
    }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Gestión de Salas
      </Typography>
      
      {error && <div className="error-message">{error}</div>}

      <Box className="gestion-form">
  {error && <div className="error-message">{error}</div>}

  <div className="payment-form">
    <div className="form-group">
      <TextField
        label="Nombre de la Sala"
        value={form.nombre}
        onChange={e => setForm({...form, nombre: e.target.value})}
        className="card-input"
        fullWidth
      />
    </div>

    <div className="form-group">
      <Select
        value={form.pelicula_id}
        onChange={e => setForm({...form, pelicula_id: e.target.value})}
        displayEmpty
        className="card-input"
        fullWidth
      >
        <MenuItem value="" disabled>Seleccione pelicula</MenuItem>
        {pelis.map(p => (
          <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
        ))}
      </Select>
    </div>

    <div className="card-info">
      <TextField
        label="Filas"
        type="number"
        value={form.filas}
        onChange={e => setForm({...form, filas: e.target.value})}
        className="small-input"
      />
      <TextField
        label="Columnas"
        type="number"
        value={form.columnas}
        onChange={e => setForm({...form, columnas: e.target.value})}
        className="small-input"
      />
    </div>

    <Button 
      variant="contained" 
      className="primary-button"
      onClick={crear}
      fullWidth
    >
      Registrar Sala
    </Button>
  </div>
</Box>

      <div className="salas-grid">
        {salas.map(s => (
          <div className="sala-card" key={s.id}>
            <div className="sala-image-container">
              {s.pelicula_imagen_url && (
                <img 
                  src={s.pelicula_imagen_url} 
                  className="sala-image"
                  alt={s.pelicula_nombre}
                  onError={(e) => {
                    e.target.src = '/placeholder-sala.jpg';
                    e.target.alt = 'Imagen no disponible';
                  }}
                />
              )}
            </div>
            
            <div className="sala-content">
              <Typography variant="h6" gutterBottom>
                {s.sala_nombre}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {s.pelicula_nombre}
              </Typography>
              
              <div className="sala-stats">
                <div className="stat-item">
                  <div>🪑 Filas</div>
                  <strong>{s.filas}</strong>
                </div>
                <div className="stat-item">
                  <div>🧮 Columnas</div>
                  <strong>{s.columnas}</strong>
                </div>
                <div className="stat-item">
                  <div>🎟️ Capacidad</div>
                  <strong>{s.disponibles}</strong>
                </div>
                
              </div>
              
              <Button 
                className="delete-button"
                variant="outlined"
                fullWidth
                onClick={() => borrar(s.id)}
                sx={{ mt: 2 }}
              >
                Eliminar Sala
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}
