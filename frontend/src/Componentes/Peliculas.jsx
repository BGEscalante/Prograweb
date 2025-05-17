// src/Componentes/Peliculas.jsx
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './ClienteDashboard.css';


export default function Peliculas() {
  const [salas, setSalas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/salas')
      .then(res => setSalas(res.data))
      .catch(() => console.error('Error al obtener salas'));
  }, []);

  return (
    <div>
      <h2 className="section-title">Salas Disponibles</h2>
      <div className="peliculas-grid">
        {salas.map(s => (
          <div 
            key={s.id} 
            className="pelicula-card"
            onClick={() => navigate(`/cliente/reservar/${s.id}`)}
          >
            <img 
              src={s.pelicula_imagen_url} 
              className="pelicula-image"
              alt={s.pelicula_nombre}
            />
            <div className="pelicula-content">
              <h3>{s.pelicula_nombre}</h3>
              <p>Sala: {s.sala_nombre}</p>
              <p>Asientos disponibles: {s.disponibles}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
