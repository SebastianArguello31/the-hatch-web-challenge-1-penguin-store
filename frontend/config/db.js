// Tienda pública. Conecta la aplicación a MongoDB mediante MONGODB_URI y detiene el arranque si la conexión falla.
const mongoose = require("mongoose");

// La función es asíncrona para esperar la conexión antes de aceptar solicitudes.
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error conectando a MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;