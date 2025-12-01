document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCrearProducto");
  const msg = document.getElementById("msgCrear");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoProducto = {
      nombre: document.getElementById("nombre").value.trim(),
      tipo: document.getElementById("tipo").value.trim(),
      precio: Number(document.getElementById("precio").value),
      imagen: document.getElementById("imagen").value.trim(),
      activo: document.getElementById("activo").value === "1" ? 1 : 0
    };

    try {
      const resp = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto)
      });

      const data = await resp.json();

      if (!resp.ok || data.error) {
        msg.textContent = data.message || "Error al crear el producto";
        msg.style.color = "red";
      } else {
        msg.textContent = data.message || "Producto creado correctamente";
        msg.style.color = "green";
        form.reset();
      }
    } catch (error) {
      console.error(error);
      msg.textContent = "Error interno al crear el producto";
      msg.style.color = "red";
    }
  });
});
