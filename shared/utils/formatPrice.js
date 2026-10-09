// Formatea los importes en guaraníes. No convierte monedas ni cambia los valores almacenados.
// Aplica separadores de miles del formato paraguayo y no muestra decimales.
const formatter = new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 });

module.exports = function formatPrice(value) {
    return "₲ " + formatter.format(value);
};
