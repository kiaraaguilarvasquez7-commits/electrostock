// Middleware para verificar JWT
const jwt = require('jsonwebtoken');

// Verifica si el usuario tiene token válido
function verificarToken(req, res, next) {

    // Obtener header Authorization
    const authHeader = req.headers['authorization'];

    // Validar que exista
    if (!authHeader) {
        return res.status(401).json({
            mensaje: 'Acceso denegado, token no proporcionado'
        });
    }

    // Extraer token (Bearer token)
    const token = authHeader.split(' ')[1];

    // Validar formato
    if (!token) {
        return res.status(401).json({
            mensaje: 'Formato de token inválido'
        });
    }

    try {
        // Verificar token con clave secreta
        const decoded = jwt.verify(token, 'clave_secreta_123');

        // Guardar datos del usuario
        req.usuario = decoded;

        // Continuar a la ruta
        next();

    } catch (error) {
        // Token inválido o expirado
        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
}

// Exportar middleware
module.exports = verificarToken;