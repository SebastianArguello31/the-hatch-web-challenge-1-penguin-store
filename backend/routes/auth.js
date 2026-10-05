// Panel de administración. Relaciona los métodos HTTP y las URL con las funciones del controlador correspondiente.
const express = require("express");
const authController = require("../controllers/authController");

// Agrupa las rutas; app.js define el prefijo con el que se publican.
const router = express.Router();

router.get("/login", authController.showLogin);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;