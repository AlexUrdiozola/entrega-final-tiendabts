# Purple Shop · BTS 💜

Aplicación de e-commerce desarrollada con React JS para el proyecto final del curso de Coderhouse. Está dirigida a fans de BTS y permite explorar álbumes, light sticks y productos coleccionables, gestionar un carrito y registrar órdenes de compra en Firebase Firestore.

##  Deploy

Aplicación publicada en **[GitHub Pages](https://alexurdiozola.github.io/entrega-final-tiendabts/)**.

La navegación usa `HashRouter` para permitir enlaces directos y recargas en GitHub Pages, por ejemplo `/#/cart`. El frontend se sirve desde la rama `gh-pages`; los productos y las órdenes se almacenan en Firebase.

Para preparar una actualización de la publicación, compilar con `DEPLOY_BASE_PATH=/entrega-final-tiendabts/` y la configuración de Firebase en `.env.local`, y publicar el contenido de `dist` en `gh-pages`. Los cambios en la rama de código fuente no actualizan por sí solos la versión publicada.

##  Tecnologías utilizadas

- **React:** construcción de componentes y manejo de estado mediante hooks.
- **Vite:** entorno de desarrollo y compilación.
- **React Router DOM:** navegación SPA y rutas dinámicas.
- **Firebase Firestore:** almacenamiento de productos y órdenes.
- **Firebase Authentication:** autenticación anónima para registrar compras.
- **CSS propio:** estilos y diseño responsive.
- **Lucide React:** íconos.
- **Vitest y React Testing Library:** pruebas automatizadas.

##  Funcionalidades principales

- Catálogo de productos obtenido desde Firestore.
- Filtrado por categorías, búsqueda por nombre y ordenamiento por precio.
- Detalle de producto con selector de cantidad y validación de stock.
- Ocultamiento del selector después de agregar un producto al carrito.
- Carrito global mediante React Context: agregar, modificar cantidades, eliminar, vaciar y calcular totales.
- Persistencia del carrito mediante localStorage.
- Checkout con validación de datos y confirmación del correo electrónico.
- Registro de órdenes en Firestore y visualización del ID de compra.
- Indicadores de carga y mensajes de error, carrito vacío y productos agotados.
- Diseño adaptable a dispositivos móviles.
- Precios expresados en dólares estadounidenses (USD).

##  Instalación y ejecución local

### Requisitos

- Node.js 22.12 o superior compatible con Vite.
- npm.
- Configuración web del proyecto Firebase, entregada por separado.

### 1. Clonar el repositorio

```bash
git clone https://github.com/AlexUrdiozola/entrega-final-tiendabts.git
cd entrega-final-tiendabts
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Configurar Firebase

Crear un archivo `.env.local` en la raíz del proyecto, junto a `package.json`, tomando `.env.example` como referencia.

Completarlo con la configuración web proporcionada:

```env
VITE_DATA_MODE=firebase
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

El proyecto Firebase de esta entrega ya tiene Firestore, el catálogo y la autenticación anónima configurados. **No es necesario crear otra base de datos ni disponer de acceso a la consola** para ejecutar la aplicación con la configuración entregada.

El archivo `.env.local` está excluido del repositorio. No se necesitan claves privadas de cuentas de servicio para ejecutar el frontend.

### 4. Iniciar la aplicación

```bash
npm run dev
```

Abrir la dirección que indique la terminal, habitualmente:

[http://127.0.0.1:5173](http://127.0.0.1:5173)

Mantener la terminal abierta mientras se utiliza la aplicación. Si se modifican las variables de entorno, reiniciar el servidor.

> La aplicación debe iniciarse con Vite; no se ejecuta abriendo `index.html` con doble clic.

### Modo demostración opcional

Para explorar la interfaz sin configurar Firebase:

```env
VITE_DATA_MODE=demo
```

Este modo utiliza productos locales y genera identificadores de compra simulados. **No guarda órdenes en Firestore.**

##  Arquitectura de componentes

```text
App
 ├── NavBar
 │    └── CartWidget
 ├── ItemListContainer
 │    └── ItemList
 │         └── Item
 ├── ItemDetailContainer
 │    └── ItemDetail
 │         └── ItemCount
 ├── Cart
 │    ├── CartItem
 │    └── OrderSummary
 └── CheckoutForm
      └── OrderSummary
```

Los componentes contenedores gestionan las consultas y los estados de carga. Los componentes de presentación reciben los datos mediante props.

El carrito se administra con **React Context y useReducer**. También se utilizan `useState`, `useEffect`, `useMemo` y `useRef` para gestionar la interacción, persistencia y procesamiento del checkout.

### Organización del código

```text
src/
 ├── components/   # Componentes de interfaz y contenedores
 ├── context/      # Contexto y reducer del carrito
 ├── data/         # Catálogo de demostración
 ├── services/     # Configuración y operaciones de Firebase
 ├── App.jsx      # Rutas de la aplicación
 ├── main.jsx     # Punto de entrada
 └── styles.css   # Estilos generales y responsive
```

##  Firebase Firestore

La aplicación utiliza dos colecciones:

- **`products`:** nombre, descripción, precio, stock, categoría, imagen y etiquetas del producto.
- **`orders`:** datos del comprador, productos adquiridos, cantidades, total, moneda, identificador del usuario y fecha generada por el servidor.

Antes de registrar una orden se consultan nuevamente los productos para validar precios y disponibilidad. Las reglas permiten leer el catálogo y crear órdenes validadas, sin permitir la lectura pública de los datos de compradores.

##  Pruebas y compilación

Ejecutar las pruebas automatizadas:

```bash
npm test
```

Generar la versión de producción:

```bash
npm run build
```

Visualizar localmente la versión compilada:

```bash
npm run preview
```

Las pruebas cubren operaciones del carrito, límites de cantidad, validación de órdenes y un recorrido de compra en modo demo. No generan compras en Firebase.

##  Alcance del proyecto

Proyecto académico y fan, sin afiliación con BTS o Weverse. El catálogo combina referencias de Weverse con productos ficticios; el stock es ilustrativo.

Las compras se registran en Firestore, pero **no se procesan pagos, envíos ni descuentos automáticos de stock en la nube**.

##  Autor

**Alex Urdiozola**  
Proyecto Final Integrador – React JS · Coderhouse

[Repositorio en GitHub](https://github.com/AlexUrdiozola/entrega-final-tiendabts)
