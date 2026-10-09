// Panel de administración. Consulta los totales que se muestran en el resumen del panel.
const Product = require("../../shared/models/Product");
const Order = require("../../shared/models/Order");

// GET /admin
exports.index = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        res.render("dashboard", {
            title: "Dashboard",
            totalProducts: totalProducts,
            totalOrders: totalOrders
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};