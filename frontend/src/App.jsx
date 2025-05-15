import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './Componentes/Login';
import Registro from './Componentes/Registro';
import ClientDashboard from './Componentes/ClienteDashboard';
import AdminDashboard from './Componentes/AdminDashboard';

export default function App() {
  return (
   
      <Routes>
        <Route path="/"        element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/cliente" element={<ClientDashboard />} />
        <Route path="/admin"   element={<AdminDashboard />} />
      </Routes>
   
  );
}