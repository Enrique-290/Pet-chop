export function renderClientes(root, ctx) {
  const state = ctx.getState();

  root.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <h2>Clientes</h2>
        <span>Registra dueños y sus mascotas</span>
      </div>
    </div>

    <form id="form-cliente">
      <div class="form-grid">
        <div class="form-group">
          <label>Nombre del cliente</label>
          <input class="form-control" name="nombre" required placeholder="Ej. Carlos López" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input class="form-control" name="telefono" required placeholder="Ej. 555-000-0000" />
        </div>
        <div class="form-group">
          <label>Mascota</label>
          <input class="form-control" name="mascota" required placeholder="Ej. Rocky (perro)" />
        </div>
      </div>
      <button class="btn btn-primary" type="submit">Guardar cliente</button>
    </form>

    <div class="table-wrapper" style="margin-top: 14px;">
      <table class="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Mascota</th>
          </tr>
        </thead>
        <tbody id="clientes-body"></tbody>
      </table>
    </div>
  `;

  const tbody = root.querySelector('#clientes-body');

  function renderRows() {
    const clientes = ctx.getState().clientes;
    if (!clientes.length) {
      tbody.innerHTML = '<tr><td colspan="3">Aún no hay clientes.</td></tr>';
      return;
    }
    tbody.innerHTML = clientes.map(c => `
      <tr>
        <td>${c.nombre}</td>
        <td>${c.telefono}</td>
        <td>${c.mascota}</td>
      </tr>
    `).join('');
  }

  renderRows();

  const form = root.querySelector('#form-cliente');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const nuevo = {
      id: Date.now(),
      nombre: data.get('nombre').toString().trim(),
      telefono: data.get('telefono').toString().trim(),
      mascota: data.get('mascota').toString().trim()
    };

    ctx.setState(prev => {
      prev.clientes.push(nuevo);
      return prev;
    });

    form.reset();
    renderRows();
  });
}
