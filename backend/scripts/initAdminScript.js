// backend/scripts/initAdminScript.js

import dotenv from "dotenv";
import { sequelize } from "../src/config/dbConfig.js";
import { Usuario } from "../src/models/usuarioModel.js";
import { encriptar } from "../src/utils/encriptUtil.js";

dotenv.config();

async function crearOReactivarAdmin() {
  try {
    await sequelize.authenticate();
    console.log("Conexion con la base establecida.");

    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL;
    const adminPass = process.env.ADMIN_DEFAULT_PASS;
    const adminName = process.env.ADMIN_DEFAULT_NAME;

    const adminExistente = await Usuario.findOne({
      where: { correo: adminEmail }
    });

    // Caso 1: NO existe -> CREAR
    if (!adminExistente) {
      const hash = await encriptar(adminPass);

      await Usuario.create({
        nombreUsuario: adminName,
        correo: adminEmail,
        contrasena: hash,
        rol: "admin",
        activo: true
      });

      console.log("Admin creado correctamente.");
      console.log(`Correo: ${adminEmail}`);
      console.log(`Pass inicial: ${adminPass}`);
      process.exit(0);
    }

    // Caso 2: Existe pero inactivo -> REACTIVAR y RESETEAR PASS
    if (adminExistente.activo === false) {
      const hash = await encriptar(adminPass);

      adminExistente.nombreUsuario = adminName;
      adminExistente.contrasena = hash;
      adminExistente.activo = true;
      await adminExistente.save();

      console.log("Admin reactivado y pass reiniciada.");
      console.log(`Correo: ${adminEmail}`);
      console.log(`Pass nueva: ${adminPass}`);
      process.exit(0);
    }

    // Caso 3: Existe y activo -> NO HACER NADA
    console.log("El admin ya existe y esta activo. No se realiza ninguna accion.");
    process.exit(0);

  } catch (error) {
    console.error("Error ejecutando initAdminScript:", error);
    process.exit(1);
  }
}

crearOReactivarAdmin();
