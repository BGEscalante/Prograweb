import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard.jsx';

// Mock de componentes hijos para simplificar pruebas
jest.mock('../GestionSalas.jsx', () => () => <div>GestionSalas</div>);
jest.mock('../GestionPeliculas.jsx', () => () => <div>GestionPeliculas</div>);

test('debe cambiar a vista de películas al hacer clic en el botón', () => {
  render(<AdminDashboard />);
  
  fireEvent.click(screen.getByText('Gestionar Películas'));
  expect(screen.getByText('GestionPeliculas')).toBeInTheDocument();
});

test('debe mostrar link de cierre de sesión', () => {
  render(<AdminDashboard />);
  expect(screen.getByText('Cerrar sesión')).toHaveAttribute('href', '/');
});