# Prompt para Codex — Resto pendiente (textos ES + noindex + enlaces)

> Cómo usarlo: copia el bloque de abajo tal cual y pégaselo a Codex en el repo `aunelya-shopify-theme`, rama `main`.
> Alcance: **solo texto y SEO técnico menor**. Lo manual de Admin va en `docs/MANUAL-ADMIN-RESTO.md`.

---

## Prompt (copiar desde aquí)

```text
En el repo aunelya-shopify-theme (rama main), aplica SOLO los 4 puntos de
abajo. Todo es texto o SEO menor: no toques precios, variantes, inventario,
imágenes, CSS, layout, secciones ni estructura. No hagas `theme push`.

PUNTO 1 — Traducir textos en inglés a español (mantén HTML y settings):
- templates/404.json línea 18: `<h1>Page not found</h1>` → `<h1>Página no encontrada</h1>`
- templates/404.json línea 42: `<p>The link may be incorrect, or the page has been removed. </p>` → `<p>Es posible que el enlace sea incorrecto o que la página se haya eliminado.</p>`
- templates/404.json línea 66: `Continue shopping` → `Seguir comprando`
- templates/404.json línea 133: `<p>Discover something new</p>` → `<p>Descubre algo nuevo</p>`
- templates/list-collections.json línea 54: `<h1>Collections</h1>` → `<h1>Colecciones</h1>`
- templates/cart.json: título `Cart` → `Cesta`; línea 104 `<h3>You may also like</h3>` → `<h3>También te puede gustar</h3>`; línea 128 `View all` → `Ver todo`
- templates/password.json línea 39: `<h1>Opening soon</h1>` → `<h1>Apertura próximamente</h1>`; línea 63: `<p>Sign up for our newsletter to be the first to know when we launch.</p>` → `<p>Suscríbete a nuestra newsletter y sé la primera en saber cuándo lanzamos.</p>`; línea 99: `Sign up` → `Suscribirme`

PUNTO 2 — Enlazar las 4 tarjetas lifestyle al producto:
- En templates/index.json, bloques aunelya_lifestyle/home, movement, routine,
  when_needed: el setting `link` está vacío (""). Pon en los 4:
  `shopify://products/cinturon-termico-aunelya`
- La sección (sections/aunelya-lifestyle.liquid:50,61) ya envuelve la card en
  enlace solo si `link != blank`; no toques la sección.

PUNTO 3 — noindex en búsqueda y carrito:
- En snippets/meta-tags.liquid, añade tras el canonical:
  `{% if request.page_type == 'search' or request.page_type == 'cart' or request.page_type == 'password' %}<meta name="robots" content="noindex, follow">{% endif %}`
  (El robots.txt ya bloquea /search; esto es la segunda capa.)
- No añadas noindex a ninguna otra plantilla.

PUNTO 4 — sameAs (SOLO si existen URLs reales):
- Busca en sections/footer-group.json y templates/page.contact.json si hay
  URLs de Instagram/TikTok/Facebook/YouTube rellenas (hoy están vacías).
- Si siguen vacías: NO inventes nada, déjalo e indícalo.
- Si hay alguna real: añádela como array `sameAs` en el JSON-LD
  Organization de sections/header.liquid (líneas ~328-338).

VERIFICACIÓN OBLIGATORIA:
- `node --test tests/aunelya-home.test.mjs` desde la raíz: todo en verde.
- Si algún test esperaba los textos ingleses o el footer sin FAQ, actualízalo
  de forma coherente e indícalo. Añade assertions para: textos ES del 404,
  links lifestyle no vacíos, `noindex` en search/cart y (si aplica) sameAs.

ENTREGA:
- Diff resumido (archivos y líneas), resultado de tests y confirmación
  explícita de que no cambió nada visual, de producto ni de precios.
```

---

## Referencia rápida

| Punto | Archivos |
|---|---|
| Textos ES | `templates/404.json`, `list-collections.json`, `cart.json`, `password.json` |
| Links lifestyle | `templates/index.json` (4 bloques, setting `link`) |
| noindex | `snippets/meta-tags.liquid` (search/cart/password) |
| sameAs | Solo si hay redes reales; si no, se deja indicado |

## Fuera de alcance (manual en Admin → `docs/MANUAL-ADMIN-RESTO.md`)

Moneda MXN, descripción `frontpage`, NAP/redes reales, retirar contraseña, Search Console, FAQs con datos del proveedor, blog y app de reseñas.
