// Panel de administración. Relaciona los métodos HTTP y las URL con las funciones del controlador correspondiente.
const express = require("express");
const orderController = require("../controllers/orderController");

// Agrupa las rutas; app.js define el prefijo con el que se publican.
const router = express.Router();

router.get("/", orderController.index);
router.get("/:id", orderController.show);

module.exports = router;