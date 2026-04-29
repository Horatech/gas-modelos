# TODO Upgrade — gas-modelos

> Stack target: ver `Gas/CLAUDE.md` § "Stack target".

## Estado actual
- Solo interfaces TS, sin build, sin runtime deps.
- `engines`: Node `>=22.0.0 <23.0.0`, npm `>=10.0.0` ✓
- `repository` apunta a `https://github.com/GPE-Sistemas/gas-modelos` — pero el canónico decidido para los consumidores es `Horatech/gas-modelos`. Verificar de dónde se tagea/empuja realmente.

## Upgrades requeridos
- [ ] Confirmar repo canónico (`Horatech` vs `GPE-Sistemas`) y unificar `repository.url` en `package.json`.
- [ ] Nada más a actualizar — paquete sólo de tipos.

## Agujeros / riesgos
- Si `repository.url` está apuntando al repo equivocado, el `npm view` y los IDEs muestran ubicación errónea.
- Cambios en interfaces siguen rompiendo consumidores en silencio (no hay versionado semver real porque se instala vía git URL al HEAD). Considerar tagear releases (`v1.x.x`) y que los consumidores pinneen al tag.

## Verificación post-upgrade
- [ ] Consumidores corren `npm run modelos` y compilan sin errores de tipos.
