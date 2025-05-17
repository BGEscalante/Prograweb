import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import API from '../api';
import './AdminDashboard.css';

export default function GestionPeliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [form, setForm] = useState({ nombre: '', imagen_url: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarPeliculas();
  }, []);

  const cargarPeliculas = async () => {
    try {
      const res = await API.get('/peliculas');
      setPeliculas(res.data);
    } catch (error) {
      setError('Error al cargar películas');
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleCrear = async () => {
    setError('');
    if (!form.nombre || !form.imagen_url) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      await API.post('/peliculas', form);
      await cargarPeliculas(); // Recargar datos actualizados
      setForm({ nombre: '', imagen_url: '' });

    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear película');
    }
  };

  const handleBorrar = async (id) => {
    try {
      await API.delete(`/peliculas/${id}`);
      setPeliculas(peliculas.filter(p => p.id !== id));
    } catch (err) {
      setError('Error al eliminar película');
    }
  };

  return (
    <Box className="gestion-container">
      <Typography variant="h4" className="section-title">
        Gestión de Películas
      </Typography>

      {error && <div className="error-message">{error}</div>}

      <Box className="form-container">
        <TextField
          name="nombre"
          label="Título de la película"
          value={form.nombre}
          onChange={handleChange}
          className="form-input"
          fullWidth
        />

        <TextField
          name="imagen_url"
          label="URL del póster"
          value={form.imagen_url}
          onChange={handleChange}
          className="form-input"
          fullWidth
        />

        <Button 
          variant="contained" 
          className="submit-button"
          onClick={handleCrear}
        >
          Crear Nueva Película
        </Button>
      </Box>

      <Grid container spacing={3} className="items-grid">
        {peliculas.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card className="item-card">
              <div className="item-image-container">
                <img 
                  src={p.imagen_url} 
                  alt={p.nombre}
                  className="item-image"
                  onError={(e) => {
                    e.target.src = '/placeholder-pelicula.jpg';
                    e.target.alt = 'Imagen no disponible';
                  }}
                />
              </div>
              
              <CardContent className="item-content">
                <Typography variant="h6">{p.nombre}</Typography>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  className="delete-button"
                  onClick={() => handleBorrar(p.id)}
                >
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}