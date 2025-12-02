// Barberpoint - Frontend autoservicio
// Autor: Santino Cerezo (TP Integrador Programación III)

// =============================
// Config general
// =============================

const API_BASE = "http://localhost:3100"; // ajustar al puerto del backend

// Estado global simple
let nombreCliente = "";
let barberoSeleccionado = null; // "Santino" | "Anibal"
let fechaSeleccionada = null;   // "YYYY-MM-DD"
let horarioSeleccionado = null; // "HH:MM"
let productos = [];             // todos los productos desde el backend
let carrito = [];               // solo productos extra (no incluye el servicio base)
let servicioBase = null;        // producto corte (según barbero)
let ticketGenerado = null;      // respuesta del backend al crear ticket

// Referencias a elementos del DOM
const vistaBienvenida = document.getElementById("vistaBienvenida");
const vistaTurno = document.getElementById("vistaTurno");
const vistaProductos = document.getElementById("vistaProductos");
const vistaTicket = document.getElementById("vistaTicket");

const inputNombreCliente = document.getElementById("inputNombreCliente");
const btnContinuarNombre = document.getElementById("btnContinuarNombre");

const saludoCliente = document.getElementById("saludoCliente");
const inputFechaTurno = document.getElementById("inputFechaTurno");
const listaHorarios = document.getElementById("listaHorarios");
const btnContinuarProductos = document.getElementById("btnContinuarProductos");

const listaProductos = document.getElementById("listaProductos");
const itemsCarrito = document.getElementById("itemsCarrito");
const resumenTurno = document.getElementById("resumenTurno");
const totalGeneral = document.getElementById("totalGeneral");
const btnConfirmarReserva = document.getElementById("btnConfirmarReserva");

const ticketContenido = document.getElementById("ticketContenido");
const btnDescargarTicket = document.getElementById("btnDescargarTicket");
const btnNuevoTurno = document.getElementById("btnNuevoTurno");
const miniCartInfo = document.getElementById("miniCartInfo");

// =============================
// Helpers de vistas
// =============================

function mostrarVista(idVista) {
  [vistaBienvenida, vistaTurno, vistaProductos, vistaTicket].forEach(v => {
    v.classList.remove("activa");
  });
  idVista.classList.add("activa");
}

// =============================
// Paso 1: Nombre del cliente
// =============================

btnContinuarNombre.addEventListener("click", () => {
  const nombre = inputNombreCliente.value.trim();
  if (!nombre) {
    alert("Por favor, ingresá tu nombre.");
    return;
  }
  nombreCliente = nombre;
  saludoCliente.textContent = `Hola ${nombreCliente}, elegí tu barbero y horario.`;
  miniCartInfo.textContent = `Cliente: ${nombreCliente}`;
  mostrarVista(vistaTurno);
});

// =============================
// Paso 2: Selección barbero, fecha y horario
// =============================

// Cuando cambia el barbero o la fecha, pedimos horarios disponibles
document.querySelectorAll('input[name="barbero"]').forEach(radio => {
  radio.addEventListener("change", actualizarHorariosDisponibles);
});

inputFechaTurno.addEventListener("change", actualizarHorariosDisponibles);

async function actualizarHorariosDisponibles() {
  const radioChecked = document.querySelector('input[name="barbero"]:checked');
  const fecha = inputFechaTurno.value;

  barberoSeleccionado = radioChecked ? radioChecked.value : null;
  fechaSeleccionada = fecha || null;
  horarioSeleccionado = null;
  btnContinuarProductos.disabled = true;
  listaHorarios.innerHTML = "";

  if (!barberoSeleccionado || !fechaSeleccionada) {
    return;
  }

  try {
    const url = new URL(API_BASE + "/api/tickets/turnos/disponibles");
    url.searchParams.set("barbero", barberoSeleccionado);
    url.searchParams.set("fecha", fechaSeleccionada);

    const resp = await fetch(url);
    const data = await resp.json();

    const horarios = data?.payload?.horariosDisponibles || [];

    if (horarios.length === 0) {
      listaHorarios.innerHTML = "<p>No hay horarios disponibles para esa fecha.</p>";
      return;
    }

    horarios.forEach(horario => {
      const btn = document.createElement("button");
      btn.textContent = horario;
      btn.classList.add("btn-horario");
      btn.addEventListener("click", () => seleccionarHorario(horario));
      listaHorarios.appendChild(btn);
    });

  } catch (error) {
    console.error("Error al obtener horarios:", error);
    listaHorarios.innerHTML = "<p>Error al obtener horarios.</p>";
  }
}

function seleccionarHorario(horario) {
  horarioSeleccionado = horario;

  // remarcar botones seleccionados
  document.querySelectorAll(".btn-horario").forEach(btn => {
    btn.classList.toggle("seleccionado", btn.textContent === horarioSeleccionado);
  });

  btnContinuarProductos.disabled = false;
}

btnContinuarProductos.addEventListener("click", async () => {
  if (!barberoSeleccionado || !fechaSeleccionada || !horarioSeleccionado) {
    alert("Falta seleccionar barbero, fecha y horario.");
    return;
  }

  // Crear el servicio base según el barbero
  if (barberoSeleccionado === "Santino") {
    servicioBase = {
      idProducto: 1, // Corte 60 min Santino
      nombre: "Corte 60 min Santino",
      precioUnitario: 10000,
      cantidad: 1
    };
  } else {
    servicioBase = {
      idProducto: 2, // Corte 60 min Anibal
      nombre: "Corte 60 min Aníbal",
      precioUnitario: 15000,
      cantidad: 1
    };
  }

  miniCartInfo.textContent = `Cliente: ${nombreCliente} | ${barberoSeleccionado} - ${fechaSeleccionada} ${horarioSeleccionado}`;
  await cargarProductos();
  actualizarResumenTurno();
  mostrarVista(vistaProductos);
});

// =============================
// Paso 3: Productos + carrito
// =============================

async function cargarProductos() {
  try {
    const resp = await fetch(API_BASE + "/api/products");
    const data = await resp.json();
    productos = data?.payload || [];

    const productosExtra = productos.filter(p => p.tipo === "PRODUCTO" || p.tipo === "PRODUCTOS" || p.tipo === "PRODUCTOS_FISICOS");

    listaProductos.innerHTML = "";

    productosExtra.forEach(prod => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <h3>${prod.nombre}</h3>
        <p class="precio">$${prod.precio}</p>
        <div class="acciones-card">
          <button data-id="${prod.id}" class="btn-restar">-</button>
          <span id="cantidad-${prod.id}">0</span>
          <button data-id="${prod.id}" class="btn-sumar">+</button>
        </div>
      `;

      listaProductos.appendChild(card);
    });

    // Listeners sumar/restar
    listaProductos.addEventListener("click", manejarClickProductos);

  } catch (error) {
    console.error("Error al cargar productos:", error);
    listaProductos.innerHTML = "<p>Error al cargar productos.</p>";
  }
}

// Maneja clicks en + y - de productos
function manejarClickProductos(e) {
  if (e.target.classList.contains("btn-sumar")) {
    const id = Number(e.target.dataset.id);
    agregarAlCarrito(id);
  }
  if (e.target.classList.contains("btn-restar")) {
    const id = Number(e.target.dataset.id);
    quitarDelCarrito(id);
  }
}

function agregarAlCarrito(idProducto) {
  const prod = productos.find(p => p.id === idProducto);
  if (!prod) return;

  const itemExistente = carrito.find(i => i.idProducto === idProducto);
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({
      idProducto: prod.id,
      nombre: prod.nombre,
      precioUnitario: prod.precio,
      cantidad: 1
    });
  }
  actualizarUIProductos();
  actualizarResumenTurno();
}

function quitarDelCarrito(idProducto) {
  const itemExistente = carrito.find(i => i.idProducto === idProducto);
  if (!itemExistente) return;

  itemExistente.cantidad -= 1;
  if (itemExistente.cantidad <= 0) {
    carrito = carrito.filter(i => i.idProducto !== idProducto);
  }
  actualizarUIProductos();
  actualizarResumenTurno();
}

function actualizarUIProductos() {
  carrito.forEach(item => {
    const span = document.getElementById(`cantidad-${item.idProducto}`);
    if (span) span.textContent = item.cantidad;
  });

  // Reset 0 para los que no están
  productos.forEach(p => {
    if (!carrito.find(i => i.idProducto === p.id)) {
      const span = document.getElementById(`cantidad-${p.id}`);
      if (span) span.textContent = 0;
    }
  });

  // Render carrito
  itemsCarrito.innerHTML = "";
  if (carrito.length === 0) {
    itemsCarrito.innerHTML = "<p>No agregaste productos adicionales.</p>";
    return;
  }

  carrito.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = `
      <span>${item.nombre} x${item.cantidad}</span>
      <span>$${item.cantidad * item.precioUnitario}</span>
    `;
    itemsCarrito.appendChild(div);
  });
}

function actualizarResumenTurno() {
  if (!servicioBase) return;

  const totalServicio = servicioBase.precioUnitario * servicioBase.cantidad;
  const totalProductos = carrito.reduce((acc, i) => acc + i.cantidad * i.precioUnitario, 0);
  const total = totalServicio + totalProductos;

  resumenTurno.innerHTML = `
    <p><strong>Cliente:</strong> ${nombreCliente}</p>
    <p><strong>Barbero:</strong> ${barberoSeleccionado}</p>
    <p><strong>Fecha y hora:</strong> ${fechaSeleccionada} ${horarioSeleccionado}</p>
    <p><strong>Servicio:</strong> ${servicioBase.nombre} - $${servicioBase.precioUnitario}</p>
  `;

  totalGeneral.textContent = total;
}

// Confirmar reserva
btnConfirmarReserva.addEventListener("click", async () => {
  if (!servicioBase) {
    alert("Falta seleccionar el servicio base.");
    return;
  }

  const confirmar = confirm("¿Confirmás la reserva de tu turno y productos?");
  if (!confirmar) return;

  const fechaHoraTurnoISO = `${fechaSeleccionada}T${horarioSeleccionado}:00`;

  // Armamos items = servicioBase + productos extra
  const items = [
  {
    idProducto: servicioBase.idProducto,
    nombre: servicioBase.nombre,
    cantidad: servicioBase.cantidad,
    precioUnitario: servicioBase.precioUnitario
  },
  ...carrito.map(item => ({
    idProducto: item.idProducto,
    nombre: item.nombre,
    cantidad: item.cantidad,
    precioUnitario: item.precioUnitario
  }))
];

  try {
    const resp = await fetch(API_BASE + "/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreUsuario: nombreCliente,
        barbero: barberoSeleccionado,
        fechaHoraTurno: fechaHoraTurnoISO,
        items
      })
    });

    const data = await resp.json();
    if (!data.ok) {
      alert(data.message || "Error al crear la reserva.");
      return;
    }

    ticketGenerado = {
      ...data.payload,
      items
    };

    renderTicket();
    mostrarVista(vistaTicket);

  } catch (error) {
    console.error("Error al crear ticket:", error);
    alert("Error al crear la reserva.");
  }
});

// =============================
// Paso 4: Ticket
// =============================

function renderTicket() {
  if (!ticketGenerado) return;

  const { id, nombreUsuario, barbero, fechaHoraTurno, precioTotal } = ticketGenerado;

  const fecha = new Date(fechaHoraTurno);
  const fechaLocal = fecha.toLocaleString("es-AR");

  let detalleHTML = "";
  ticketGenerado.items.forEach(item => {
    detalleHTML += `
      <tr>
        <td>${item.nombre || ""}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precioUnitario}</td>
        <td>$${item.cantidad * item.precioUnitario}</td>
      </tr>
    `;
  });

  ticketContenido.innerHTML = `
    <h2>Barberpoint</h2>
    <p><strong>Ticket N°:</strong> ${id}</p>
    <p><strong>Cliente:</strong> ${nombreUsuario}</p>
    <p><strong>Barbero:</strong> ${barbero}</p>
    <p><strong>Fecha y hora del turno:</strong> ${fechaLocal}</p>
    <table class="tabla-ticket">
      <thead>
        <tr>
          <th>Producto / Servicio</th>
          <th>Cant.</th>
          <th>Precio</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${detalleHTML}
      </tbody>
    </table>
    <p class="total-ticket"><strong>Total:</strong> $${precioTotal}</p>
    <p class="empresa">Gracias por elegir Barberpoint</p>
  `;
}

// Descargar ticket como PDF usando jsPDF
btnDescargarTicket.addEventListener("click", () => {
  if (!ticketGenerado) {
    alert("No hay ticket generado.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const { id, nombreUsuario, barbero, fechaHoraTurno, precioTotal } = ticketGenerado;
  const fecha = new Date(fechaHoraTurno);
  const fechaLocal = fecha.toLocaleString("es-AR");

  let y = 10;

  doc.setFontSize(16);
  doc.text("Barberpoint", 10, y);
  y += 8;

  doc.setFontSize(11);
  doc.text(`Ticket N°: ${id}`, 10, y); y += 6;
  doc.text(`Cliente: ${nombreUsuario}`, 10, y); y += 6;
  doc.text(`Barbero: ${barbero}`, 10, y); y += 6;
  doc.text(`Fecha y hora del turno: ${fechaLocal}`, 10, y); y += 8;

  doc.setFontSize(12);
  doc.text("Detalle:", 10, y);
  y += 6;

  doc.setFontSize(10);
  doc.text("Producto", 10, y);
  doc.text("Cant.", 90, y);
  doc.text("Precio", 120, y);
  doc.text("Subtotal", 150, y);
  y += 5;

  doc.line(10, y, 200, y);
  y += 5;

  ticketGenerado.items.forEach(item => {
    const nombre = item.nombre || "";
    const cantidad = item.cantidad;
    const precio = item.precioUnitario;
    const subtotal = cantidad * precio;

    doc.text(String(nombre).substring(0, 30), 10, y);
    doc.text(String(cantidad), 95, y);
    doc.text(`$${precio}`, 120, y);
    doc.text(`$${subtotal}`, 150, y);
    y += 5;
  });

  y += 5;
  doc.line(10, y, 200, y);
  y += 7;

  doc.setFontSize(12);
  doc.text(`Total: $${precioTotal}`, 10, y);
  y += 10;

  doc.setFontSize(10);
  doc.text("Gracias por elegir Barberpoint", 10, y);

  doc.save(`ticket_${id}.pdf`);
});


// Nuevo turno: reseteamos estado
btnNuevoTurno.addEventListener("click", () => {
  nombreCliente = "";
  barberoSeleccionado = null;
  fechaSeleccionada = null;
  horarioSeleccionado = null;
  productos = [];
  carrito = [];
  servicioBase = null;
  ticketGenerado = null;
  miniCartInfo.textContent = "Turno sin seleccionar";
  inputNombreCliente.value = "";
  inputFechaTurno.value = "";
  listaHorarios.innerHTML = "";
  listaProductos.innerHTML = "";
  itemsCarrito.innerHTML = "";
  resumenTurno.innerHTML = "";
  totalGeneral.textContent = "0";
  mostrarVista(vistaBienvenida);
});

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  mostrarVista(vistaBienvenida);
});
