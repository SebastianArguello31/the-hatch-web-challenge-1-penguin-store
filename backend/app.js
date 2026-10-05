// Panel de administración. Configura Express, las vistas, los middleware y las rutas. Inicia el servidor después de conectar a MongoDB.
const path = require("path");
// Carga el .env compartido de la raíz, independientemente de la carpeta de ejecución.
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const methodOverride = require("method-override");

const connectDB = require("./config/db");
const requireAuth = require("./middleware/requireAuth");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

if (!process.env.SESSION_SECRET) {
    console.error("Falta SESSION_SECRET en el archivo .env");
    process.exit(1);
}

const app = express();
// Permite usar formatPrice en cualquier plantilla Pug.
app.locals.formatPrice = require("./utils/formatPrice");
// Lee el puerto propio de la aplicación y usa el valor predeterminado si falta.
const PORT = Number(process.env.ADMIN_PORT || 3000);

// ---------- Motor de plantillas ----------
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// ---------- Middlewares ----------
// Archivos estáticos (CSS) desde /public
app.use(express.static(path.join(__dirname, "public")));

// Leer los datos de los formularios HTML en req.body
app.use(express.urlencoded({ extended: false }));

// Permitir PUT y DELETE usando ?_method=PUT o ?_method=DELETE en la URL
app.use(methodOverride("_method"));

// Sesiones, guardadas en MongoDB
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
        }),
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 // 1 día
        }
    })
);

// Variable disponible en TODAS las vistas Pug
app.use((req, res, next) => {
    res.locals.adminEmail = req.session.adminEmail;
    next();
});

// ---------- Rutas ----------
app.get("/", (req, res) => {
    res.redirect("/admin");
});

app.use("/", authRoutes); // /login y /logout (públicas)

app.use("/admin", requireAuth);
app.use("/admin", dashboardRoutes);
app.use("/admin/products", productRoutes);
app.use("/admin/orders", orderRoutes);

// ---------- 404 ----------
app.use((req, res) => {
    res.status(404).send("Página no encontrada");
});

// ---------- Arrancar ----------
async function start() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Panel de administración en http://localhost:${PORT}`);
    });
}

start();