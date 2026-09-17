# Estudio SEO — Aunelya Shopify Theme

> Mercado: México · Idioma: español (es-MX) · Producto: Cinturón térmico Aunelya
> Fecha: septiembre 2026 · Estado estimado: **5/10** (base técnica sana, contenidos y rich results pendientes)
> Alcance del documento: auditoría + keywords + textos listos + plan por fases. **No incluye implementación.**

---

## 0. Resumen ejecutivo

### Los 5 quick wins de mayor impacto

| # | Acción | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 1 | Corregir H1 duplicado en home (`sections/header.liquid:386-388` + `sections/aunelya-hero.liquid:18`) | Alto — Google no sabe cuál es el tema de `/` | S (<1h dev) |
| 2 | Reescribir intro PDP + H1 home con keyword "cinturón térmico" (textos listos en §4) | Alto — captar intención transaccional | S (copy, sin dev) |
| 3 | Añadir `FAQPage` JSON-LD leyendo los bloques `aunelya-faq` existentes | Alto — acordeón en SERP | M (2-3h dev) |
| 4 | Añadir `Product` + `AggregateRating 4.8` + `Review` JSON-LD manual (especificación en §6) | Alto — estrellas en SERP | M (3-4h dev) |
| 5 | Enlazar la página FAQ (hoy huérfana) en footer + rellenar NAP/redes en contacto y footer | Medio-alto — crawl + E-E-A-T | XS (Admin, 30 min) |

### Reglas de seguridad (no negociables)

- **Nunca prometer efecto curativo.** Prohibido en todo copy y schema: *alivia, elimina (el dolor), trata, cura, terapéutico, médico*.
- **Vocabulario seguro aprobado:** *sensación de confort, acompaña, esos días del ciclo, zona abdominal, rutina de descanso*.
- **Toda página con mención al ciclo** lleva el disclaimer: *"Accesorio de bienestar. No es un producto médico y no sustituye la orientación de un profesional de la salud."*

---

## 1. Auditoría técnica

### 1.1 Críticos

**C1. H1 duplicado en home.**
`sections/header.liquid:386-388` pinta `<h1 class="visually-hidden">{{ shop.name }}</h1>` en `index`, y `sections/aunelya-hero.liquid:18` pinta otro H1 (`Comodidad que se adapta a ti.`, `templates/index.json:15`). Resultado: 2× H1 en `/`. Además el hero es H1 fijo sin opción `heading_tag` (a diferencia de `aunelya-faq`): si el merchant duplica el hero hay N H1s.
*Cambio:* condicionar el H1 oculto del header o añadir `heading_tag` al hero (recomendado: hero H1 configurable, default H1 solo si es primera sección).

**C2. Sin `FAQPage` JSON-LD con 3 FAQs visibles.**
Hay Q&A en texto en `templates/product.json:342-425` (8), `templates/page.faq.json:12-95` (8) y `templates/page.contact.json:88-134` (4), renderizados con `<details><summary>` en `sections/aunelya-faq.liquid:22-35`. Cero `application/ld+json`. Pérdida directa de rich results.
*Cambio:* snippet que itere `section.blocks` (`question`/`answer` → `strip_html`) e inyecte `FAQPage` en `aunelya-faq.liquid`. Ver especificación en §6.1.

**C3. Reviews visibles sin `AggregateRating` en JSON-LD.**
`templates/product.json:429-501` (6 reseñas, promedio 4.8) + `blocks/aunelya-rating-badge.liquid:25-33` muestran `4,8 (6 valoraciones)`, pero el `Product` nativo (`{{ closest.product | structured_data }}`, `sections/product-information.liquid:3-5`) solo emite `aggregateRating` si existen los metafields de app (`product.metafields.reviews.rating/rating_count`, lógica prevista en `sections/aunelya-product-reviews.liquid:6-15`). Hoy el visible y el structured data no coinciden → sin estrellas en SERP.
*Cambio:* schema manual temporal según §6.2; migrar a app (Judge.me/Loox) cuando haya volumen y retirar el manual.

**C4. Página FAQ huérfana.**
`templates/page.faq.json` existe con H1 correcto (`heading_tag: h1`, `:93`), pero `sections/footer-group.json:23-37` solo enlaza Contacto + Buscar. `grep pages/faq` = 0 fuera de tests: Google solo la descubre por sitemap.
*Cambio (Admin, XS):* añadir `label_3/link_3 → shopify://pages/faq` en el grupo `help` del footer + enlace contextual desde PDP/contacto.

### 1.2 Medios

| # | Hallazgo | Cambio |
|---|----------|--------|
| M1 | `Organization` incorrecto/incompleto (`sections/header.liquid:328-338`): `@context` en `http` (línea 330), `url` = origen + página actual (línea 336, debe ser `shop.url`), sin `sameAs`/`contactPoint` (las redes existen como settings en `aunelya-footer.liquid:127-130` y `aunelya-contact.liquid:353-356`) | Corregir 2 líneas + inyectar `sameAs` desde settings |
| M2 | OG/Twitter incompletos (`snippets/meta-tags.liquid:36-104`): sin `og:locale` (`es_MX`), sin `og:image:alt`, sin `twitter:image`/`twitter:image:alt`, `http:` hardcodeado en línea 60 (usar `https:`) | Completar tags |
| M3 | Sin `BreadcrumbList` en todo el tema (`grep` = 0) | Añadir en PDP (Inicio / Producto / Título) |
| M4 | Sin `meta[name=robots]` ni `templates/robots.txt.liquid` (no existe): sin control sobre `?filter.`, `?sort_by`, búsqueda interna, `?variant=` | Crear `templates/robots.txt.liquid` con reglas + `noindex` a search/cart vía Admin o código |
| M5 | ~20 módulos JS globales en todas las páginas (`snippets/scripts.liquid:127-254`) + `standard-actions-override.js` en `<head>` (`:48-51`); la home carga JS de PDP (variant-picker, product-form, media-gallery…) | Split por `template.name`/`page_type`, diferir lo no crítico |
| M6 | Fuentes con `preload fetchpriority:low` (`snippets/fonts.liquid:1-12`) — retrasa LCP del H1 | `fetchpriority:high` + `display:swap` |
| M7 | `alt=""` en `templates/index.json:73,85` (variantes) y `:110,119,129,137` (lifestyle) — salvados por `default_alt` en código (`aunelya-product-showcase.liquid:64`, `aunelya-lifestyle.liquid:47`), pero frágil; `aunelya-footer.liquid:11-19` banner con `alt:''` sin setting | Rellenar alts en Admin (propuestas en §4.4) + setting alt para el banner |
| M8 | `snippets/image.liquid:15-35` (legacy) sin `loading`/`width`/`height`/`sizes` ni fallback de `alt` | Auditar uso; migrar a `aunelya-image.liquid` o borrar |
| M9 | NAP y redes vacíos (`templates/page.contact.json:60-71`, `sections/footer-group.json:61-64`) → sin SEO local ni `sameAs` | Rellenar en Admin |
| M10 | PDP/contacto/FAQ cargan `aunelya-home.css` entero (`layout/theme.liquid:30-42`) usando una sola sección | Split o aceptar (bajo impacto) |

### 1.3 Bajos

- Paginación sin `rel="prev"/"next"` (`snippets/pagination-controls.liquid:35,108,140`). `title` ya añade `Page N` (`meta-tags.liquid:109`).
- Enlaces `variant.url` enlazables (`aunelya-footer.liquid:48`, `aunelya-product-showcase.liquid:46,76`, `section-rendering-product-card.liquid:22-24`): mitigado por canonical (`meta-tags.liquid:115`), pero cambiar a `product.url` reduce crawl waste.
- Sin `hreflang`: correcto hoy (monolingüe, `header-group.json:55-58` sin localización); obligatorio si se abre `en-US`.
- `meta theme-color` vacío (`snippets/meta-tags.liquid:16-19`): rellenar o borrar.
- Contenido hardcoded en español fuera de `locales` (schemas + `templates/*.json`) y `fallback_price: MX$799` (`index.json:70,82`): frena i18n, documentar flujo Translate & Adapt.

### 1.4 Lo que ya está bien (no tocar)

- `<html lang="{{ request.locale.iso_code }}">`, `<title>` con paginación, `canonical_url` en todas las plantillas, `og:type` por template, `description` desde Admin.
- PDP con 1 H1 (`product.json:139`), FAQ con `heading_tag` configurable, contacto con H1 + H2s correctos.
- Imágenes: `aunelya-image.liquid` con responsive `srcset`/`sizes`, `eager + fetchpriority:high` en LCP (hero, contacto), fallbacks `.webp`, `width/height` anti-CLS.
- `{{ content_for_header }}` presente (canonical/SEO base de Shopify), sitemap automático (nada que hacer).

---

## 2. Keywords objetivo (es-MX)

### 2.1 Mapa keyword → página

| Keyword (intención) | Página | Uso |
|---|---|---|
| `cinturón térmico` (transaccional) | Home H1 + title, PDP title/H1/intro | Principal, siempre exacta y al inicio |
| `cinturón térmico portátil / recargable` | PDP intro + H2 tecnología | Diferencial vs competencia |
| `cinturón térmico para cólicos` (alto volumen, sensible) | Blog (art. 1 y 5) + FAQ segura + descripción larga con contexto | Solo con formulación segura + disclaimer |
| `calor para cólicos / dolor menstrual` | Blog (art. 2 y 5), nunca en metas ni claims | Informacional, sin promesa de efecto |
| `cinturón térmico opiniones / México` | Blog art. 3 + reseñas PDP | BOFU, UGC |
| `qué es un cinturón térmico` | Blog art. 4 | Informacional puro |
| `cinturón térmico rosa / blanco` | Alts + FAQ variantes (P5) | Long-tail variantes, evita duplicar PDPs |
| `envío + garantía + medidas + batería` | FAQs P1, P3, P6, P7 | Objeciones que frenan compra |

### 2.2 Reglas de uso

- Keyword principal exacta en: meta title, H1, primeras 100 palabras, 1 H2, 1 alt.
- Densidad orientativa 1-1.5% en descripción larga; repetir con variantes (`banda térmica` no — en MX se dice *cinturón*; evitar spanglish).
- Metas de home/producto **sin** *cólicos/menstrual/dolor* (no prometer efecto en SERP); esas van en blog/FAQ con contexto seguro.

---

## 3. Inventario de páginas y acciones

| Página | Estado | Acción |
|---|---|---|
| Home `/` | Indexable principal; H1 sin keyword; ~60 palabras; lifestyle sin enlaces (`link:""`) | Nuevo H1 (§4.1), +intro 60-80 palabras con keyword, enlazar lifestyle → PDP/blog |
| PDP `/products/cinturon-termico-aunelya` | Única transaccional; intro 18 palabras sin keyword; `product.description` vacía | Nueva intro (§4.2), descripción 250 palabras (§4.3), schemas §6 |
| FAQ `/pages/faq` | Duplicada 100% vs PDP + huérfana | Diferenciar (ver §5.1) + enlazar en footer |
| Contacto | Thin + NAP vacío → no indexar hasta rellenar | Rellenar NAP/redes; meta `noindex` temporal opcional |
| Colección `all` | Thin (<20 palabras si Admin vacía) + 1 producto | Descripción 150 palabras (borrador en §5.2) o `noindex` |
| Blog / artículos | Cáscara vacía (0 posts, 0 enlaces) | 5 artículos §5.3; montar `featured-blog-posts` en home/PDP |
| Search, cart, 404, password, `page.json` genérica | No indexar; 404 y `list-collections` en inglés | Traducir 404/Collections; `noindex` search/cart |
| `list-collections` | H1 `Collections` en inglés | Traducir o `noindex` |

---

## 4. Textos listos para pegar

### 4.1 Home — H1 + subtítulo (`templates/index.json:15-16`)

- **H1:** `Cinturón térmico portátil para tu rutina de confort`
- **Sub:** `Calor y vibración ajustables en un cinturón recargable, con envíos a México y compra segura.`

### 4.2 PDP — intro (`templates/product.json:185`)

> `Cinturón térmico Aunelya con calor y vibración ajustables. Diseñado para acompañarte con una sensación de confort en tu rutina y en esos días del ciclo en que buscas calor en la zona abdominal. Portátil y recargable.`
> (38 palabras, keyword 2×, sin claims.)

### 4.3 PDP — `product.description` 250 palabras (pegar en Admin > Productos > Descripción)

> El **cinturón térmico Aunelya** combina calor ajustable en 5 niveles y vibración en 4 niveles en un diseño portátil con correa ajustable, pensado para acompañarte en casa, en el trabajo o en movimiento.
>
> Su uso es sencillo: colócalo en la zona abdominal, ajusta la correa a tu medida y elige el nivel de calor y vibración que te resulte más cómodo. Incluye cable de carga USB, manual de uso y caja. Está disponible en **Rosa** y **Blanco**, con las mismas funciones y precio.
>
> Muchas personas lo integran en su rutina de descanso durante su ciclo, buscando una sensación de calor y confort. Es un accesorio de bienestar, no un producto médico, y no sustituye la orientación de un profesional de la salud. Si tienes alguna condición de salud, consulta a tu médico antes de usar calor o vibración.
>
> *Accesorio de bienestar. No es un producto médico.*

### 4.4 Alts propuestos (≤125 caracteres)

- Rosa frontal: `Cinturón térmico Aunelya rosa - vista frontal del kit`
- Blanco frontal: `Cinturón térmico Aunelya blanco - vista frontal del kit`
- Kit: `Qué incluye el cinturón térmico Aunelya: cinturón, cable USB, manual y caja`
- Lifestyle casa: `Mujer leyendo en casa con cinturón térmico Aunelya rosa`
- Lifestyle bus: `Mujer usando cinturón térmico Aunelya portátil en el autobús`
- Contacto: mantener el actual.

### 4.5 Metas (pegar en Admin)

**Home (Preferencias):**
- Title (52 car.): `Cinturón Térmico Aunelya | Calor y Confort en México`
- Description (117 car.): `Cinturón térmico Aunelya con calor y vibración ajustables. Portátil, recargable y con envíos a México. Compra segura.`

**Producto (SEO del producto):**
- Title (57 car.): `Cinturón Térmico Aunelya Rosa/Blanco | 5 Niveles de Calor`
- Description (139 car.): `Compra el cinturón térmico Aunelya: 5 niveles de calor y 4 de vibración, correa ajustable y batería recargable. Envío a México.`

**Título Admin sugerido:** `Cinturón Térmico Aunelya – Calor y Vibración Portátil | Rosa / Blanco`

---

## 5. FAQs, páginas y blog

### 5.1 FAQ — diferenciar PDP vs página + 8 preguntas nuevas

Hoy PDP y `/pages/faq` comparten las 8 preguntas (canibalización). Propuesta:
- **PDP:** conservar 6 transaccionales (uso, calor, vibración, carga, movimiento, envíos) + añadir P3 (medidas) y P4 (lavado).
- **`/pages/faq`:** las 8 actuales + P1, P2, P6, P7, P8 (postventa y seguridad).

**P1.** `¿Cuánto dura la batería del cinturón térmico Aunelya y cuánto tarda en cargar?` *(responder con datos reales del manual; si no se conocen, publicar sin tiempos)*
**P2.** `¿Qué temperatura alcanza cada nivel de calor? ¿Quema o mancha la ropa?` *(responder con rangos del manual + empezar siempre en nivel bajo)*
**P3.** `¿Qué talla es? ¿La correa ajustable sirve para todas las medidas?` *(rango de cm reales)*
**P4.** `¿Se puede lavar? ¿Cómo se limpia?` *(instrucciones reales de la etiqueta/manual)*
**P5.** `¿Cuál es la diferencia entre el Rosa y el Blanco?` *R: Ninguna en funciones ni precio; solo el color. Elige el que vaya contigo.*
**P6.** `¿Cuánto tarda el envío a CDMX, Guadalajara o Monterrey y cuánto cuesta?` *(rangos reales + enlace a política de envíos)*
**P7.** `¿Tiene garantía? ¿Qué cubre y cómo la pido?` *(condiciones reales)*
**P8 (segura).** `¿Para qué momentos del ciclo lo usan otras personas?` *R: Muchas personas lo usan como parte de su rutina de descanso durante su ciclo, buscando una sensación de calor y confort en casa o en movimiento. Es un accesorio de bienestar, no un producto médico y no sustituye la orientación de un profesional de la salud.*

Formato: respuestas de 40-60 palabras en `<p>`, con `cinturón térmico Aunelya` en 3-4 de ellas.

### 5.2 Colección `all` — descripción 150 palabras (borrador, adaptar a Admin)

> *Cinturón térmico Aunelya en México: calor en 5 niveles y vibración en 4 niveles, correa ajustable y batería recargable por USB. Disponible en Rosa y Blanco. Compra segura con envíos a todo México. Accesorio de bienestar, no un producto médico.*

### 5.3 Blog — 5 artículos (900-1200 palabras, 1 H1, 3-5 H2 en pregunta, 2-3 enlaces al PDP + 1 a FAQ)

1. `cinturón térmico para cólicos, cómo se usa` → H1: `Cómo usar un cinturón térmico en esos días del ciclo: guía paso a paso` (BOFU, tutorial + CTA).
2. `calor para cólicos menstrual` → H1: `Calor y descanso durante tu ciclo: rutina de 20 minutos en casa` (MOFU, sin claims).
3. `cinturón térmico opiniones México` → H1: `Cinturón térmico Aunelya: opiniones, colores y qué incluye el kit` (BOFU, UGC + comparativa Rosa/Blanco).
4. `qué es un cinturón térmico portátil` → H1: `Qué es un cinturón térmico portátil y en qué fijarte antes de comprar (niveles, batería, correa)` (informacional).
5. `remedios caseros cólicos / sin pastillas` → H1: `5 rutinas de confort en casa durante tu ciclo (descanso, calor, hidratación)` (evergreen, enlaza PDP + FAQ).

---

## 6. Especificaciones de structured data (para implementar)

### 6.1 `FAQPage` desde bloques `aunelya-faq`

Nuevo snippet (ej. `snippets/aunelya-faq-schema.liquid`) que reciba `blocks` y emita:

```liquid
{% liquid
  assign faq_items = ''
  for block in blocks
    if block.type == 'question' and block.settings.question != blank and block.settings.answer != blank
      assign q = block.settings.question | strip_html | strip | json
      assign a = block.settings.answer | strip_html | strip | json
      assign item = '{"@type":"Question","name":' | append: q | append: ',"acceptedAnswer":{"@type":"Answer","text":' | append: a | append: '}}'
      if faq_items == ''
        assign faq_items = item
      else
        assign faq_items = faq_items | append: ',' | append: item
      endif
    endif
  endfor
%}
{% if faq_items != blank %}
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{{ faq_items }}]}
</script>
{% endif %}
```

Renderizar con `{% render 'aunelya-faq-schema', blocks: section.blocks %}` al final de `sections/aunelya-faq.liquid`. Notas: solo preguntas con respuesta no vacía; `strip_html` porque `answer` es richtext; validar en Rich Results Test por template (PDP, FAQ, contacto).

### 6.2 `Product` + `AggregateRating` + `Review` manual (temporal)

**Condición de uso:** solo mientras NO exista app de reseñas (los metafields vacíos lo garantizan). Al instalar Judge.me/Loox, **retirar este bloque** para no duplicar el `aggregateRating` nativo.

Crear `snippets/aunelya-reviews-schema.liquid` que lea los bloques `review` de la sección y emita `aggregateRating` calculado + hasta 6 `Review` con fechas en ISO (mapear `15 SEP 2026` → `2026-09-15` con tabla de meses en Liquid). Campos por review: `author.name`, `datePublished`, `reviewRating { ratingValue, bestRating: 5 }`, `reviewBody` (`strip_html`, máx. ~500 caracteres).

**Riesgos conocidos (asumidos):** 2 autores `Anónimo` y nickname (`lau_94x`, `ferchii_22`) pueden parecer spam a Google; las fechas 17-20 SEP 2026 son futuras a hoy; r5 (`Buen producto`, 2 palabras) es thin. Mitigación: al migrar a la app, pedir nombre/título reales y republicar. No marcar con schema la sección `aunelya-reviews` de home (desactivada).

### 6.3 Correcciones menores de schema

- `Organization` (`sections/header.liquid:328-338`): `@context` → `https://schema.org`; `url` → `shop.url`; añadir `sameAs` desde los settings de redes cuando se rellenen.
- `BreadcrumbList` en PDP: `Inicio (routes.root_url)` → `Producto` → título del producto.
- OG/Twitter (`snippets/meta-tags.liquid`): añadir `og:locale es_MX`, `og:image:alt`, `twitter:image` + `twitter:image:alt`; `og:image` siempre `https:`.

---

## 7. Roadmap

### Fase 0 — Admin, sin dev (4-6h)
1. Pegar metas §4.5 (home + producto) y título Admin.
2. Pegar descripción 250 palabras §4.3 + disclaimer.
3. Rellenar alts §4.4, NAP/redes (contacto + footer), descripción colección §5.2.
4. Enlazar FAQ en footer; traducir 404 y `Collections`; `noindex` a search/cart (Admin o app SEO).

### Fase 1 — Código crítico (6-10h dev)
1. H1 home (C1). 2. `FAQPage` §6.1. 3. Reviews schema §6.2. 4. `Organization` + OG/Twitter + `BreadcrumbList`. 5. `robots.txt.liquid` + `product.url`.

### Fase 2 — Rendimiento (4-8h dev)
Split JS por template, fuentes `fetchpriority:high`, auditar `image.liquid` legacy, medir LCP/INP/CLS en PageSpeed + Shopify Web Performance.

### Fase 3 — Contenidos (continuo)
Diferenciar FAQs §5.1 → publicar artículos §5.3 (1/semana) → montar `featured-blog-posts` en home/PDP con enlaces internos → migrar reseñas a app y retirar schema manual.

### Verificación
- Search Console: cobertura, `Page indexing`, inspección de PDP/home/FAQ.
- Rich Results Test: `FAQPage`, `Product` (precio, disponibilidad, reseñas), `Article`, `Organization`, `BreadcrumbList`.
- Tras cada cambio de copy: `site:aunelya.mx` + operador de keyword a las 2-4 semanas.

---

*Documento vivo: actualizar al instalar la app de reseñas (retirar §6.2), al abrir blog y al expandir mercados (hreflang).*
