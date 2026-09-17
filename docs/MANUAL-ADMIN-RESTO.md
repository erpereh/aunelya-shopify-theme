# Manual Admin — Resto pendiente (sin código)

> Todo lo de aquí se hace en `aunelya.shop/admin`, sin terminal ni tokens.
> Lo de código/textos-JSON lo hace Codex con `docs/PROMPT-CODEX-RESTO.md`.

## ⛔ Blindaje: NO tocar

Precios, variantes, inventario, imágenes de catálogo (no subir/borrar/reordenar), CSS, layout, secciones ni estructura del tema. Solo los pasos de abajo.

---

## 1. Moneda y mercado a México (5 min) — PRIORITARIO

**Dónde:** Configuración → **Moneda de la tienda** + **Mercados**.

1. Cambia la moneda a **MXN ($)**.
2. En **Mercados**, deja **México** como mercado principal y verifica que las zonas de envío incluyen México.
3. Abre el checkout de prueba y confirma que muestra MXN y envío a México.

*Por qué: la tienda figura en España/EUR pero todo el SEO dice "envíos a México". Precio en EUR + promesa MX hunde conversión y rompe los rich results (`og:price:currency`, `offers`).*

## 2. Descripción de la colección `frontpage` (1 min)

**Dónde:** Productos → **Colecciones** → `frontpage` (*Página de inicio*). No existe `all`; se usa esta.

Pegar en **Descripción**:

> *Cinturón térmico Aunelya en México: calor en 5 niveles y vibración en 4 niveles, correa ajustable y batería recargable por USB. Disponible en Rosa y Blanco. Compra segura con envíos a todo México. Accesorio de bienestar, no un producto médico.*

## 3. NAP y redes reales (cuando los tengas)

- **Editor del tema** (solo rellenar texto): email, teléfono, ubicación y horario reales en Contacto; URLs reales de Instagram/TikTok/Facebook/YouTube en el footer.
- **No inventar datos**: lo vacío no se muestra y no penaliza; avísame cuando los tengas y activo el `sameAs` del schema.

## 4. Retirar la contraseña de la tienda

**Dónde:** Tienda online → **Preferencias** → *Protección con contraseña* → Desactivar.

Sin esto Google no puede rastrear nada: Search Console y Rich Results Test quedan bloqueados.

## 5. Verificación (tras lo anterior)

1. **Search Console** → *Inspección de URLs*: home, PDP, `/pages/faq` → *Solicitar indexación*.
2. **Rich Results Test** con la URL del PDP: esperar válidos `FAQPage`, `Product` (precio en MXN, disponibilidad) y `BreadcrumbList`. Las estrellas aún no salen (requieren app de reseñas).
3. Comprobar en la home que las 4 tarjetas lifestyle enlazan al producto (tras el trabajo de Codex).

## 6. Bloqueado por datos del proveedor (pedir antes de publicar)

- Duración de batería y tiempo de carga → FAQ P1.
- Temperaturas por nivel → FAQ P2.
- Rango de medidas de la correa → FAQ P3 (+ PDP si aplica).
- Tiempos y costes de envío por zona → FAQ P6.
- Garantía: cobertura y proceso → FAQ P7.
- Instrucciones de lavado de la etiqueta → FAQ P4.

## 7. Futuro (cuando haya volumen)

Blog (5 artículos en `docs/SEO.md` §5.3) y migración de reseñas a app (Judge.me/Loox) retirando el schema manual.
