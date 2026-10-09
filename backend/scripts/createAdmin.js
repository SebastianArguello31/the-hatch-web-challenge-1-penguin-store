// Panel de administración. Crea el administrador usando el .env de la raíz; conserva las cuentas que ya existen.
// Carga el .env compartido de la raíz, independientemente de la carpeta de ejecución.
require("../../shared/config/env");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

async function createAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD en el archivo .env");
        process.exit(1);
    }

    try {
        if (!process.env.MONGODB_URI) throw new Error("Falta MONGODB_URI en el archivo .env");
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });

        const existingAdmin = await Admin.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingAdmin) {
            console.log("Ya existe un administrador con ese email. No se creó otro.");
        } else {
            // Genera el hash: la contraseña original no se guarda en MongoDB.
            const hashedPassword = await bcrypt.hash(password, 10);

            await Admin.create({
                email: email,
                password: hashedPassword
            });

            console.log(" Administrador creado: " + email);
        }
    } catch (error) {
        console.error("Error creando el administrador:", error.message);
        // Comunica el fallo a la terminal sin impedir la limpieza del bloque finally.
        process.exitCode = 1;
    } finally {
        // Libera la conexión al terminar el script, también si ocurrió un error.
        await mongoose.disconnect();
    }
}

createAdmin();