document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formConsultar");
  const resultado = document.getElementById("resultadoConsulta");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("idConsulta").value;

    try {
      const resp = await fetch(`/api/products/${id}`);
      const data = await resp.json();

      if (!resp.ok || data.error) {
        resultado.innerHTML = `<p style="color:red;">${data.message || "Producto no encontrado"}</p>`;
        return;
      }

      const p = data.payload;
      resultado.innerHTML = `
        <h2>${p.nombre}</h2>
        <p><strong>ID:</strong> ${p.id}</p>
        <p><strong>Tipo:</strong> ${p.tipo}</p>
        <p><strong>Precio:</strong> $${p.precio}</p>
        <p><strong>Activo:</strong> ${p.activo ? "Sí" : "No"}</p>
        <img src="${p.imagen}" alt="${p.nombre}" style="max-width:200px;">
      `;
    } catch (error) {
      console.error(error);
      resultado.innerHTML = `<p style="color:red;">Error interno al consultar el producto</p>`;
    }
  });
});
