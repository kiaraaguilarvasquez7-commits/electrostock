// Rutas de autenticación

const express = require('express');
const router = express.Router();

// Controladores
const { registrar, login } = require('../controllers/authController');

// Registrar usuario
router.post('/registrar', registrar);

// Iniciar sesión
router.post('/login', login);

// Exportar rutas
module.exports = router;