// CONTROLADOR DE AUTENTICACIÓN

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// =============================================
// REGISTRO
// =============================================
const registrar = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ where: { email } });
    if (usuarioExiste) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    // encriptar contraseña
    const passwordEncriptado = await bcrypt.hash(password, 10);

    // guardar usuario en BD
    await Usuario.create({
      nombre,
      email,
      password: passwordEncriptado
    });

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};

// =============================================
// LOGIN
// =============================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // buscar usuario
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // validar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // generar token JWT
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre },
      'clave_secreta_123',
      { expiresIn: '24h' }
    );

    // enviar token
    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
      nombre: usuario.nombre
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

module.exports = { registrar, login };