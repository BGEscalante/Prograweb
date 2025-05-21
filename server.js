require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuracion Swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec)); 

// Importar rutas
const rutas = require('./Backend/Rutas/rutas');

// Configurar rutas
app.use('/api', rutas);

// Conexión a BD
const db = require('./Backend/Conexion/db');
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