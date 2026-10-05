// Panel de administración. Relaciona los métodos HTTP y las URL con las funciones del controlador correspondiente.
const express = require("express");
const productController = require("../controllers/productController");

// Agrupa las rutas; app.js define el prefijo con el que se publican.
const router = express.Router();

router.get("/", productController.index);
router.get("/new", productController.newForm);
router.post("/", productController.create);
router.get("/:id/edit", productController.editForm);
router.put("/:id", productController.update);
router.delete("/:id", productController.destroy);

module.exports = router;