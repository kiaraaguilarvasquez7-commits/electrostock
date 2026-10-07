// Modelo Producto (tabla productos)

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

// Definición del modelo
const Producto = sequelize.define('Producto', {

  // ID (clave primaria)
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  // Nombre (obligatorio)
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Descripción (opcional)
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Precio (obligatorio)
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  // Imagen (nombre del archivo)
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Stock (cantidad disponible)
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }

});

// Exportar modelo
module.exports = Producto;