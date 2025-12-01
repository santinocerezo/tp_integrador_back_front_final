document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formDelete");
  const msg = document.getElementById("msgDelete");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("idDelete").value;

    const confirmar = confirm(`¿Seguro que querés eliminar el producto con ID ${id}?`);
    if (!confirmar) return;

    try {
      const resp = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });

      const data = await resp.json();

      if (!resp.ok || data.error) {
        msg.textContent = data.message || "Error al eliminar el producto";
        msg.style.color = "red";
      } else {
        msg.textContent = data.message || "Producto eliminado correctamente";
        msg.style.color = "green";
      }
    } catch (error) {
      console.error(error);
      msg.textContent = "Error interno al eliminar el producto";
      msg.style.color = "red";
    }
  });
});
