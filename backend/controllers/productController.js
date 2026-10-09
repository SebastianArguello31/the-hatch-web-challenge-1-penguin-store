// Panel de administración. Procesa las solicitudes de productos y prepara los datos para las vistas.
const mongoose = require("mongoose");
const Product = require("../../shared/models/Product");

// ---------- Funciones auxiliares ----------

// Revisa los datos del formulario y devuelve una lista de errores
function validateProduct(body) {
    const errors = [];

    const name = String(body.name || "").trim();
    const price = Number(body.price);
    const stock = Number(body.stock);

    if (!name) {
        errors.push("El nombre es obligatorio");
    }

    // Valida enteros dentro del rango que JavaScript puede representar con precisión.
    if (!Number.isSafeInteger(price) || price <= 0) {
        errors.push("El precio debe ser un entero mayor a 0 en guaraníes");
    }

    // Valida enteros dentro del rango que JavaScript puede representar con precisión.
    if (!Number.isSafeInteger(stock) || stock < 0) {
        errors.push("El stock debe ser un número entero igual o mayor a 0");
    }

    return errors;
}

// Arma el objeto que vamos a guardar en MongoDB
function buildProductData(body) {
    return {
        name: String(body.name || "").trim(),
        description: String(body.description || "").trim(),
        price: Number(body.price),
        stock: Number(body.stock),
        category: String(body.category || "").trim()
    };
}

// ---------- GET /admin/products ----------
exports.index = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.render("products/index", {
            title: "Productos",
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};

// ---------- GET /admin/products/new ----------
exports.newForm = (req, res) => {
    res.render("products/new", {
        title: "Nuevo producto",
        product: {},
        errors: [],
        formAction: "/admin/products",
        buttonText: "Crear producto"
    });
};

// ---------- POST /admin/products ----------
exports.create = async (req, res) => {
    try {
        const errors = validateProduct(req.body);

        if (errors.length > 0) {
            return res.status(400).render("products/new", {
                title: "Nuevo producto",
                product: req.body,
                errors: errors,
                formAction: "/admin/products",
                buttonText: "Crear producto"
            });
        }

        await Product.create(buildProductData(req.body));

        res.redirect("/admin/products");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};

// ---------- GET /admin/products/:id/edit ----------
exports.editForm = async (req, res) => {
    try {
        const id = req.params.id;

        // Rechaza identificadores inválidos antes de consultar la base de datos.
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send("Producto no encontrado");
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }

        res.render("products/edit", {
            title: "Editar producto",
            product: product,
            errors: [],
            formAction: `/admin/products/${product._id}?_method=PUT`,
            buttonText: "Guardar cambios"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};

// ---------- PUT /admin/products/:id ----------
exports.update = async (req, res) => {
    try {
        const id = req.params.id;

        // Rechaza identificadores inválidos antes de consultar la base de datos.
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send("Producto no encontrado");
        }

        const errors = validateProduct(req.body);

        if (errors.length > 0) {
            return res.status(400).render("products/edit", {
                title: "Editar producto",
                product: req.body,
                errors: errors,
                formAction: `/admin/products/${id}?_method=PUT`,
                buttonText: "Guardar cambios"
            });
        }

        // Guarda los campos enviados y aplica los validadores del esquema.
        const updated = await Product.findByIdAndUpdate(
            id,
            buildProductData(req.body),
            { runValidators: true }
        );

        if (!updated) {
            return res.status(404).send("Producto no encontrado");
        }

        res.redirect("/admin/products");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};

// ---------- DELETE /admin/products/:id ----------
exports.destroy = async (req, res) => {
    try {
        const id = req.params.id;

        // Rechaza identificadores inválidos antes de consultar la base de datos.
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send("Producto no encontrado");
        }

        await Product.findByIdAndDelete(id);

        res.redirect("/admin/products");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};