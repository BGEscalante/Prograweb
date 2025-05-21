import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Dialog,
  DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Typography
} from '@mui/material';
import API from '../api';
import './AdminDashboard.css';

export default function GestionPeliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [form, setForm] = useState({ nombre: '', imagen_url: '' });
  const [error, setError] = useState('');
  const [editingPelicula, setEditingPelicula] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', imagen_url: '' });

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

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
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
      await cargarPeliculas();
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

  const abrirEdicion = (pelicula) => {
    setEditingPelicula(pelicula);
    setEditForm({
      nombre: pelicula.nombre,
      imagen_url: pelicula.imagen_url
    });
  };

  const cerrarEdicion = () => {
    setEditingPelicula(null);
    setEditForm({ nombre: '', imagen_url: '' });
  };

  const handleActualizar = async () => {
    setError('');
    if (!editForm.nombre || !editForm.imagen_url) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      await API.put(`/peliculas/${editingPelicula.id}`, editForm);
      await cargarPeliculas();
      cerrarEdicion();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar película');
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
          fullWidth
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
                <Typography variant="h6" className="pelicula-title">
                  {p.nombre}
                </Typography>
                
                <div className="pelicula-actions">
                  <Button 
                    variant="contained"
                    className="edit-button"
                    onClick={() => abrirEdicion(p)}
                    fullWidth
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outlined"
                    className="delete-button"
                    onClick={() => handleBorrar(p.id)}
                    fullWidth
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cuadro de edición */}
      <Dialog 
        open={!!editingPelicula} 
        onClose={cerrarEdicion} 
        className="edit-dialog"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="dialog-title">
          Editar Película: {editingPelicula?.nombre}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            name="nombre"
            label="Título de la película"
            value={editForm.nombre}
            onChange={handleEditChange}
            className="dialog-input"
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            name="imagen_url"
            label="URL del póster"
            value={editForm.imagen_url}
            onChange={handleEditChange}
            className="dialog-input"
            fullWidth
          />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={cerrarEdicion} className="secondary-button">
            Cancelar
          </Button>
          <Button onClick={handleActualizar} className="submit-button">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}