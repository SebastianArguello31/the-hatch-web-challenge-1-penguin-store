// Tienda pública. Configura Express, las vistas, los middleware y las rutas. Inicia el servidor después de conectar a MongoDB.
const path = require("path");
// Carga el .env compartido de la raíz, independientemente de la carpeta de ejecución.
require("../shared/config/env");

const express = require("express");

const connectDB = require("../shared/config/db");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const app = express();
// Permite usar formatPrice en cualquier plantilla Pug.
app.locals.formatPrice = require("../shared/utils/formatPrice");
// Lee el puerto propio de la aplicación y usa el valor predeterminado si falta.
const PORT = Number(process.env.STORE_PORT || 4000);

// ---------- Motor de plantillas ----------
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// ---------- Middlewares ----------
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// ---------- Rutas ----------
app.use("/", productRoutes);       // /, /products, /products/:id
app.use("/orders", orderRoutes);   // /orders/new/:productId, /orders, /orders/success/:id

// ---------- 404 ----------
app.use((req, res) => {
    res.status(404).send("Página no encontrada");
});

// ---------- Arrancar ----------
async function start() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Tienda en http://localhost:${PORT}`);
    });
}

start();