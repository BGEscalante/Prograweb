
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Registro() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegistro = async e => {
    e.preventDefault();
    try {
      await API.post('/autentificacion/registro', { username, password });
      setMsg('Usuario creado ✓');
      setTimeout(() => navigate('/'), 1000);
    } catch {
      setMsg('Error al registrarse');
    }
  };

  return (
    <div>
      <h2>Crear Cuenta</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleRegistro}>
        <input placeholder="Usuario"
               value={username}
               onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Contraseña"
               value={password}
               onChange={e => setPassword(e.target.value)} />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}
