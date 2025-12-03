export function renderDashboard(root, ctx) {
  const state = ctx.getState();
  const totalProductos = state.productos.length;
  const totalClientes = state.clientes.length;
  const totalVentas = state.ventas.length;
  const totalIngresos = state.ventas.reduce((sum, v) => sum + v.total, 0);

  root.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <h2>Dashboard</h2>
        <span>Resumen rápido de tu PetShop</span>
      </div>
      <button class="btn btn-outline" id="btn-refresh-dash">Actualizar</button>
    </div>

    <div class="cards-grid">
      <div class="card">
        <div class="card-header">
          <span>Ingresos de hoy</span>
          <span class="card-tag">MXN</span>
        </div>
        <div class="card-value">$${totalIngresos.toFixed(2)}</div>
        <div class="chips">
          <span class="chip">Ventas: ${totalVentas}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span>Productos activos</span>
          <span class="card-tag">Inventario</span>
        </div>
        <div class="card-value">${totalProductos}</div>
        <div class="chips">
          <span class="chip">Stock bajo resaltado en Productos</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span>Clientes registrados</span>
          <span class="card-tag">Clientes</span>
        </div>
        <div class="card-value">${totalClientes}</div>
        <div class="chips">
          <span class="chip">Mascotas felices 🐾</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span>Últimas ventas</span>
        <span class="card-tag">Actividad reciente</span>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody id="dash-ventas-body">
          </tbody>
        </table>
      </div>
    </div>
  `;

  const tbody = root.querySelector('#dash-ventas-body');
  const últimas = [...state.ventas].slice(-5).reverse();

  if (!últimas.length) {
    tbody.innerHTML = '<tr><td colspan="5">Aún no hay ventas registradas.</td></tr>';
  } else {
    tbody.innerHTML = últimas.map(v => `
      <tr>
        <td>${v.folio}</td>
        <td>${v.clienteNombre || '-'}</td>
        <td>${v.productoNombre}</td>
        <td>${v.cantidad}</td>
        <td>$${v.total.toFixed(2)}</td>
      </tr>
    `).join('');
  }

  root.querySelector('#btn-refresh-dash').addEventListener('click', () => {
    renderDashboard(root, ctx);
  });
}
