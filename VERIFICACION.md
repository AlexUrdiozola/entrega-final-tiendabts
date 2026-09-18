# Verificación de entrega

Actualizado el 18 de septiembre de 2026.

- Compilación de producción con Vite 8.3.0: correcta.
- Vitest: seis pruebas aprobadas, incluyendo el recorrido de compra.
- Navegador: catálogo, imágenes, detalle, agregado, carrito, formulario y confirmación demo verificados. Sin errores o advertencias de consola durante la revisión.
- Vista móvil de 390 × 844: catálogo sin desbordamiento horizontal; checkout completado con datos ficticios.
- Instalación limpia del lockfile en una carpeta independiente: correcta con `npm ci --ignore-scripts --offline`; compilación de esa copia: correcta.
- El entorno de Windows bloquea procesos secundarios de algunos scripts npm. Por ello la verificación ejecutó Vite y Vitest directamente mediante Node, con `--configLoader native`, y omitió scripts de instalación. Los scripts habituales para desarrollo fuera de este entorno están en package.json.
- npm informa deprecaciones de dependencias transitivas (whatwg-encoding, node-domexception y uuid). No impiden la compilación ni las pruebas. No se modificaron dependencias internas para ocultarlas.
- Firebase configurado: proyecto `proyecto-reactjs-bts`, base `(default)` en `nam5`, plan Spark, proveedor anónimo habilitado y reglas compiladas/publicadas con Firebase CLI desde Cloud Shell.
- Seis productos cargados y lectura desde el servicio de la aplicación verificada contra Firestore real.
- El 17 de septiembre se ejecutó `createOrder`, el mismo servicio utilizado por el checkout, mediante el cargador SSR de Vite. Firebase confirmó la escritura de la orden `yd2EAWVjpwUTgJ6F5PFQ`: un Proof por USD 39,27, con datos de comprador ficticios. No se procesó ningún pago.
- La lectura REST sin autenticar de esa orden devolvió HTTP 403, según las reglas de privacidad. El registro de la verificación se incluye en `firebase-verification.json`.
- La comprobación del 17 de septiembre se realizó sobre los servicios reales de la aplicación; no se repitió el recorrido visual completo del navegador con Firebase.
- Repositorio de entrega: https://github.com/AlexUrdiozola/entrega-final-tiendabts (público).

La conexión a Firebase está activa y verificada. El frontend se publica en GitHub Pages: https://alexurdiozola.github.io/entrega-final-tiendabts/. Usa HashRouter y rutas de recursos adaptadas al subdirectorio del repositorio. Las seis pruebas locales pasaron después del cambio y la compilación de producción terminó correctamente. Las órdenes académicas no reservan ni descuentan stock en la nube, como se explica en README.md.
