import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GestionPeliculas from '../GestionPeliculas.jsx';
import API from '../../api'; // Ruta correcta desde __tests__

jest.mock('../../api');

test('debe mostrar error al enviar formulario vacío', async () => {
  API.get.mockResolvedValue({ data: [] }); // Mock de GET inicial
  
  render(<GestionPeliculas />);
  fireEvent.click(screen.getByText('Crear Nueva Película'));
  
  await waitFor(() => 
    expect(screen.getByText('Todos los campos son requeridos')).toBeVisible()
  );
});

test('debe listar películas al cargar', async () => {
  const mockPelis = [{ id: 1, nombre: 'Avengers', imagen_url: '...' }];
  API.get.mockResolvedValue({ data: mockPelis });
  
  render(<GestionPeliculas />);
  
  await waitFor(() => 
    expect(screen.getByText('Avengers')).toBeInTheDocument()
  );
});