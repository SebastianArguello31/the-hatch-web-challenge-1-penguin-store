// Tienda pública. Esquema de productos: datos descriptivos, precio entero en guaraníes y stock disponible.
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    // Importe unitario en guaraníes, validado por el esquema.
    price: {
        type: Number,
        required: true,
        min: 1,
        validate: { validator: Number.isSafeInteger, message: "El precio debe ser un entero en guaraníes" }
    },
    // Cantidad disponible; no se permiten valores negativos.
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    category: {
        type: String,
        default: ""
    },
    // Fecha de creación utilizada para ordenar y mostrar los registros.
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", productSchema);