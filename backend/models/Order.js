// Panel de administración. Esquema de pedidos: conserva los datos del cliente, los artículos y el importe de la compra.
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    // Copia de los artículos comprados; los cambios posteriores del producto no actualizan estos datos.
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            name: String,
            price: {
                type: Number,
                required: true,
                min: 1,
                validate: { validator: Number.isSafeInteger, message: "El precio debe ser un entero en guaraníes" }
            },
            quantity: Number
        }
    ],
    // Importe final del pedido en guaraníes.
    total: {
        type: Number,
        required: true,
        min: 1,
        validate: { validator: Number.isSafeInteger, message: "El total debe ser un entero en guaraníes" }
    },
    // Fecha de creación utilizada para ordenar y mostrar los registros.
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);