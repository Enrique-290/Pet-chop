export function renderVentas(root, ctx) {
  const state = ctx.getState();

  root.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <h2>Ventas</h2>
        <span>Registra ventas rápidas</span>
      </div>
    </div>

    <form id="form-venta">
      <div class="form-grid">
        <div class="form-group">
          <label>Cliente</label>
          <select name="clienteId" required>
            <option value="">Venta mostrador / sin registrar</option>
            ${state.clientes.map(c => `<option value="${c.id}">${c.nombre} · ${c.mascota}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Producto</label>
          <select name="productoId" required>
            <option value="">Selecciona producto</option>
            ${state.productos.map(p => `<option value="${p.id}">${p.nombre} · $${p.precio.toFixed(2)} (stock: ${p.stock})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Cantidad</label>
          <input class="form-control" name="cantidad" type="number" min="1" value="1" required />
        </div>
        <div class="form-group">
          <label>Forma de pago</label>
          <select name="pago" required>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary" type="submit">Registrar venta</button>
    </form>

    <div class="table-wrapper" style="margin-top: 14px;">
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
        <tbody id="ventas-body"></tbody>
      </table>
    </div>
  `;

  const tbody = root.querySelector('#ventas-body');

  function renderRows() {
    const { ventas } = ctx.getState();
    if (!ventas.length) {
      tbody.innerHTML = '<tr><td colspan="6">Aún no hay ventas registradas.</td></tr>';
      return;
    }
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

  renderRows();

  const form = root.querySelector('#form-venta');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const currentState = ctx.getState();

    const productoId = Number(data.get('productoId'));
    const clienteId = data.get('clienteId') ? Number(data.get('clienteId')) : null;
    const cantidad = Number(data.get('cantidad'));
    const pago = data.get('pago').toString();

    const producto = currentState.productos.find(p => p.id === productoId);
    const cliente = clienteId ? currentState.clientes.find(c => c.id === clienteId) : null;

    if (!producto) {
      alert('Producto inválido.');
      return;
    }
    if (cantidad > producto.stock) {
      alert('No hay suficiente stock.');
      return;
    }

    const total = producto.precio * cantidad;
    const folio = 'P' + String(Date.now()).slice(-6);

    ctx.setState(prev => {
      const p = prev.productos.find(p => p.id === productoId);
      if (p) p.stock -= cantidad;

      prev.ventas.push({
        folio,
        clienteId,
        clienteNombre: cliente ? cliente.nombre : '',
        productoId,
        productoNombre: producto.nombre,
        cantidad,
        pago,
        total,
        fecha: new Date().toISOString()
      });
      return prev;
    });

    form.reset();
    renderVentas(root, ctx);
  });
}
