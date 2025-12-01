document.addEventListener("DOMContentLoaded", () => {
  const formBuscar = document.getElementById("formBuscarUpdate");
  const formUpdate = document.getElementById("formUpdate");
  const msg = document.getElementById("msgUpdate");

  formBuscar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("idUpdate").value;

    try {
      const resp = await fetch(`/api/products/${id}`);
      const data = await resp.json();

      if (!resp.ok || data.error) {
        msg.textContent = data.message || "Producto no encontrado";
        msg.style.color = "red";
        formUpdate.style.display = "none";
        return;
      }

      const p = data.payload;
      document.getElementById("idProductoUpdate").value = p.id;
      document.getElementById("nombreUpdate").value = p.nombre;
      document.getElementById("tipoUpdate").value = p.tipo;
      document.getElementById("precioUpdate").value = p.precio;
      document.getElementById("imagenUpdate").value = p.imagen;
      document.getElementById("activoUpdate").value = p.activo ? "1" : "0";

      formUpdate.style.display = "block";
      msg.textContent = "";

    } catch (error) {
      console.error(error);
      msg.textContent = "Error interno al buscar el producto";
      msg.style.color = "red";
    }
  });

  formUpdate.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productoActualizado = {
      id: Number(document.getElementById("idProductoUpdate").value),
      nombre: document.getElementById("nombreUpdate").value.trim(),
      tipo: document.getElementById("tipoUpdate").value.trim(),
      precio: Number(document.getElementById("precioUpdate").value),
      imagen: document.getElementById("imagenUpdate").value.trim(),
      activo: document.getElementById("activoUpdate").value === "1" ? 1 : 0
    };

    try {
      const resp = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoActualizado)
      });

      const data = await resp.json();

      if (!resp.ok || data.error) {
        msg.textContent = data.message || "Error al actualizar el producto";
        msg.style.color = "red";
      } else {
        msg.textContent = data.message || "Producto actualizado correctamente";
        msg.style.color = "green";
      }
    } catch (error) {
      console.error(error);
      msg.textContent = "Error interno al actualizar el producto";
      msg.style.color = "red";
    }
  });
});
