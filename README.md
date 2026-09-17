# Purple Shop · BTS

SPA académica creada con React, Vite, React Router y Firebase/Firestore. Migra la identidad violeta y las imágenes de `bts-final` a una tienda modular. El proyecto original se conserva intacto. No procesa pagos ni envíos reales.

## Firebase conectado

La entrega está configurada para el proyecto `proyecto-reactjs-bts`, con Firestore `(default)` en `nam5`, autenticación anónima habilitada, seis productos en USD y reglas publicadas. El ZIP incluye `.env.local` con la configuración web pública; ese archivo sigue excluido de Git.

El 17 de septiembre de 2026 se ejecutó el mismo servicio `createOrder` utilizado por el checkout contra Firebase real. Se guardó la orden de prueba `yd2EAWVjpwUTgJ6F5PFQ` por USD 39,27 con datos ficticios. La lectura pública de esa orden fue denegada (HTTP 403). El resultado está en `firebase-verification.json`. Puedes consultar la orden con tu cuenta desde la consola de Firestore, colección `orders`.

## Iniciar

Requisitos: Node.js 22.12+ (o 20.19+) y npm.

```sh
npm ci
npm run dev
```

Abrir la URL que muestra Vite (habitualmente http://127.0.0.1:5173).

```sh
npm test
npm run build
npm run preview
```

Sin variables de entorno funciona en **modo demo**: productos locales, carrito persistente en localStorage y órdenes simuladas con prefijo `DEMO-`. Las órdenes demo no se almacenan; su stock se mantiene solo durante la sesión de la página. Los datos del comprador no se guardan localmente.

## Conectar tu primer Firebase

1. En https://console.firebase.google.com crea un proyecto y registra una aplicación web (`</>`). Copia la configuración web que proporciona Firebase.
2. Crea una base **Cloud Firestore** con ID `(default)`. Elige su región y comienza en modo producción.
3. En **Authentication → Sign-in method**, habilita el proveedor **Anónimo**. Las compras usarán una sesión anónima, sin formulario de registro.
4. Copia `.env.example` a `.env.local`. Completa las seis variables de configuración web y establece `VITE_DATA_MODE=firebase`.
5. Copia el contenido de `firestore.rules` en **Firestore → Reglas** y publícalo. Las reglas permiten leer productos y crear órdenes validadas; impiden leer datos de compradores y modificar productos desde el navegador.
6. Carga los documentos en la colección **products** con los IDs y campos de `src/data/products.js`. Puedes hacerlo desde la consola, o con el script de carga descrito abajo.
7. Reinicia `npm run dev`. Verifica que el pie indique conexión a Firebase, abre productos y completa una compra de prueba. La pantalla mostrará el ID real; comprueba que existe el documento en **orders**.

### Carga inicial mediante script

En la configuración de Firebase → Cuentas de servicio, genera una clave privada y guárdala **fuera del proyecto y del repositorio**. Define `GOOGLE_APPLICATION_CREDENTIALS` en `.env.local` con la ruta absoluta a esa clave, sin prefijo `VITE_`. Ejecuta:

```sh
npm run seed
```

Usa Firebase Admin, solo en Node; la clave nunca se importa al frontend. El script crea los productos que faltan, sin sobrescribir documentos existentes. Alternativamente, carga manualmente los seis documentos desde la consola sin generar claves.

La configuración web pública de Firebase no es una clave de administrador. La protección de datos depende de las reglas. `.env.local`, claves privadas y `node_modules` están excluidos de Git. No envíes claves de servicio al profesor: comparte únicamente la configuración web por el medio solicitado.

### Modelo de datos

- `products/{id}`: name, category, description, price (USD), stock (entero), image, badge y source o mock.
- `orders/{id}`: uid, buyer { name, email, phone }, items [{ id, name, quantity, price }], total, currency, createdAt (timestamp del servidor), status.

El checkout relee los productos en una transacción y rechaza stock insuficiente o cambios de precio. Las reglas verifican cada línea y el total. Se permiten hasta diez líneas por orden por el límite de lecturas de reglas. El catálogo inicial tiene seis productos.

**Alcance académico:** las órdenes registran intención de compra; el stock en la nube no se descuenta ni se reserva. Una tienda comercial necesitaría backend confiable para reserva atómica de inventario, pagos y prevención de abuso. No se habilitan escrituras públicas sobre inventario.

## Componentes y conceptos

```text
App / BrowserRouter
├── NavBar → CartWidget
├── ItemListContainer → ItemList → Item
├── ItemDetailContainer → ItemDetail → ItemCount
├── Cart → CartItem / OrderSummary
└── CheckoutForm → OrderSummary
```

- Contenedores: carga asíncrona y errores. Presentación: recibe datos por props.
- Context + useReducer: carrito global, cantidades, total y acciones.
- useEffect: lectura de productos, persistencia, cancelación lógica de respuestas antiguas y cambio de ruta.
- useState: filtros, cantidades, carga y resultado del checkout.
- useMemo: catálogo filtrado y datos derivados del carrito.
- useRef: bloqueo de envíos duplicados mientras se guarda.
- React reconcilia el Virtual DOM; se usan claves estables por ID y no hay manipulación manual del DOM para construir la UI.
- React Router: `/`, `/category/:categoryId`, `/item/:itemId`, `/cart`, `/checkout`, ruta 404. Navegación sin recargar.
- Validaciones: mínimo/máximo/entero en ItemCount, cantidad acumulada por stock, emails coincidentes, teléfono y campos requeridos. ItemCount desaparece al agregar.
- Estados: loading, error, catálogo vacío, búsqueda sin resultados, producto inexistente, sin stock, carrito vacío, orden guardada.
- Accesibilidad: etiquetas de controles, enlace para saltar al contenido, foco visible, mensajes de estado, navegación por teclado y estilos responsive.

## Catálogo y procedencia

Consulta: 16 de septiembre de 2026. La [categoría proporcionada](https://shop.weverse.io/es/shop/MXN/artists/2/categories/175) no expuso artículos en la consulta. Se incorporaron dos referencias verificadas en otras páginas oficiales:

- [Official Light Stick Ver.4](https://shop.weverse.io/en/shop/USD/artists/2/sales/62838): nombre e imagen de Weverse.
- [Proof · Standard Edition](https://shop.weverse.io/en/shop/USD/artists/2/sales/8601): nombre e imagen de Weverse.

Las descripciones son breves paráfrasis. Todos los precios se expresan en dólares estadounidenses (USD). Light Stick (64 USD) y Proof (39.27 USD) toman los importes de las páginas consultadas; los otros cuatro precios son ilustrativos, sin conversión cambiaria. El stock es inventado y no representa disponibilidad oficial. Los otros cuatro productos son conceptos ficticios señalados en sus detalles. Las imágenes locales proceden de la carpeta `img` del proyecto entregado; no se afirma propiedad o licencia comercial. Las dos imágenes remotas requieren conexión y tienen fallback local.

El carrito usa la clave `purple-cart-usd` para evitar recuperar importes antiguos en pesos. Las nuevas órdenes y las reglas de Firestore usan USD. Si ya se cargó un catálogo anterior en Firestore, sus precios deben actualizarse antes de activar ese modo: el script seed no sobrescribe documentos existentes.

## Publicación y entrega

La carpeta `bts-shop` tiene su propio repositorio Git independiente, en la rama `codex/bts-shop`. Trabaja desde esta carpeta para que Git no tome como raíz el directorio personal. El repositorio todavía no tiene un remoto configurado; al publicarlo, conecta un repositorio nuevo y vacío dedicado a esta tienda.

Se incluye `firebase.json` con reescritura SPA para que funcionen enlaces directos al detalle, carrito y categorías en Firebase Hosting. Tras configurar tu cuenta puedes compilar y publicar con Firebase CLI. Para otro hosting, configura todas las rutas para servir `index.html`.

Para entregar en GitHub, crea un repositorio público, sube el código incluyendo `package-lock.json` y excluye `.env.local`, credenciales, `node_modules` y `dist`. Comprueba la visibilidad pública en una ventana privada. El repositorio y el sitio todavía no están publicados; la base de datos Firebase sí está configurada.

## Pruebas

`npm test` cubre acumulación y límites del carrito, eliminación, total de compra, stock insuficiente, cambios de precio, entradas inválidas de ItemCount y un recorrido de detalle a carrito y checkout demo. Estas pruebas usan modo demo explícito y no generan órdenes en la nube. La comprobación independiente de Firebase real está registrada en `firebase-verification.json` y `VERIFICACION.md`.

Referencias técnicas: [transacciones Firestore](https://firebase.google.com/docs/firestore/manage-data/transactions), [BrowserRouter](https://reactrouter.com/api/declarative-routers/BrowserRouter).
