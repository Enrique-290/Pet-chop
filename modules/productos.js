export function renderProductos(root, ctx) {
  const state = ctx.getState();

  root.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <h2>Productos</h2>
        <span>Control básico de inventario</span>
      </div>
      <button class="btn btn-primary" id="btn-add-demo-producto">Agregar demo</button>
    </div>

    <form id="form-producto">
      <div class="form-grid">
        <div class="form-group">
          <label>Nombre</label>
          <input class="form-control" name="nombre" required placeholder="Ej. Juguete de cuerda" />
        </div>
        <div class="form-group">
          <label>Categoría</label>
          <select name="categoria" required>
            <option value="Alimento">Alimento</option>
            <option value="Accesorio">Accesorio</option>
            <option value="Higiene">Higiene</option>
            <option value="Medicamento">Medicamento</option>
          </select>
        </div>
        <div class="form-group">
          <label>Especie</label>
          <select name="especie" required>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Ave">Ave</option>
            <option value="Roedor">Roedor</option>
          </select>
        </div>
        <div class="form-group">
          <label>Precio</label>
          <input class="form-control" name="precio" type="number" step="0.01" required placeholder="0.00" />
        </div>
        <div class="form-group">
          <label>Stock</label>
          <input class="form-control" name="stock" type="number" step="1" min="0" required placeholder="0" />
        </div>
      </div>
      <button class="btn btn-primary" type="submit">Guardar producto</button>
    </form>

    <div class="table-wrapper" style="margin-top: 14px;">
      <table class="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Especie</th>
            <th>Precio</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody id="productos-body"></tbody>
      </table>
    </div>
  `;

  const tbody = root.querySelector('#productos-body');

  function renderRows() {
    const productos = ctx.getState().productos;
    if (!productos.length) {
      tbody.innerHTML = '<tr><td colspan="5">Aún no hay productos.</td></tr>';
      return;
    }
    tbody.innerHTML = productos.map(p => `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>${p.especie}</td>
        <td>$${Number(p.precio).toFixed(2)}</td>
        <td>
          <span class="badge ${p.stock <= 5 ? 'badge-stock-low' : 'badge-stock-ok'}">
            ${p.stock} unidades
          </span>
        </td>
      </tr>
    `).join('');
  }

  renderRows();

  const form = root.querySelector('#form-producto');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const nuevo = {
      id: Date.now(),
      nombre: data.get('nombre').toString().trim(),
      categoria: data.get('categoria'),
      especie: data.get('especie'),
      precio: Number(data.get('precio')),
      stock: Number(data.get('stock'))
    };

    ctx.setState(prev => {
      prev.productos.push(nuevo);
      return prev;
    });

    form.reset();
    renderRows();
  });

  root.querySelector('#btn-add-demo-producto').addEventListener('click', () => {
    ctx.setState(prev => {
      prev.productos.push({
        id: Date.now(),
        nombre: 'Snack dental',
        categoria: 'Alimento',
        especie: 'Perro',
        precio: 65,
        stock: 20
      });
      return prev;
    });
    renderRows();
  });
}
