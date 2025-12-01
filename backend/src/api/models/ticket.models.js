/*===========================
    Modelos tickets / turnos Barberpoint
===========================*/

import connection from "../database/db.js";

/**
 * Inserta un ticket (turno Barberpoint) y sus productos asociados
 * @param {Object} data
 * @param {string} data.nombreUsuario
 * @param {string} data.barbero           // "Santino" o "Anibal"
 * @param {string} data.fechaHoraTurno    // "2025-03-20T11:00:00"
 * @param {Array}  data.items             // [{ idProducto, cantidad, precioUnitario }]
 * @param {number} data.precioTotal
 */
const insertTicket = async ({ nombreUsuario, barbero, fechaHoraTurno, items, precioTotal }) => {
    // 1) Insertar ticket
    const sqlTicket = `
        INSERT INTO tickets (nombreUsuario, barbero, fechaHoraTurno, precioTotal, fechaEmision)
        VALUES (?, ?, ?, ?, CURDATE())
    `;

    const [result] = await connection.query(sqlTicket, [
        nombreUsuario,
        barbero,
        fechaHoraTurno,
        precioTotal
    ]);

    const idTicket = result.insertId;

    // 2) Insertar detalle en productos_tickets
    const sqlDetalle = `
        INSERT INTO productos_tickets (idProducto, idTicket, cantidad, precioUnitario)
        VALUES (?, ?, ?, ?)
    `;

    for (const item of items) {
        const { idProducto, cantidad, precioUnitario } = item;
        await connection.query(sqlDetalle, [
            idProducto,
            idTicket,
            cantidad ?? 1,
            precioUnitario ?? 0
        ]);
    }

    return idTicket;
};

// Traer tickets con productos asociados (sirve para Excel/admin)
const selectTicketsWithProducts = () => {
    const sql = `
        SELECT 
            t.id           AS ticketId,
            t.nombreUsuario,
            t.barbero,
            t.fechaHoraTurno,
            t.precioTotal,
            t.fechaEmision,
            p.id          AS productoId,
            p.nombre      AS productoNombre,
            p.tipo        AS productoTipo,
            pt.cantidad,
            pt.precioUnitario
        FROM tickets t
        JOIN productos_tickets pt ON pt.idTicket = t.id
        JOIN productos p         ON p.id = pt.idProducto
        ORDER BY t.id DESC
    `;

    return connection.query(sql);
};

// Turnos ocupados de un barbero en una fecha (para armar horarios disponibles)
const selectTurnosPorBarberoYFecha = (barbero, fechaISO) => {
    // fechaISO = "2025-03-20"
    const sql = `
        SELECT fechaHoraTurno 
        FROM tickets 
        WHERE barbero = ? 
          AND DATE(fechaHoraTurno) = ?
    `;
    return connection.query(sql, [barbero, fechaISO]);
};

export default {
    insertTicket,
    selectTicketsWithProducts,
    selectTurnosPorBarberoYFecha
};
