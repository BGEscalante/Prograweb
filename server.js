require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Importar rutas
const rutas = require('./Rutas/rutas');

// Configurar rutas
app.use('/api', rutas);

// Conexión a BD
const db = require('./Conexion/db');
db.query('SELECT 1')
  .then(() => console.log('Conexión a BD exitosa wujuuu'))
  .catch((error) => {
    console.error('Error de conexión a BD :c:', error);
    process.exit(1);
  });

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Configurar puerto
const PORT = 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT} jijij 🚀`);
});