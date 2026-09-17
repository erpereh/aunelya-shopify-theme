# Prompt para Codex — Rellenar alts vacíos en `index.json`

> Cómo usarlo: copia el bloque de abajo tal cual y pégaselo a Codex en el repo `aunelya-shopify-theme`, rama `main`.
> Alcance: **solo texto**. No pide nada visual, ni Admin, ni tokens.

---

## Prompt (copiar desde aquí)

```text
En el repo aunelya-shopify-theme (rama main), rellena los 6 `image_alt`
vacíos de templates/index.json. NO toques nada más que esos 6 strings.

MAPEO EXACTO (sección / bloque → texto literal):
1. aunelya_product / pink → `Cinturón térmico Aunelya rosa - vista frontal del kit`
2. aunelya_product / white → `Cinturón térmico Aunelya blanco - vista frontal del kit`
3. aunelya_lifestyle / home (En casa) → `Mujer leyendo en casa con cinturón térmico Aunelya rosa`
4. aunelya_lifestyle / movement (En movimiento) → `Mujer usando cinturón térmico Aunelya portátil en movimiento`
5. aunelya_lifestyle / routine (En tu rutina) → `Mujer con cinturón térmico Aunelya rosa en su rutina diaria`
6. aunelya_lifestyle / when_needed (Cuando lo necesitas) → `Mujer descansando con cinturón térmico Aunelya cuando lo necesita`

RESTRICCIONES:
- Solo esos 6 valores. No cambies imágenes, precios, variantes, inventario,
  ni ningún otro texto, CSS, Liquid, layout, secciones o estructura.
- No subas/borres/reordene imágenes. No hagas `theme push`.
- No inventes textos: usa los literales de arriba (llevan tilde y
  mayúsculas tal cual).

VERIFICACIÓN OBLIGATORIA:
- Ejecuta `node --test tests/aunelya-home.test.mjs` desde la raíz: debe
  quedar todo en verde. Si algún test esperaba alts vacíos, actualízalo de
  forma coherente e indícalo.

ENTREGA:
- Diff resumido (archivos y líneas), resultado de tests y confirmación
  explícita de que no cambió nada visual ni de producto.
```

---

## Referencia rápida (misma info en tabla)

| Sección / bloque (`index.json`) | `image_alt` a poner |
|---|---|
| `aunelya_product` / `pink` (línea ~73) | `Cinturón térmico Aunelya rosa - vista frontal del kit` |
| `aunelya_product` / `white` (línea ~85) | `Cinturón térmico Aunelya blanco - vista frontal del kit` |
| `aunelya_lifestyle` / `home` (línea ~110) | `Mujer leyendo en casa con cinturón térmico Aunelya rosa` |
| `aunelya_lifestyle` / `movement` (línea ~119) | `Mujer usando cinturón térmico Aunelya portátil en movimiento` |
| `aunelya_lifestyle` / `routine` (línea ~128) | `Mujer con cinturón térmico Aunelya rosa en su rutina diaria` |
| `aunelya_lifestyle` / `when_needed` (línea ~137) | `Mujer descansando con cinturón térmico Aunelya cuando lo necesita` |

Todos ≤125 caracteres, 1 keyword (`cinturón térmico Aunelya`) cada uno.

## Fuera del alcance de este prompt (no pedírselo a Codex aquí)

- Descripción de la colección `frontpage` y cambio de moneda a MXN → manual en Admin (ver `docs/FASE0-MANUAL.md` + texto adaptado ya entregado).
- NAP/redes, `noindex`, blog, FAQs con datos reales → pendientes con datos del proveedor.
- Los fallbacks `default_alt` del código (`aunelya-product-showcase.liquid:64`, `aunelya-lifestyle.liquid:47`) ya cubren el render; esto solo rellena el dato en el editor.
