import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import API from '../api';
import { FiUserX, FiUserCheck } from 'react-icons/fi';
import './AdminDashboard.css';

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Verificar endpoints necesarios en el backend:
  // GET /usuarios → Devuelve lista de usuarios
  // PUT /usuarios/:id/estado → Actualiza estado (body: { activo: boolean })
  
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await API.get('/usuarios');
      if (!response.data) throw new Error('Formato de respuesta inválido');
      setUsuarios(response.data);
    } catch (error) {
      setError('Error al cargar usuarios: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstadoUsuario = async (idUsuario) => {
    try {
      setLoading(true);
      const usuario = usuarios.find(u => u.id === idUsuario);
      const nuevoEstado = !usuario.activo;
      
      await API.put(`/usuarios/${idUsuario}/estado`, { activo: nuevoEstado });
      
      setUsuarios(prev => prev.map(u => 
        u.id === idUsuario ? { ...u, activo: nuevoEstado } : u
      ));
      
    } catch (error) {
      setError('Error al actualizar usuario: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 3, backgroundColor: 'error.light', borderRadius: 2 }}>
      <Typography color="error">{error}</Typography>
    </Box>
  );

  return (
    <Box className="gestion-container">
      <Typography variant="h4" className="section-title">
        Gestión de Usuarios
      </Typography>

      <TableContainer className="tabla-usuarios">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {usuarios.map(usuario => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.nombre}</TableCell>
               
                <TableCell>{usuario.rol}</TableCell>
                <TableCell>
                  <span className={`estado ${usuario.activo ? 'activo' : 'inactivo'}`}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={usuario.activo ? 'error' : 'success'}
                    startIcon={usuario.activo ? <FiUserX /> : <FiUserCheck />}
                    onClick={() => cambiarEstadoUsuario(usuario.id)}
                  >
                    {usuario.activo ? 'Desactivar' : 'Activar'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}