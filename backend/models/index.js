// Conexión a MySQL usando Sequelize
const { Sequelize } = require('sequelize');

// Crear conexión
const sequelize = new Sequelize(
  'tienda_juanita', // BD
  'root',           // usuario
  '',               // contraseña
  {
    host: 'localhost', // servidor
    dialect: 'mysql'   // tipo de BD
  }
);

// Verificar conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch(err => {
    console.log('Error al conectar:', err);
  });

// Exportar conexión
module.exports = sequelize;