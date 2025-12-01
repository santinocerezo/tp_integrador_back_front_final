// backend/scripts/seedAtencionesScript.js

//crea ticket de prueba porque no esta el front creado para generar ticket de atencion

import { sequelize } from "../src/config/dbConfig.js";
import { Atencion } from "../src/models/atencionModel.js";

async function seed() {
    try {
        console.log("Creando atenciones de prueba...");

        await sequelize.authenticate();

        await Atencion.bulkCreate(
            [
                {
                    cliente: "Juan Perez",
                    productos: JSON.stringify([{ id: 1, nombre: "Gel fijador" }]),
                    servicios: JSON.stringify([{ id: 1, nombre: "Corte clasico" }]),
                    profesionalId: null,
                    estado: "pendiente"
                },
                {
                    cliente: "Maria Lopez",
                    productos: JSON.stringify([{ id: 2, nombre: "Shampoo" }]),
                    servicios: JSON.stringify([{ id: 2, nombre: "Tinte" }]),
                    profesionalId: null,
                    estado: "pendiente"
                },
                {
                    cliente: "Carlos Gomez",
                    productos: JSON.stringify([{ id: 3, nombre: "Cera mate" }]),
                    servicios: JSON.stringify([{ id: 3, nombre: "Corte fade" }]),
                    profesionalId: null,
                    estado: "pendiente"
                },
                {
                    cliente: "Ana Martinez",
                    productos: JSON.stringify([{ id: 4, nombre: "Acondicionador" }]),
                    servicios: JSON.stringify([{ id: 4, nombre: "Brushing" }]),
                    profesionalId: null,
                    estado: "pendiente"
                },
                {
                    cliente: "Lucas Fernandez",
                    productos: JSON.stringify([{ id: 5, nombre: "Aceite de barba" }]),
                    servicios: JSON.stringify([{ id: 5, nombre: "Perfilado de barba" }]),
                    profesionalId: null,
                    estado: "pendiente"
                },
                {
                    cliente: "Sofia Herrera",
                    productos: JSON.stringify([{ id: 6, nombre: "Serum capilar" }]),
                    servicios: JSON.stringify([{ id: 6, nombre: "Peinado" }]),
                    profesionalId: null,
                    estado: "pendiente"
                }
            ]
        );

        console.log("Atenciones de prueba creadas.");
        process.exit(0);

    } catch (error) {
        console.error("Error creando atenciones:", error);
        process.exit(1);
    }
}

seed();
