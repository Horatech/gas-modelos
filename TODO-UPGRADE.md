# TODO Upgrade — gas-modelos

> Stack target: ver `Gas/CLAUDE.md` § "Stack target".

## Estado actual (post-migración Zod v4, 2026-07-31)
- Schemas Zod v4 + tipos TS inferidos, con build (`tsc`) y `dist/` generado vía
  `prepare` en el install del consumidor.
- `engines`: Node `>=22.0.0 <23.0.0`, npm `>=10.0.0` ✓
- `repository`: `https://github.com/Horatech/gas-modelos` ✓ (alineado con remote git).
  Nota: el `README.md` viejo todavía tenía instrucciones de instalación con
  `GPE-Sistemas/gas-modelos.git` + `yarn` — corregido a `Horatech/gas-modelos` + npm en
  esta migración. `gas-insidebot` (repo consumidor) sigue apuntando al remote viejo —
  ver `CONSUMIDORES.md`, pendiente de corregir en la sesión de rollout de consumidores.
- Dependencias: `zod@^4.4.3` (runtime, publicado 2026-05-04), `typescript@^5.4.0` (dev)
  — mismas versiones que `gestion-modelos` por consistencia entre repos hermanos.

## Upgrades requeridos
- (ninguno inmediato tras la migración — el próximo hito es actualizar los ~30
  consumidores para que compilen contra los nuevos exports Zod; eso se cubre en otra
  sesión/PR, ver `CONSUMIDORES.md`)

## Decisiones diferidas
- Tagear releases (`v2.x.x`) y que los consumidores pinneen al tag, en vez de instalar
  HEAD del git URL. Mejora reproducibilidad y evita que cambios rompan consumidores en
  silencio. Decisión transversal (afecta los ~30 consumidores). **Más urgente ahora que
  antes**: con build real, un cambio incompatible en un schema puede romper el `prepare`
  del `npm install` del consumidor (no solo el chequeo de tipos como antes).
- Lint/CI gate en los repos consumidores que fuerce importar desde `'modelos'` (dist)
  en vez de `'modelos/src'` para cualquier uso runtime de un `*Schema` — la regla ya
  está documentada en `CLAUDE.md`, falta aplicarla cuando se migren los consumidores.
- Corregir el remote de `gas-insidebot` (`GPE-Sistemas/gas-modelos.git` →
  `github:Horatech/gas-modelos`) — cambio en un repo consumidor, no en este.

## Verificación post-upgrade
- [x] `npm run build` sin errores.
- [x] `npm run gen:json-schema -- --verbose` sin errores (442 ok, 0 skipped, 0 error).
- [x] `npx madge --circular --extensions js dist/interfaces` — 0 ciclos en el JS
      compilado.
- [x] Ningún nombre de tipo (`IX`) existente se eliminó (comparación antes/después).
- [ ] Consumidores corren `npm run modelos` y compilan sin errores de tipos — a validar
      en la sesión de rollout de consumidores (ver `CONSUMIDORES.md`).
