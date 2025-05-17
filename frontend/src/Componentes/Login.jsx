import './Login.css';
import { FiUser, FiLock } from 'react-icons/fi';
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
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Bienvenido</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FiUser className="input-icon" size={20} />
            <input
              className="login-input"
              placeholder="Usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" size={20} />
            <input
              type="password"
              className="login-input"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>

        <p className="auth-link">
          ¿No tienes cuenta? <a href="/registro">Crear cuenta</a>
        </p>
      </div>
    </div>
  );
}
