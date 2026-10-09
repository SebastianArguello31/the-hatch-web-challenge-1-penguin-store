// Tienda pública. Relaciona los métodos HTTP y las URL con las funciones del controlador correspondiente.
const express = require("express");
const productController = require("../controllers/productController");

// Agrupa las rutas; app.js define el prefijo con el que se publican.
const router = express.Router();

router.get("/", productController.index);
router.get("/products", productController.index);
router.get("/products/:id", productController.show);

module.exports = router;