# Valoraciones de Aunelya — arquitectura APP-FIRST

## Cómo funciona a partir de ahora

1. **Instalar una app de reseñas compatible** (ninguna instalada todavía).
2. **Añadir su app block** a la sección «Aunelya valoraciones» desde el Theme Editor
   (la sección solo acepta bloques `{ "type": "@app" }`).
3. Cuando la app escriba los metacampos estándar
   `product.metafields.reviews.rating` y
   `product.metafields.reviews.rating_count`,
   el badge («Aunelya valoración») y la sección aparecen **automáticamente**.
4. **Mientras no existan reseñas reales, la tienda no muestra puntuación**:
   sin badge, sin estrellas, sin sección y sin mensaje de «sé la primera».
5. **No añadir `Review` / `AggregateRating` manualmente.** Ese schema pertenece a la app.

## Reparto de responsabilidades

- **Theme / Shopify:** `Product` / `ProductGroup` base, `offers`, precio,
  disponibilidad, variantes y `BreadcrumbList`
  (`sections/product-information.liquid`, filtro `structured_data`).
  Los metacampos `reviews.rating` y `reviews.rating_count` son la **fuente
  visual** de la puntuación, pero el theme no genera schema de reseñas.
- **App de reseñas:** almacenar y publicar reseñas reales, verificar clientes,
  formulario para escribir reseñas, emails post-compra y el structured data
  `Review` / `AggregateRating`.

## Compatibilidad con apps

Compatibilidad confirmada/documentada con los metacampos estándar:

- **Judge.me**
- **Loox**
- **Yotpo** cuando Shopify Metafields Sync está activado

Para cualquier otra app, **comprobar antes** que escriba:

- `reviews.rating`
- `reviews.rating_count`

Sin esos metacampos, el badge y la sección seguirán ocultos.

## Reglas que nunca se rompen

- Nunca crear ratings manuales.
- Nunca publicar reseñas inventadas.
- Sin reseñas reales, no se muestra puntuación.
- Las reseñas individuales pertenecen a la app, no al theme.
