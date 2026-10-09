# Penguin Store

Tienda online con panel de administración desarrollada para **The Hatch — Web Challenge 1**. Permite gestionar productos, consultar un catálogo público y registrar pedidos con control de stock e importes en guaraníes paraguayos (₲).

Las páginas se renderizan en el servidor con Pug. La navegación y los formularios funcionan sin JavaScript en el navegador.

## Funcionalidades

### Tienda pública

- Catálogo con imagen opcional, nombre, descripción, categoría, precio y stock.
- Página de detalle de cada producto e indicación de productos agotados.
- Compra de un producto por pedido, con la cantidad elegida por el cliente.
- Formulario con nombre del cliente y dirección de entrega.
- Validación de datos y disponibilidad de stock en el servidor.
- Cálculo del total, registro del pedido y descuento de existencias.
- Confirmación con identificador del pedido, fecha, artículos y total.

### Panel de administración

- Inicio y cierre de sesión.
- Dashboard con cantidades totales de productos y pedidos.
- Creación, listado, edición y eliminación de productos.
- Listado de pedidos ordenados del más reciente al más antiguo.
- Consulta del detalle de cada pedido.
- Rutas administrativas protegidas mediante sesiones.
- Script para crear administradores con contraseñas hasheadas.

## Tecnologías

- **Node.js y Express 4:** ejecución y servidores web.
- **MongoDB y Mongoose 9:** persistencia y modelos de datos.
- **Pug:** plantillas HTML renderizadas en el servidor.
- **CSS:** estilos de la tienda y del panel.
- **express-session y connect-mongo:** sesiones administrativas almacenadas en MongoDB.
- **bcryptjs:** hash y comprobación de contraseñas.
- **dotenv:** carga de variables de entorno.
- **method-override:** operaciones PUT y DELETE desde formularios HTML.

Las versiones y dependencias se encuentran en `package.json` y `package-lock.json`.

## Arquitectura

El proyecto utiliza dos procesos independientes que comparten la misma base de datos:

- `backend/`: aplicación del panel administrativo, en el puerto `3000` por defecto.
- `frontend/`: aplicación de la tienda pública, en el puerto `4000` por defecto. También es un servidor Express.

Ambas aplicaciones acceden directamente a MongoDB mediante Mongoose. La tienda no consume una API del panel: cada servidor tiene sus propias rutas, controladores y vistas. La carpeta `shared/` centraliza los modelos `Product` y `Order`, el formato de precios, la conexión a MongoDB y la carga del `.env` de la raíz. El modelo `Admin` permanece en `backend/` porque solo pertenece al panel. Cada servidor mantiene su propia conexión a MongoDB y utiliza las mismas definiciones de datos.

```text
the-hatch-web-challenge-1-penguin-store/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── requireAuth.js
│   ├── models/
│   │   └── Admin.js
│   ├── public/
│   │   └── css/
│   │       └── style.css
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── views/
│   │   ├── orders/
│   │   │   ├── index.pug
│   │   │   └── show.pug
│   │   ├── products/
│   │   │   ├── _form.pug
│   │   │   ├── edit.pug
│   │   │   ├── index.pug
│   │   │   └── new.pug
│   │   ├── dashboard.pug
│   │   ├── layout.pug
│   │   └── login.pug
│   └── app.js
├── frontend/
│   ├── controllers/
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── public/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── images/
│   ├── routes/
│   │   ├── orders.js
│   │   └── products.js
│   ├── views/
│   │   ├── orders/
│   │   │   ├── new.pug
│   │   │   └── success.pug
│   │   ├── products/
│   │   │   └── show.pug
│   │   ├── index.pug
│   │   └── layout.pug
│   └── app.js
├── shared/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── models/
│   │   ├── Order.js
│   │   └── Product.js
│   └── utils/
│       └── formatPrice.js
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Requisitos

- Node.js compatible con las dependencias instaladas. Mongoose 9 requiere **Node.js 20.19.0 o superior**.
- npm.
- Una instancia de MongoDB accesible, local o remota.
- Dos terminales para ejecutar la tienda y el panel simultáneamente.

## Instalación y configuración

Ejecutar los siguientes comandos desde la raíz del repositorio, donde se encuentra `package.json`.

### 1. Instalar dependencias

```sh
npm ci
```

### 2. Crear el archivo de entorno

En PowerShell:

```powershell
Copy-Item .env.example .env
```

En Linux o macOS:

```sh
cp .env.example .env
```

Si ya existe un archivo `.env`, editarlo sin reemplazar su configuración. El archivo de ejemplo contiene:

```dotenv
ADMIN_PORT=3000
STORE_PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/penguin_store
SESSION_SECRET=cambia_esto_por_un_texto_largo_y_aleatorio
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=cambia_esta_contrasena
```

- `ADMIN_PORT`: puerto del panel administrativo.
- `STORE_PORT`: puerto de la tienda pública.
- `MONGODB_URI`: conexión compartida a MongoDB.
- `SESSION_SECRET`: secreto para firmar la cookie de sesión; el panel no inicia si falta.
- `ADMIN_EMAIL` y `ADMIN_PASSWORD`: credenciales utilizadas por el script de creación del administrador.

Reemplazar los valores de ejemplo del secreto y de la contraseña antes de crear la cuenta. `.env` está excluido del repositorio mediante `.gitignore`.

### 3. Preparar MongoDB

Iniciar la instancia local de MongoDB o configurar una conexión remota en `MONGODB_URI`. Ambos servidores esperan a que se establezca la conexión antes de aceptar solicitudes.

### 4. Crear el administrador

```sh
npm run create-admin
```

El script utiliza las credenciales del `.env`, normaliza el correo y guarda la contraseña con bcrypt. Si el correo ya existe, conserva la cuenta existente: volver a ejecutar el script no cambia su contraseña.

### 5. Iniciar las aplicaciones

En una terminal:

```sh
npm run start:backend
```

En otra terminal:

```sh
npm run start:frontend
```

Con los puertos predeterminados:

- Tienda: [http://localhost:4000](http://localhost:4000).
- Acceso administrativo: [http://localhost:3000/login](http://localhost:3000/login).
- Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin).

Para desarrollar con reinicio automático ante cambios, usar `npm run dev:backend` y `npm run dev:frontend` en sus respectivas terminales. No se requiere un paso de compilación.

## Primer uso

1. Iniciar sesión en el panel con la cuenta creada.
2. Abrir **Productos → Nuevo producto**.
3. Completar el nombre, un precio entero positivo en guaraníes y el stock disponible. La descripción y la categoría son opcionales.
4. Abrir la tienda pública y seleccionar **Comprar** en un producto con stock.
5. Completar nombre, dirección y cantidad; confirmar el pedido.
6. Revisar la confirmación y consultar el pedido desde el panel administrativo.
7. Comprobar que el stock se haya reducido según la cantidad comprada.

Los productos se cargan desde el panel; no se incluye un script de datos de ejemplo.

## Rutas principales

### Tienda pública

- `GET /` y `GET /products`: catálogo.
- `GET /products/:id`: detalle del producto.
- `GET /orders/new/:productId`: formulario de pedido.
- `POST /orders`: creación del pedido.
- `GET /orders/success/:id`: confirmación del pedido.

### Panel administrativo

- `GET /`: redirección a `/admin`.
- `GET /login`: formulario de acceso.
- `POST /login`: autenticación.
- `POST /logout`: cierre de sesión.
- `GET /admin`: dashboard.
- `GET /admin/products`: listado de productos.
- `GET /admin/products/new`: formulario de creación.
- `POST /admin/products`: creación de producto.
- `GET /admin/products/:id/edit`: formulario de edición.
- `PUT /admin/products/:id`: actualización de producto.
- `DELETE /admin/products/:id`: eliminación de producto.
- `GET /admin/orders`: listado de pedidos.
- `GET /admin/orders/:id`: detalle del pedido.

Todas las rutas bajo `/admin` requieren una sesión autenticada. Los formularios de edición y eliminación envían solicitudes POST con `?_method=PUT` o `?_method=DELETE`. Las rutas están orientadas a páginas HTML y formularios.

## Datos y reglas de negocio

- **Administrador (`Admin`):** correo único normalizado y contraseña hasheada.
- **Producto (`Product`):** nombre, descripción, ruta de imagen opcional, precio, stock, categoría y fecha de creación.
- **Pedido (`Order`):** nombre del cliente, dirección, artículos, total y fecha de creación.

Cada artículo del pedido conserva una copia del nombre y del precio del producto al comprarlo. Modificar o eliminar el producto después no modifica esos datos históricos.

Los precios y totales se almacenan como enteros en guaraníes y se presentan con el formato `es-PY`, sin decimales. El servidor calcula el total usando el precio almacenado en MongoDB. Los formularios administrativos validan precios positivos y stock entero no negativo; los pedidos requieren una cantidad entera positiva que no supere el stock disponible.

Las sesiones administrativas se guardan en MongoDB. La cookie utiliza `httpOnly`, `sameSite: lax` y una duración configurada de un día. Al cerrar sesión se destruye la sesión y se elimina su cookie.

## Alcance actual

- Cada pedido contiene un único producto con una cantidad determinada, aunque el modelo dispone de un arreglo de artículos.
- No se implementan carrito de compras, cuentas de clientes ni pasarela de pagos. La confirmación indica que se registró el pedido.
- El panel permite consultar pedidos; no incluye edición, cancelación ni seguimiento de estados.
- La creación del pedido y el descuento de stock se guardan por separado, sin transacción. Una interrupción o compras simultáneas pueden generar inconsistencias.
- La página de confirmación es pública y recupera el pedido por su identificador; no exige autenticación del cliente.
