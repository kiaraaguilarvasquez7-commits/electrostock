// =============================================
// SERVIDOR PRINCIPAL
// =============================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// =============================================
// MIDDLEWARES
// =============================================

// Permite leer JSON (para login, registro, etc.)
app.use(express.json());

// Permite leer formularios (IMPORTANTE para FormData)
app.use(express.urlencoded({ extended: true }));

// Permite acceder a imágenes desde el navegador
// Ej: http://localhost:3000/uploads/imagen.jpg
app.use('/uploads', express.static('uploads'));

// Seguridad, logs y conexión frontend-backend
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// =============================================
// BASE DE DATOS
// =============================================

const sequelize = require('./models/index');

// Sincroniza tablas (no borra datos)
sequelize.sync({ force: false })
  .then(() => console.log('Tablas listas'))
  .catch(err => console.log('Error BD:', err));

// =============================================
// RUTAS
// =============================================

app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));

// =============================================
// MANEJO DE ERRORES GLOBAL (CLAVE)
// Evita que el servidor se caiga y muestra errores claros
// =============================================
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    mensaje: err.message || 'Error interno del servidor'
  });
});

// =============================================
// INICIO DEL SERVIDOR
// =============================================

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});