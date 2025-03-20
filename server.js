const express = require('express');
const cors = require('cors');
const app = express();
//require('dotenv').config();

// Middlewares
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

// Rutas
const authRoutes = require('./Rutas/rutas');
app.use('/api', authRoutes);

// Conexión a bd
const db = require('./Conexion/db');
db.query('SELECT 1')
  .then(() => console.log('Conexion a bd exitosa'))
  .catch((error) => {
    console.error('Error de conexión:', error);
    process.exit(1);  
  });


// Iniciar servidor
const PORT = 3000;
app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000jiji");
});