// Carga el .env de la raíz con una ruta independiente del directorio de ejecución.
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });
