// Panel de administración. Procesa las solicitudes de pedidos y prepara los datos para las vistas.
const mongoose = require("mongoose");
const Order = require("../../shared/models/Order");

// GET /admin/orders
exports.index = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        res.render("orders/index", {
            title: "Pedidos",
            orders: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};

// GET /admin/orders/:id
exports.show = async (req, res) => {
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

        res.render("orders/show", {
            title: "Detalle del pedido",
            order: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};