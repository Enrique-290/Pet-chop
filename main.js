// ---------------------------
// Estado y almacenamiento
// ---------------------------
const LS_KEY = 'petshop_pos_demo_state_v1';

const defaultState = {
  negocio: 'PetShop Amigos',
  productos: [
    { id: 1, nombre: 'Croquetas cachorro', categoria: 'Alimento', especie: 'Perro', precio: 420, stock: 12 },
    { id: 2, nombre: 'Arena aglomerante', categoria: 'Higiene', especie: 'Gato', precio: 150, stock: 25 },
    { id: 3, nombre: 'Correa reforzada', categoria: 'Accesorio', especie: 'Perro', precio: 180, stock: 8 }
  ],
  clientes: [
    { id: 1, nombre: 'Juan Pérez', telefono: '555-123-4567', mascota: 'Luna (perrita)' },
    { id: 2, nombre: 'Ana Gómez', telefono: '555-987-6543', mascota: 'Michi (gato)' }
  ],
  ventas: []
};

let state = loadState();

// ---------------------------
// Utilidades de estado
// ---------------------------
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      productos: parsed.productos || structuredClone(defaultState.productos),
      clientes: parsed.clientes || structuredClone(defaultState.clientes),
      ventas: parsed.ventas || []
    };
  } catch (err) {
    console.error('Error cargando estado, usando default:', err);
    return structuredClone(defaultState);
  }
}

function saveState() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error guardando estado:', err);
  }
}

const appContext = {
  getState: () => state,
  setState: (updater) => {
    const next = typeof updater === 'function' ? updater(structuredClone(state)) : updater;
    state = next;
    saveState();
  }
};

// ---------------------------
// Navegación entre vistas
// ---------------------------
import { renderDashboard } from './modules/dashboard.js';
import { renderProductos } from './modules/productos.js';
import { renderClientes } from './modules/clientes.js';
import { renderVentas } from './modules/ventas.js';
import { renderReportes } from './modules/reportes.js';

const viewContainer = document.getElementById('view-container');
const navButtons = document.querySelectorAll('.nav-item');

function setActiveNav(view) {
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
}

function loadView(view) {
  setActiveNav(view);
  viewContainer.innerHTML = '';

  switch (view) {
    case 'dashboard':
      renderDashboard(viewContainer, appContext);
      break;
    case 'productos':
      renderProductos(viewContainer, appContext);
      break;
    case 'clientes':
      renderClientes(viewContainer, appContext);
      break;
    case 'ventas':
      renderVentas(viewContainer, appContext);
      break;
    case 'reportes':
      renderReportes(viewContainer, appContext);
      break;
    default:
      renderDashboard(viewContainer, appContext);
  }
}

// Eventos de navegación
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.view;
    loadView(view);
  });
});

// Primer render
document.addEventListener('DOMContentLoaded', () => {
  loadView('dashboard');
});
