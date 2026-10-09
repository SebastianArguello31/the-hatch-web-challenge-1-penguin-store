// Tienda pública. Relaciona los métodos HTTP y las URL con las funciones del controlador correspondiente.
const express = require("express");
const orderController = require("../controllers/orderController");

// Agrupa las rutas; app.js define el prefijo con el que se publican.
const router = express.Router();

router.get("/new/:productId", orderController.newForm);
router.post("/", orderController.create);
router.get("/success/:id", orderController.success);

module.exports = router;