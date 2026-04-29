# TODO Upgrade — gas-modelos

> Stack target: ver `Gas/CLAUDE.md` § "Stack target".

## Estado actual (post-Bloque 1, 2026-04-29)
- Solo interfaces TS, sin build, sin runtime deps.
- `engines`: Node `>=22.0.0 <23.0.0`, npm `>=10.0.0` ✓
- `repository`: `https://github.com/Horatech/gas-modelos` ✓ (alineado con remote git)

## Upgrades requeridos
- (ninguno — paquete sólo de tipos)

## Decisiones diferidas
- Tagear releases (`v1.x.x`) y que los consumidores pinneen al tag, en vez de instalar HEAD del git URL. Mejora reproducibilidad y evita que cambios rompan consumidores en silencio. Decisión transversal (afecta los 16+ consumidores).

## Verificación post-upgrade
- [ ] Consumidores corren `npm run modelos` y compilan sin errores de tipos.
