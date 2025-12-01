// Importamos el modulo mysql2 en modo promesas para hacer peticiones asincronicas a la BBDD
import mysql2 from "mysql2/promise"; 

// Conexión directa para Barberpoint (sin depender de .env)
const connection = mysql2.createPool({
    host: "localhost",
    database: "tp_prog_iii_barberpoint",
    user: "root",
    password: "root" // 
});

export default connection;


/* Que hace el metodo .createPool?

- Crea un gestor de conexiones automatico
- Se conecta a la BBDD usando los parametros (host, user, password, etc)
- Por defecto, abre hasta 10 conexiones simultaneas (podemos configurar esto)
- Permite usar await connection.query(...) para tirarle sentencias SQL
*/

/* Que es un pool de conexiones?
Es un conjunto de conexiones activas y reutilizables a la BBDD.
En lugar de abrir y cerrar una conexion cada vez que hacemos una consulta, el pool

    - Mantiene abiertas varias conexiones
    - Las reutiliza para distintas consultas
    - Mejora el rendimiento y eficacia del servidor
    - Controla cuantas conexiones pueden usarse al mismo tiempo

Ventajas del pool
    - Evita crear y destruir conexiones constantemente
    - Reduce la carga en la BBDD
    - Mejora la velocidad y capacidad de respuesta de la app

*/