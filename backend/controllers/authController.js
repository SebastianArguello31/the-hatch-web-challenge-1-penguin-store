// Panel de administración. Muestra el formulario de acceso, comprueba las credenciales y permite cerrar la sesión.
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// GET /login → muestra el formulario
exports.showLogin = (req, res) => {
    if (req.session.adminId) {
        return res.redirect("/admin");
    }

    res.render("login", { title: "Iniciar sesión", error: null, email: "" });
};

// POST /login → comprueba las credenciales
exports.login = async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        const admin = await Admin.findOne({ email: email });

        if (!admin) {
            return res.status(401).render("login", {
                title: "Iniciar sesión",
                error: "Email o contraseña incorrectos",
                email: email
            });
        }

        // Compara la contraseña recibida con el hash almacenado mediante bcrypt.
        const passwordOk = await bcrypt.compare(password, admin.password);

        if (!passwordOk) {
            return res.status(401).render("login", {
                title: "Iniciar sesión",
                error: "Email o contraseña incorrectos",
                email: email
            });
        }

        // Login correcto: guardamos datos en la sesión
        req.session.adminId = admin._id.toString();
        req.session.adminEmail = admin.email;

        res.redirect("/admin");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};

// POST /logout → cierra la sesión
exports.logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("No se pudo cerrar la sesión. Intenta nuevamente.");
        }
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
};