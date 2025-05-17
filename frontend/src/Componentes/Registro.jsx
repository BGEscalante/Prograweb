
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './Registro.css';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';

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
    <div className="registro-container">
      <div className="registro-card">
        <h2 className="registro-title">Crear Cuenta</h2>
        
        {msg && (
          <div className={msg.includes('✓') ? 'success-message' : 'error-message'}>
            {msg}
          </div>
        )}

        <form className="registro-form" onSubmit={handleRegistro}>
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
            <FiArrowRight className="button-icon" />
            Registrar
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <a href="/">Iniciar sesión</a>
        </p>
      </div>
    </div>
  );
}