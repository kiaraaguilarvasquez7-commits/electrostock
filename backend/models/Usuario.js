// Modelo Usuario (tabla usuarios)

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

// Definición del modelo
const Usuario = sequelize.define('Usuario', {

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

  // Email (único)
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  // Contraseña (encriptada)
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }

});

// Exportar modelo
module.exports = Usuario;