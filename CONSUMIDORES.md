# Consumidores de gas-modelos

Relevado 2026-07-31 (migración a Zod v4): `"modelos"` en los `package.json` de los
repos locales de `C:\Users\Carlos\Desktop\ReposGit\gas\`. No se relevó el manifiesto de
deploy (prod/test) de `iot-cluster` para este ecosistema — a diferencia de
`gestion-modelos`, no había un manifiesto local disponible en esta sesión. Cualquier
servicio deployado que no esté en esta lista queda como pendiente de descubrir en la
sesión de rollout.

> El hook `prepare` de la git-dep corre en el `npm install`/`npm ci` de TODOS los
> consumidores; si el build de gas-modelos fallara, rompe el install de los ~29 al
> mismo tiempo, no solo de quien lo esté usando activamente. Este riesgo es más serio
> acá que en `gestion-modelos` porque este paquete ya tuvo un incidente real de
> producción (`windChillC`, ver `CLAUDE.md`).

## ⚠️ Anomalía: `gas-insidebot` apunta a un remote distinto

`gas-insidebot/package.json` referencia:
```json
"modelos": "https://github.com/GPE-Sistemas/gas-modelos.git"
```
con el script `"modelos": "yarn upgrade modelos"` (yarn, no npm), mientras los otros 28
consumidores usan `github:Horatech/gas-modelos` + npm. Es casi seguro un resabio de una
migración de organización de GitHub (`GPE-Sistemas` → `Horatech`) que quedó sin
actualizar en este repo puntual. El propio `README.md` viejo de `gas-modelos` (antes de
esta migración) todavía tenía esa instrucción vieja — probablemente de ahí se copió.

Consecuencias a resolver en la sesión de rollout de consumidores (NO en este pase):
- Si `GPE-Sistemas/gas-modelos` todavía existe y quedó desactualizado respecto a
  `Horatech/gas-modelos`, **`gas-insidebot` nunca va a recibir la migración a Zod**
  (ni ningún cambio futuro) hasta que se corrija el remote.
- Si `GPE-Sistemas/gas-modelos` ya no existe (org movida/borrada), el próximo
  `npm ci`/`yarn install` de `gas-insidebot` **falla directamente** (remote not found)
  — independiente de esta migración.
- Acción pendiente: confirmar con quien tenga acceso a GitHub si `GPE-Sistemas/gas-modelos`
  existe, y corregir `gas-insidebot/package.json` a `github:Horatech/gas-modelos` (+ npm)
  como parte del rollout de consumidores.

## Consumidores locales detectados (dependencia `modelos`)

Los 29 repos por debajo referencian `github:Horatech/gas-modelos` (sin `#ref` fijo →
resuelven a la rama default en cada `npm install`/`npm ci`; ninguno pinnea un tag o
branch específico hoy — ver "Decisiones diferidas" en `TODO-UPGRADE.md`). Estado de
verificación: **pendiente de verificar** por defecto para todos — este pase migró solo
`gas-modelos`, ningún consumidor fue tocado ni re-apuntado.

| Repo | Tipo | Estado |
|------|------|--------|
| gas-admin | Backend NestJS | Pendiente de verificar |
| gas-api-bove | Backend NestJS (dispositivo BOVE) | Pendiente de verificar |
| gas-api-cliente | Backend NestJS (API cliente / app móvil) | Pendiente de verificar |
| gas-api-euw300 | Backend NestJS (dispositivo EUW300) | Pendiente de verificar |
| gas-api-hyzim-188b | Backend NestJS (dispositivo Hyzim) | Pendiente de verificar |
| gas-api-integraciones | Backend NestJS | Pendiente de verificar |
| gas-api-ml107a | Backend NestJS (dispositivo ML107A) | Pendiente de verificar |
| gas-api-nme | Backend NestJS (medidor eléctrico NME) | Pendiente de verificar |
| gas-api-nsp-4g | Backend NestJS (dispositivo NSP4G) | Pendiente de verificar |
| gas-api-nsp-4g-horatech | Backend NestJS (variante NSP4G) | Pendiente de verificar |
| gas-api-ocr | Backend NestJS (dispositivo OCR) | Pendiente de verificar |
| gas-api-veribox | Backend NestJS (dispositivo Veribox) | Pendiente de verificar |
| gas-api-websocket | Backend NestJS (websocket) | Pendiente de verificar |
| gas-api-wrc | Backend NestJS (dispositivo WRC) | Pendiente de verificar |
| gas-api-zenner | Backend NestJS (dispositivo Zenner) | Pendiente de verificar |
| gas-auth | Backend NestJS (auth) | Pendiente de verificar |
| gas-cache-api | Backend NestJS (cache) | Pendiente de verificar |
| gas-cron | Backend NestJS (jobs programados) | Pendiente de verificar |
| gas-datos | Backend NestJS (persistencia Mongoose, único con acceso directo a MongoDB) | Pendiente de verificar |
| gas-entrada-lora | Backend NestJS (ingesta LoRaWAN) | Pendiente de verificar |
| gas-field-tester | Servicio de testing de campo | Pendiente de verificar |
| gas-firmware-ftp | Servicio FTP de firmware | Pendiente de verificar |
| gas-insidebot | Bot | Pendiente de verificar — **ver anomalía de remote arriba** |
| gas-integraciones | Backend NestJS | Pendiente de verificar |
| gas-notificaciones | Backend NestJS (notificaciones) | Pendiente de verificar |
| gas-nuc4g | Backend NestJS (dispositivo NUC4G) | Pendiente de verificar |
| gas-opcua-externo | Backend NestJS (OPC-UA externo) | Pendiente de verificar |
| gas-salida-lora | Backend NestJS (egreso LoRaWAN) | Pendiente de verificar |
| gas-sml | Backend NestJS (dispositivo SML) | Pendiente de verificar |
| gas-twilio-api | Backend NestJS (Twilio) | Pendiente de verificar |
| gas-web-admin | Frontend Angular (admin) | Pendiente de verificar |
| gas-web-cliente | Frontend Angular (cliente) | Pendiente de verificar |

No dependen de `gas-modelos`: `gas-container-vpn` (infra, sin `package.json`),
`langchain-trasnformer-api` (no es proyecto Node).

## Cambios de contrato a verificar por consumidor (migración Zod)

Ninguno detectado todavía — grep de los ~30 consumidores mostró ~1311 imports de
`modelos/src`, el 100% de tipos (cero de valores runtime hoy), así que ningún
consumidor debería romper solo por el merge de esta migración. Riesgos conocidos y
typos preexistentes que SÍ se preservaron tal cual (no se "arreglaron" para no cambiar
comportamiento silenciosamente) — revisar si algún consumidor dependía de ellos:

- `entidades/dispositivo.ts`, `entidades/correctora.ts`, `entidades/unidad-presion.ts`:
  el `Omit` de Create/Update lista `"unidadDeNegocio"` (typo) en vez de
  `"unidadNegocio"` — el campo `unidadNegocio` real NUNCA se omite en
  `ICreateX`/`IUpdateX` pese a la intención aparente. Preservado igual en
  `CreateXSchema`/`UpdateXSchema`.
- `entidades/reporte.ts`: el `Omit` de Create/Update lista `"unidadPrsion"` (typo, sin
  la "e") en vez de `"unidadPresion"` — mismo efecto, el campo nunca se omite.

## Próximos pasos (fuera de este pase)

1. Por cada consumidor deployado: `npm install modelos@git+https://github.com/Horatech/gas-modelos.git`
   (repunta a `#main` y regenera el lock), `npm run build`/`nest build` local, commit de
   `package.json`+`package-lock.json`, deploy.
2. Corregir el remote de `gas-insidebot`.
3. Decidir si algún consumidor empieza a usar validación runtime (`.safeParse()`) — en
   ese caso, importar el `*Schema` desde `'modelos'` (dist), nunca desde
   `'modelos/src'` (ver `CLAUDE.md`/`README.md`).
4. Evaluar tagging de releases (`v2.x.x`) para que los consumidores pinneen a un tag en
   vez de a la rama default — ver `TODO-UPGRADE.md`.
