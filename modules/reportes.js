export function renderReportes(root, ctx) {
  const state = ctx.getState();

  root.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <h2>Reportes</h2>
        <span>Resumen básico de ventas</span>
      </div>
      <button class="btn btn-outline" id="btn-export-json">Exportar JSON</button>
    </div>

    <div class="cards-grid">
      <div class="card">
        <div class="card-header">
          <span>Total ventas</span>
          <span class="card-tag">Registros</span>
        </div>
        <div class="card-value">${state.ventas.length}</div>
      </div>
      <div class="card">
        <div class="card-header">
          <span>Ingreso acumulado</span>
          <span class="card-tag">MXN</span>
        </div>
        <div class="card-value">$${state.ventas.reduce((s, v) => s + v.total, 0).toFixed(2)}</div>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Folio</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Cant.</th>
            <th>Pago</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody id="reportes-body"></tbody>
      </table>
    </div>
  `;

  const tbody = root.querySelector('#reportes-body');
  const ventas = state.ventas;

  if (!ventas.length) {
    tbody.innerHTML = '<tr><td colspan="6">Aún no hay datos para reportar.</td></tr>';
  } else {
    tbody.innerHTML = ventas.slice().reverse().map(v => `
      <tr>
        <td>${v.folio}</td>
        <td>${v.clienteNombre || '-'}</td>
        <td>${v.productoNombre}</td>
        <td>${v.cantidad}</td>
        <td>${v.pago}</td>
        <td>$${v.total.toFixed(2)}</td>
      </tr>
    `).join('');
  }

  root.querySelector('#btn-export-json').addEventListener('click', () => {
    const blob = new Blob(
      [JSON.stringify(ctx.getState(), null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'petshop_pos_demo_state.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
