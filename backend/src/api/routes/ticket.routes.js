import { Router } from "express";
const router = Router();

import { createTicket, getTicketsWithProducts, getTurnosDisponibles } from "../controllers/ticket.controllers.js";

// Crear ticket (reserva de turno)
router.post("/", createTicket);

// Listado de tickets con productos (para admin / Excel)
router.get("/", getTicketsWithProducts);

// Horarios disponibles para un barbero en una fecha
router.get("/turnos/disponibles", getTurnosDisponibles);

export default router;
