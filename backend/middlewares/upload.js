// =============================================
// CONFIGURACIÓN DE MULTER PARA SUBIR IMÁGENES
// =============================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// =============================================
// ASEGURAR QUE EXISTA LA CARPETA uploads/
// Si no existe, la crea automáticamente
// =============================================
const uploadPath = 'uploads/';

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// =============================================
// CONFIGURACIÓN DE ALMACENAMIENTO
// Define dónde y cómo se guardan las imágenes
// =============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // carpeta donde se guarda
  },
  filename: (req, file, cb) => {
    // Nombre único para evitar conflictos
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// =============================================
// FILTRO DE ARCHIVOS
// Solo permite imágenes
// =============================================
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|webp/;
  const esValido = tiposPermitidos.test(file.mimetype);

  if (esValido) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes'), false);
  }
};

// =============================================
// CONFIGURACIÓN FINAL DE MULTER
// =============================================
const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;