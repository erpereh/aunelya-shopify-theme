# Fase 0 — Manual de aplicación en el Admin (sin código)

> Tiempo estimado: 10-15 min · No requiere terminal ni tokens.
> Textos fuente: `docs/SEO.md` §4-§5 (aquí van ya pegados, listos para copiar).
> Verificación técnica previa: schemas y base ya desplegados en `main` (commits `f533390`, `2fe39a3`).

## ⛔ Blindaje: NO tocar

- **Producto:** precios, variantes, inventario, imágenes de catálogo (no subir, borrar ni reordenar).
- **Visual:** CSS, layout, secciones, estructura del tema, orden de bloques.
- **Solo textos:** títulos SEO, descripciones, páginas, alts (texto), NAP/redes, menús, colección.

---

## Paso 1 — Home: título y metadescripción (2 min)

**Dónde:** Configuración → **Preferencias** → *Título y metadescripción*.

| Campo | Pegar exactamente |
|---|---|
| Título | `Cinturón Térmico Aunelya \| Calor y Confort en México` |
| Descripción | `Cinturón térmico Aunelya con calor y vibración ajustables. Portátil, recargable y con envíos a México. Compra segura.` |

**Hecho bien si:** al guardar, la previsualización muestra el título completo sin cortes.

## Paso 2 — Producto: SEO + descripción (3 min)

**Dónde:** Productos → **Cinturón térmico Aunelya** (o el título actual).

1. Abajo del todo → **SEO** → *Editar*:

| Campo | Pegar exactamente |
|---|---|
| Título | `Cinturón Térmico Aunelya Rosa/Blanco \| 5 Niveles de Calor` |
| Descripción | `Compra el cinturón térmico Aunelya: 5 niveles de calor y 4 de vibración, correa ajustable y batería recargable. Envío a México.` |

2. Campo **Descripción** (editor principal): pegar el texto siguiente tal cual (250 palabras + disclaimer):

> El **cinturón térmico Aunelya** combina calor ajustable en 5 niveles y vibración en 4 niveles en un diseño portátil con correa ajustable, pensado para acompañarte en casa, en el trabajo o en movimiento.
>
> Su uso es sencillo: colócalo en la zona abdominal, ajusta la correa a tu medida y elige el nivel de calor y vibración que te resulte más cómodo. Incluye cable de carga USB, manual de uso y caja. Está disponible en **Rosa** y **Blanco**, con las mismas funciones y precio.
>
> Muchas personas lo integran en su rutina de descanso durante su ciclo, buscando una sensación de calor y confort. Es un accesorio de bienestar, no un producto médico, y no sustituye la orientación de un profesional de la salud. Si tienes alguna condición de salud, consulta a tu médico antes de usar calor o vibración.
>
> *Accesorio de bienestar. No es un producto médico.*

**Hecho bien si:** la descripción se ve desplegable en la ficha y el SEO muestra el candado verde de longitud.

## Paso 3 — Menús (2 min)

**Dónde:** Contenido → **Menús** → `main-menu` (menú principal).

- Orden objetivo: **Inicio, Producto, FAQ, Contacto**.
- Si falta **FAQ**: *Añadir elemento* → Nombre `Preguntas frecuentes` → Enlace: buscar la página FAQ → Guardar.
- El footer ya enlaza la FAQ desde el tema (no tocar).

## Paso 4 — Páginas: FAQ y Contacto (2 min)

**Dónde:** Contenido → **Páginas**.

1. **FAQ** (`faq`):
   - Estado: **Visible/publicada** (el footer la enlaza; si está en borrador el enlace no lleva a nada).
   - SEO de la página → Título: `Preguntas Frecuentes | Aunelya` · Descripción: `Resolvemos tus dudas sobre el cinturón térmico Aunelya: uso, calor, vibración, carga, envíos a México y devoluciones.`
2. **Contacto** (`contact`): sin cambios de contenido. Solo comprobar que existe y está visible.

## Paso 5 — Alts de imágenes del producto (2 min)

**Dónde:** Productos → producto → en cada imagen: clic → *Texto alternativo* (icono ⋯ o lápiz según versión).

| Imagen | Alt exacto |
|---|---|
| Rosa frontal | `Cinturón térmico Aunelya rosa - vista frontal del kit` |
| Blanco frontal | `Cinturón térmico Aunelya blanco - vista frontal del kit` |
| Contenido del kit | `Qué incluye el cinturón térmico Aunelya: cinturón, cable USB, manual y caja` |
| Lifestyle casa | `Mujer leyendo en casa con cinturón térmico Aunelya rosa` |
| Lifestyle bus/movimiento | `Mujer usando cinturón térmico Aunelya portátil en el autobús` |

**Hecho bien si:** ninguna imagen del producto queda con alt vacío. (No subir ni reordenar imágenes.)

## Paso 6 — Colección `all` (1 min)

**Dónde:** Productos → **Colecciones** → colección principal (`all`/catálogo).

- Campo **Descripción**, pegar:
> *Cinturón térmico Aunelya en México: calor en 5 niveles y vibración en 4 niveles, correa ajustable y batería recargable por USB. Disponible en Rosa y Blanco. Compra segura con envíos a todo México. Accesorio de bienestar, no un producto médico.*

## Paso 7 — NAP y redes, solo texto (2 min)

**Dónde:** Editor del tema (Tienda online → Personalizar) — **solo rellenar campos de texto**, sin mover ni rediseñar nada:

1. Sección/página **Contacto**: email, teléfono, ubicación, horario (los que sean reales; lo vacío no se muestra).
2. **Footer** o ajustes del tema: URLs de Instagram/TikTok/Facebook/YouTube reales (alimentan el `sameAs` futuro y E-E-A-T).
3. No crear secciones nuevas ni cambiar colores, tipos o estructura.

## Paso 8 — Verificación

1. **Vista previa**: home (título del H1 intacto), PDP (descripción desplegable + disclaimer), FAQ publicada y enlazada en footer.
2. **Google Search Console** → *Inspección de URLs*: home, PDP, `/pages/faq` → *Solicitar indexación*.
3. **Rich Results Test** (`search.google.com/test/rich-results`) con la URL del PDP: esperar **válidos** `FAQPage`, `Product` (precio/disponibilidad) y `BreadcrumbList`.
4. **Estrellas**: NO aparecerán aún (requieren app de reseñas con metafields reales; el schema manual del tema es temporal y se retira al instalarla).

---

## Fuera de alcance manual (requiere código o app)

- `noindex` en búsqueda/carrito (app SEO o edición del tema — Fase 2 no lo incluyó; queda pendiente).
- Hreflang (solo si se abre mercado en inglés).
- Blog: crear artículos según `docs/SEO.md` §5.3 cuando haya capacidad de contenidos.
- FAQs P1-P4/P6-P7 (batería, temperaturas, medidas, envío, garantía): necesitan **datos reales del producto** — pedir al proveedor antes de publicarlas.
