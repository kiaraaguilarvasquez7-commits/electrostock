// =============================================
// CONTROLADOR DE PRODUCTOS (CRUD)
// =============================================

const Producto = require('../models/Producto');

// =============================================
// OBTENER TODOS LOS PRODUCTOS
// =============================================
const obtenerProductos = async (req, res) => {
  try {

    // 🔑 raw:true evita problemas con Sequelize (muy importante)
    const productos = await Producto.findAll({ raw: true });

    res.status(200).json(productos);

  } catch (error) {

    console.error("❌ ERROR EN obtenerProductos:", error);

    res.status(500).json({
      mensaje: 'Error al obtener productos'
    });
  }
};

// =============================================
// OBTENER PRODUCTO POR ID
// =============================================
const obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.status(200).json(producto.toJSON());

  } catch (error) {
    console.error('❌ Error obtenerProducto:', error);
    res.status(500).json({ mensaje: 'Error al obtener producto' });
  }
};

// =============================================
// CREAR PRODUCTO
// =============================================
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;
    if (precio < 0 || stock < 0) {
      return res.status(400).json({
        mensaje: 'Precio y stock deben ser mayores o iguales a 0'
      });
    }

    // 🔑 Imagen opcional
    const imagen = req.file ? req.file.filename : null;

    const producto = await Producto.create({
      nombre,
      descripcion,
      precio,
      stock,
      imagen
    });

    res.status(201).json({
      mensaje: 'Producto creado correctamente',
      producto: producto.toJSON()
    });

  } catch (error) {
    console.error('❌ Error crearProducto:', error);
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
};

// =============================================
// ACTUALIZAR PRODUCTO
// =============================================
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // 🔑 Mantener imagen si no se envía nueva
    const imagen = req.file ? req.file.filename : producto.imagen;

    await producto.update({
      nombre,
      descripcion,
      precio,
      stock,
      imagen
    });

    res.status(200).json({
      mensaje: 'Producto actualizado correctamente',
      producto: producto.toJSON()
    });

  } catch (error) {
    console.error('❌ Error actualizarProducto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
};

// =============================================
// ELIMINAR PRODUCTO
// =============================================
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await producto.destroy();

    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });

  } catch (error) {
    console.error('❌ Error eliminarProducto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};

// =============================================
// EXPORTS
// =============================================
module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};