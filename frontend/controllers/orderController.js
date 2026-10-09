// Tienda pública. Procesa las solicitudes de pedidos y prepara los datos para las vistas.
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");

// GET /orders/new/:productId → formulario de pedido
exports.newForm = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Rechaza identificadores inválidos antes de consultar la base de datos.
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(404).send("Producto no encontrado");
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }

        res.render("orders/new", {
            title: "Hacer pedido",
            product: product,
            errors: [],
            values: { quantity: 1 }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};

// POST /orders → crea el pedido
exports.create = async (req, res) => {
    try {
        // 1) Recibir los datos del formulario
        const productId = req.body.productId;
        const customerName = String(req.body.customerName || "").trim();
        const address = String(req.body.address || "").trim();
        const quantity = Number(req.body.quantity);

        // 2) Buscar el producto
        // Rechaza identificadores inválidos antes de consultar la base de datos.
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(404).send("Producto no encontrado");
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }

        // 3) Validar los datos y comprobar el stock
        const errors = [];

        if (!customerName) {
            errors.push("El nombre es obligatorio");
        }

        if (!address) {
            errors.push("La dirección es obligatoria");
        }

        // Valida enteros dentro del rango que JavaScript puede representar con precisión.
        if (!Number.isSafeInteger(quantity) || quantity <= 0) {
            errors.push("La cantidad debe ser un número entero mayor a 0");
        } else if (quantity > product.stock) {
            errors.push("No hay stock suficiente. Disponible: " + product.stock);
        }

        // Valida enteros dentro del rango que JavaScript puede representar con precisión.
        if (!Number.isSafeInteger(product.price) || product.price <= 0 || !Number.isSafeInteger(product.price * quantity)) {
            errors.push("El precio y el total deben ser enteros válidos en guaraníes");
        }

        if (errors.length > 0) {
            return res.status(400).render("orders/new", {
                title: "Hacer pedido",
                product: product,
                errors: errors,
                values: {
                    customerName: customerName,
                    address: address,
                    quantity: req.body.quantity
                }
            });
        }

        // 4) Calcular el total en guaraníes, sin decimales
        const total = product.price * quantity;

        // Pedido y stock se guardan por separado, sin transacción. Una interrupción
        // o compras simultáneas pueden dejar diferencias que requieran revisión.
        // 5) Guardar el pedido
        const order = await Order.create({
            customerName: customerName,
            address: address,
            items: [
                {
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity
                }
            ],
            total: total
        });

        // 6) Descontar el stock
        product.stock = product.stock - quantity;
        await product.save();

        // 7) Redirigir a la página de confirmación
        res.redirect("/orders/success/" + order._id);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};

// GET /orders/success/:id → página de confirmación
exports.success = async (req, res) => {
    try {
        const id = req.params.id;

        // Rechaza identificadores inválidos antes de consultar la base de datos.
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send("Pedido no encontrado");
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).send("Pedido no encontrado");
        }

        res.render("orders/success", {
            title: "Pedido confirmado",
            order: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};