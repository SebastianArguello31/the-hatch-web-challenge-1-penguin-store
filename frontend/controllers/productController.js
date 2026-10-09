// Tienda pública. Procesa las solicitudes de productos y prepara los datos para las vistas.
const mongoose = require("mongoose");
const Product = require("../models/Product");

// GET / y GET /products → lista de productos
exports.index = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.render("index", {
            title: "Productos",
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};

// GET /products/:id → detalle de un producto
exports.show = async (req, res) => {
    try {
        const id = req.params.id;

        // Rechaza identificadores inválidos antes de consultar la base de datos.
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send("Producto no encontrado");
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }

        res.render("products/show", {
            title: product.name,
            product: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};