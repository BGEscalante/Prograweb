
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/autentificacion/login', { username, password });
      const { token, message } = res.data;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.tipo || 'cliente';

      localStorage.setItem('token', token);
      if (role === 'admin') navigate('/admin');
      else navigate('/cliente');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo conectar');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Usuario"
               value={username}
               onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Contraseña"
               value={password}
               onChange={e => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>
      <p>
        ¿No tienes cuenta? <a href="/registro">Regístrate</a>
      </p>
    </div>
  );
}
