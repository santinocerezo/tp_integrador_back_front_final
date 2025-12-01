// backend/scripts/syncDbScript.js
// Script para sincronizar las tablas de la DB usando los modelos actuales.

import { sequelize } from "../src/config/dbConfig.js";

// Importar todos los modelos
import "../src/models/usuarioModel.js";
import "../src/models/productoModel.js";
import "../src/models/servicioModel.js";
import "../src/models/ventaModel.js";
import "../src/models/ventaDetalleModel.js";
import "../src/models/atencionModel.js";   // ← FALTABA ESTA LÍNEA

async function syncDB() {
  try {
    console.log("Sincronizando base de datos...");

    // force: true BORRA Y RECREA las tablas
    // Ideal para un TP donde cambiamos modelos seguido
    await sequelize.sync({ force: true });

    console.log("Tablas sincronizadas correctamente.");
    process.exit(0);

  } catch (error) {
    console.error("Error sincronizando la base:", error);
    process.exit(1);
  }
}

syncDB();


