# Configuración de Aunelya HOME V1

La HOME queda lista para terminarse desde el editor del tema y Shopify Admin, sin IDs ni URLs provisionales.

## Configuración necesaria en Shopify Admin

- Asignar el menú `main-menu` al header y crear sus destinos reales, incluidas las páginas de Resultados y FAQ cuando estén disponibles.
- Asignar el menú `footer` al footer y revisar que las políticas de la tienda estén publicadas.
- Seleccionar el producto destacado en la sección **Aunelya producto**. Sus variantes deben incluir valores equivalentes a `Rosa` y `Blanco`; la comparación ignora mayúsculas, espacios y acentos normalizables por Shopify.
- Sustituir los CTA ancla `#aunelya-shop` por enlaces definitivos si la conversión debe llevar directamente a producto o colección.
- Añadir perfiles sociales únicamente desde el bloque social nativo del footer. Sin URLs configuradas, no se muestran iconos públicos.
- Activar **Aunelya opiniones** sólo después de añadir bloques con testimonios reales y autor identificado.

## Controles editables

- Wordmark textual global en **Configuración del tema > Logo**.
- Producto, títulos, CTA, textos alternativos e imágenes opcionales desde cada sección Aunelya.
- Bloques editables para confianza, colores, momentos lifestyle, prestaciones y opiniones.

## Preview

Validar el theme conectado a la tienda antes de publicar: drawer móvil, búsqueda, cuenta, carrito, menús, producto sin asignar, coincidencias de variantes, fallback de variante y opiniones activadas/desactivadas.

# Configuración de la PDP Aunelya V1

La plantilla `product` usa la sección nativa de Horizon (galería, selector, formulario, carrito, checkout acelerado y sticky add to cart) y, debajo, las secciones Aunelya de tecnología, rutina, qué incluye y preguntas frecuentes.

- Crear el producto con una opción llamada `Color` y valores `Rosa` y `Blanco`. El selector muestra el punto de color cuando el nombre de la opción contiene "color".
- Subir las imágenes del producto y asignar a cada variante su imagen destacada; la galería oculta la media de la variante no seleccionada.
- Sin media, la PDP muestra los cutouts Rosa/Blanco del tema como imagen provisional.
- Publicar las políticas de envío y reembolso para que aparezcan los enlaces en las preguntas frecuentes.
- Revisar las respuestas de las preguntas frecuentes antes de publicar; no incluyen autonomía, temperaturas, plazos ni certificaciones.
- Activar Shop Pay u otros métodos de pago acelerado en Shopify Payments si se quieren mostrar bajo el botón principal.
