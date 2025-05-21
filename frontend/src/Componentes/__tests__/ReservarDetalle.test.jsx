import { render, screen, fireEvent, act } from '@testing-library/react';
import ReservarDetalle from '../ReservarDetalle.jsx';
import API from '../../api';

jest.mock('../../api');

beforeEach(() => {
  API.post.mockReset();
});

test('debe mostrar grid de asientos al seleccionar fecha', async () => {
  const mockGrid = [
    { fila: 1, columnas: [{ columna: 1, reserved: false }] }
  ];
  
  API.post.mockResolvedValue({ data: mockGrid });
  
  render(<ReservarDetalle />);
  
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-select'), { 
      target: { value: '2024-01-01' }
    });
  });
  
  expect(screen.getByTestId('asiento-1-1')).toBeInTheDocument();
});