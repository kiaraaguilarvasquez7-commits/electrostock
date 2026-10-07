// =============================================
// RUTAS DE PRODUCTOS (CRUD)
// =============================================

const express = require('express');
const router = express.Router();

// Middleware de autenticación (protege las rutas)
const verificarToken = require('../middlewares/authMiddleware');

// Middleware para subir imágenes
const upload = require('../middlewares/upload');

// Controlador
const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productoController');

// =============================================
// RUTAS
// =============================================

// Obtener todos los productos
router.get('/', verificarToken, obtenerProductos);

// Obtener un producto por ID
router.get('/:id', verificarToken, obtenerProducto);

// Crear producto (incluye imagen)
router.post('/', verificarToken, upload.single('imagen'), crearProducto);

// Actualizar producto (también permite cambiar imagen)
router.put('/:id', verificarToken, upload.single('imagen'), actualizarProducto);

// Eliminar producto
router.delete('/:id', verificarToken, eliminarProducto);

module.exports = router;