/*===============================
    Controladores tickets / turnos Barberpoint
===============================*/

import TicketModel from "../models/ticket.models.js";

// POST /api/tickets
// Crea un ticket (reserva de turno + productos)
export const createTicket = async (req, res) => {
    try {
        const { nombreUsuario, barbero, fechaHoraTurno, items } = req.body;

        if (!nombreUsuario || !barbero || !fechaHoraTurno || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "Faltan datos para crear el ticket"
            });
        }

        // Calculamos el total basado en los items
        const precioTotal = items.reduce((acc, it) => {
            const cantidad = it.cantidad ?? 1;
            const precioUnitario = it.precioUnitario ?? 0;
            return acc + cantidad * precioUnitario;
        }, 0);

        const idTicket = await TicketModel.insertTicket({
            nombreUsuario,
            barbero,
            fechaHoraTurno,
            items,
            precioTotal
        });

        res.status(201).json({
            ok: true,
            message: "Ticket creado correctamente",
            payload: {
                id: idTicket,
                nombreUsuario,
                barbero,
                fechaHoraTurno,
                precioTotal
            }
        });

    } catch (error) {
        console.error("Error al crear ticket:", error);
        res.status(500).json({
            ok: false,
            message: "Error interno al crear el ticket"
        });
    }
};

// GET /api/tickets
// Devuelve tickets con productos asociados (para admin / Excel)
export const getTicketsWithProducts = async (req, res) => {
    try {
        const [rows] = await TicketModel.selectTicketsWithProducts();

        res.status(200).json({
            ok: true,
            payload: rows,
            message: "Listado de tickets con productos"
        });
    } catch (error) {
        console.error("Error al obtener tickets:", error);
        res.status(500).json({
            ok: false,
            message: "Error interno al obtener tickets"
        });
    }
};

// GET /api/tickets/turnos/disponibles?barbero=Santino&fecha=2025-03-20
export const getTurnosDisponibles = async (req, res) => {
    try {
        const { barbero, fecha } = req.query;

        if (!barbero || !fecha) {
            return res.status(400).json({
                ok: false,
                message: "Debe enviar barbero y fecha (YYYY-MM-DD)"
            });
        }

        // Horarios fijos: 10 a 19 hs inclusive
        const horariosBase = [];
        for (let h = 10; h <= 19; h++) {
            horariosBase.push(`${h.toString().padStart(2, "0")}:00`);
        }

        const [rows] = await TicketModel.selectTurnosPorBarberoYFecha(barbero, fecha);

        // Extraemos los horarios ya ocupados (HH:MM)
        const ocupados = rows.map((r) => {
            const fechaHora = new Date(r.fechaHoraTurno);
            const hh = fechaHora.getHours().toString().padStart(2, "0");
            const mm = fechaHora.getMinutes().toString().padStart(2, "0");
            return `${hh}:${mm}`;
        });

        const disponibles = horariosBase.filter((h) => !ocupados.includes(h));

        res.status(200).json({
            ok: true,
            payload: {
                barbero,
                fecha,
                horariosDisponibles: disponibles
            },
            message: "Horarios disponibles obtenidos correctamente"
        });

    } catch (error) {
        console.error("Error al obtener horarios disponibles:", error);
        res.status(500).json({
            ok: false,
            message: "Error interno al obtener turnos disponibles"
        });
    }
};
