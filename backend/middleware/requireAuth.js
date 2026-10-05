// Panel de administración. Protege las rutas administrativas comprobando que exista un administrador en la sesión.
function requireAuth(req, res, next) {
    if (!req.session.adminId) {
        return res.redirect("/login");
    }

    // Continúa hacia el controlador cuando la sesión está autenticada.
    next();
}

module.exports = requireAuth;