// Panel de administración. Esquema de administradores: correo único normalizado y contraseña almacenada como hash.
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    // Correo normalizado; unique solicita un índice único en MongoDB.
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    // Hash de la contraseña creado con bcrypt.
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Admin", adminSchema);