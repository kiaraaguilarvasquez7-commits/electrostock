// =============================================
// CONFIGURACIÓN GENERAL
// URL del backend
// =============================================
const API_URL = 'http://localhost:3000/api';
let modalProducto = null;


// =============================================
// LOGIN
// Envía credenciales al backend
// =============================================
async function login() {

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const respuesta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const datos = await respuesta.json();

    // Si login correcto → guardar sesión
    if (respuesta.ok) {
      localStorage.setItem('token', datos.token);
      localStorage.setItem('nombre', datos.usuario?.nombre || 'Usuario');
      window.location.href = 'productos.html';
    } else {
      mostrarError('error-msg', datos.mensaje);
    }

  } catch {
    mostrarError('error-msg', 'Error de conexión');
  }
}


// =============================================
// REGISTRO DE USUARIO
// =============================================
async function registrar() {

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const respuesta = await fetch(`${API_URL}/auth/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const datos = await respuesta.json();

    // Mensaje si se registra correctamente
    if (respuesta.ok) {
      mostrarExito('success-msg', 'Usuario registrado correctamente');
      setTimeout(() => window.location.href = 'index.html', 1500);
    } else {
      mostrarError('error-msg', datos.mensaje);
    }

  } catch {
    mostrarError('error-msg', 'Error de conexión');
  }
}


// =============================================
// CARGAR PRODUCTOS (DISEÑO EN CARDS)
// =============================================
async function cargarProductos() {

  const token = localStorage.getItem('token');

  try {
    const respuesta = await fetch(`${API_URL}/productos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const productos = await respuesta.json();
    const contenedor = document.getElementById('tabla-productos');

    // Si no hay productos
    if (!productos.length) {
      contenedor.innerHTML = `
        <div class="col-12 text-center text-white">
          No hay productos registrados
        </div>
      `;
      return;
    }

    // Renderiza cada producto como CARD
    contenedor.innerHTML = productos.map((p) => `

      <div class="col-md-4">
        <div class="card shadow-sm card-producto">

          <!-- Imagen -->
          ${p.imagen
        ? `<img src="http://localhost:3000/uploads/${p.imagen}" class="img-producto">`
        : `<div class="text-center p-5 text-muted">Sin imagen</div>`
      }

          <div class="card-body">

            <!-- Nombre -->
            <h5 class="card-title">${p.nombre}</h5>

            <!-- Descripción -->
            <p class="text-muted">${p.descripcion || 'Sin descripción'}</p>

            <!-- Precio -->
            <p class="precio">S/. ${p.precio}</p>

            <!-- Stock -->
            <small class="text-secondary">Stock: ${p.stock}</small>

            <!-- Botones -->
            <div class="d-flex gap-2 mt-3">

              <button class="btn btn-warning w-50"
                onclick="abrirModalEditar(
                  ${p.id},
                  '${p.nombre.replace(/'/g, "\\'")}',
                  '${(p.descripcion || '').replace(/'/g, "\\'")}',
                  ${p.precio},
                  ${p.stock}
                )">
                Editar
              </button>

              <button class="btn btn-danger w-50"
                onclick="eliminarProducto(${p.id})">
                Eliminar
              </button>

            </div>

          </div>
        </div>
      </div>

    `).join('');

  } catch {
    mostrarError('error-msg', 'Error al cargar productos');
  }
}


// =============================================
// ABRIR MODAL EDITAR
// =============================================
window.abrirModalEditar = function (id, nombre, descripcion, precio, stock) {

  document.getElementById('producto-id').value = id;
  document.getElementById('producto-nombre').value = nombre;
  document.getElementById('producto-descripcion').value = descripcion || '';
  document.getElementById('producto-precio').value = precio;
  document.getElementById('producto-stock').value = stock;

  document.getElementById('producto-imagen').value = '';
  document.getElementById('preview-imagen').src = '';

  document.getElementById('modal-titulo').textContent = 'Editar Producto';

  modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'));
  modalProducto.show();
};


// =============================================
// ABRIR MODAL AGREGAR
// =============================================
window.abrirModalAgregar = function () {

  document.getElementById('producto-id').value = '';
  document.getElementById('producto-nombre').value = '';
  document.getElementById('producto-descripcion').value = '';
  document.getElementById('producto-precio').value = '';
  document.getElementById('producto-stock').value = '';

  document.getElementById('producto-imagen').value = '';
  document.getElementById('preview-imagen').src = '';

  document.getElementById('modal-titulo').textContent = 'Agregar Producto';

  modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'));
  modalProducto.show();
};


// =============================================
// GUARDAR PRODUCTO (CREATE / UPDATE)
// =============================================
window.guardarProducto = async function () {

  const id = document.getElementById('producto-id').value;
  const token = localStorage.getItem('token');

  const formData = new FormData();
  formData.append('nombre', document.getElementById('producto-nombre').value);
  formData.append('descripcion', document.getElementById('producto-descripcion').value);
  formData.append('precio', document.getElementById('producto-precio').value);
  formData.append('stock', document.getElementById('producto-stock').value);

  const imagen = document.getElementById('producto-imagen').files[0];
  if (imagen) formData.append('imagen', imagen);

  const url = id ? `${API_URL}/productos/${id}` : `${API_URL}/productos`;
  const metodo = id ? 'PUT' : 'POST';

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (respuesta.ok) {

      modalProducto.hide();
      cargarProductos();

      // Mensaje correcto según acción
      mostrarExito(
        'success-msg',
        id
          ? 'Producto actualizado correctamente'
          : 'Producto creado correctamente'
      );

    } else {
      const error = await respuesta.json();
      mostrarError('error-msg', error.mensaje);
    }

  } catch {
    mostrarError('error-msg', 'Error al guardar producto');
  }
};


// =============================================
// ELIMINAR PRODUCTO
// =============================================
window.eliminarProducto = async function (id) {

  if (!confirm('¿Eliminar producto?')) return;

  const token = localStorage.getItem('token');

  try {
    await fetch(`${API_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    cargarProductos();

    // Mensaje correcto
    mostrarExito('success-msg', 'Producto eliminado correctamente');

  } catch {
    mostrarError('error-msg', 'Error al eliminar producto');
  }
};


// =============================================
// CERRAR SESIÓN
// =============================================
window.cerrarSesion = function () {
  localStorage.removeItem('token');
  localStorage.removeItem('nombre');
  window.location.href = 'index.html';
};


// =============================================
// PREVISUALIZAR IMAGEN
// =============================================
document.addEventListener('DOMContentLoaded', () => {

  const input = document.getElementById('producto-imagen');

  if (input) {
    input.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        document.getElementById('preview-imagen').src = URL.createObjectURL(file);
      }
    });
  }
});


// =============================================
// MENSAJES EN PANTALLA
// =============================================
function mostrarError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.remove('d-none');
}

function mostrarExito(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.remove('d-none');
}