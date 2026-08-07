# gas-modelos

Repositorio de modelos TypeScript compartidos para el sistema INSIDEht.

## Descripción

Este paquete contiene las interfaces TypeScript que definen el modelo de datos centralizado del sistema. Se importa como paquete NPM en todos los componentes del sistema (backend y frontend).

## Estructura

```
src/
├── interfaces/
│   ├── entidades/
│   │   ├── config-dispositivo.ts      # Configuración de dispositivos (NUC, NSP, Veribox, SCADA)
│   │   ├── dispositivo.ts             # Entidad principal de dispositivo
│   │   ├── mensajes-nuc/
│   │   │   └── mensajes-nuc.ts        # Mensajes de comunicación con NUC (SET/GET)
│   │   └── ...
│   └── ...
```

## Uso

Este paquete es un repositorio de **solo interfaces TypeScript**. No tiene proceso de compilación ni build.

Los proyectos que lo consumen lo importan directamente:
- `gas-nuc4g` (Backend NestJS)
- `gas-datos` (Backend NestJS)
- `gas-web-cliente` (Frontend Angular)
- `gas-web-admin` (Frontend Angular)

## Importante para Claude Code

Este paquete **tiene build**: los schemas Zod son la fuente de verdad y los tipos TS se
infieren (`z.infer`). `dist/` no se versiona (`.gitignore`); se genera con
`npm run build` (`tsc`) — el hook `prepare` lo corre automático cuando un consumidor hace
`npm install`/`npm ci` sobre esta git-dependency.

### De "solo tipos" a schemas Zod (jul 2026)

Hasta jul 2026 este paquete era interfaces TS puras sin build ni runtime deps, y la
regla de oro era "nunca exportar un valor runtime" — ver el incidente de `windChillC`
más abajo. Esa regla **ya no aplica tal cual**: ahora el paquete SÍ compila a JS real y
SÍ tiene una dependencia runtime (`zod`), y exportar valores (`XSchema`, arrays como
`TIPOS_DISPOSITIVOS`) es intencional y seguro — `dist/index.js` existe y es resoluble
por `require`/`import` en los consumidores (verificado: `require('./dist/index.js')`
expone 445 exports reales sin `MODULE_NOT_FOUND`).

⚠️ **Regla más estricta que en el repo hermano `gestion-modelos`**: cualquier uso
runtime de un `*Schema` (`.parse()`, `.safeParse()`, `.shape`, `.options`,
`createZodDto(...)`) en un backend NestJS debe importarse desde el entrypoint
compilado **`'modelos'`** (dist), **nunca desde `'modelos/src'`**. `modelos/src` queda
reservado para imports que son y seguirán siendo solo-tipo. Motivo: este paquete ya
tuvo el incidente real de `windChillC` con exactamente ese patrón, y la infraestructura
de build de los ~30 consumidores de `gas` es esencialmente idéntica a la de
`gestion-modelos` (mismo `nest build`, mismo `tsconfig`) — no hay motivo para asumir que
acá `modelos/src` se comporte mejor para valores runtime.

Lo que sigue siendo delicado, y cambia de forma:

- **Imports de barrel (`from "."`, `from "../entidades"`, `from "../gas"`, etc.) que
  solo necesitan un tipo deben ser `import type`.** Antes esto era irrelevante porque TS
  borraba todo; ahora un import de valor sin `type` hacia un barrel fuerza la
  evaluación de TODO ese barrel en runtime, incluidos los archivos del SCC de
  `IDispositivo` (ver abajo), lo que puede generar `require` circulares reales. Todos
  los imports de barrel se reemplazaron por imports directos al archivo específico
  durante la migración de jul 2026 — mantener esa disciplina en cambios nuevos.
- **El cluster de `IDispositivo`** — `dispositivo.ts`, `registro.ts`,
  `punto-medicion.ts`, `dispositivo-externo-nuc.ts`, `correctora.ts`,
  `cuenta-cliente.ts`, `reporte.ts`, `medidor-residencial.ts`,
  `medidor-residencial-agua.ts`, `medidor-electrico.ts`, `registro-medidor-electrico.ts`,
  `unidad-presion.ts`, `valores-reporte/valoresReporte.ts`,
  `valores-reporte/reporte-inputs-nuc.ts`, `alerta.ts`, `scada.ts`,
  `config-dispositivo.ts`, `tenant/cliente.model.ts`, `tenant/cliente.dto.ts` (19
  archivos) — NO usan el schema real del otro lado cuando se referencian ENTRE SÍ:
  usan una interface hand-written en paralelo al schema (`IX`, mismo shape que
  `XSchema`, sin `z.infer` para no arrastrar el ciclo al declaration emit) y, en el
  campo populate, `z.custom<IOtraEntidad>().optional()` (solo type-level, sin
  validación runtime de ese campo). Si el populate apunta a algo FUERA del cluster (ej.
  `ICliente` si no formara parte, `IUnidadNegocio`, `ILocalidad`, `IGrupo`, `ICuenca`),
  usa el schema real. Antes de agregar un campo populate nuevo a cualquiera de estos 19
  archivos, confirmar con `npx madge --circular --extensions ts src/interfaces` (o,
  mejor, contra `dist/` compilado: `npx madge --circular --extensions js dist/interfaces`
  — el único chequeo 100% confiable, porque madge no distingue `import type` de imports
  reales y sobre el `.ts` fuente reporta falsos positivos) si el destino cierra un
  ciclo real; si lo hace, seguir el patrón `z.custom`, si no, usar el schema real.
- Al agregar/tocar un schema: mantener el nombre del tipo (`IX`) igual al de siempre vía
  `z.infer<typeof XSchema>`, no castear tipos a mano.
- `npm run build && npm run gen:json-schema` deben pasar sin error antes de mergear.
  `npm run gen:json-schema -- --verbose` avisa si algún schema nuevo no serializa
  (agregarlo a `SKIP_SCHEMAS` en `scripts/gen-json-schema.mjs` documentando el motivo,
  no ignorar el error).
- Convenciones Zod v4: `z.object`/`z.union`/`z.enum` (API canónica; no hay
  `z.discriminatedUnion` en este repo, las uniones son heterogéneas sin discriminante
  limpio). NO usar `z.nativeEnum` ni `.passthrough()/.strict()/.strip()` deprecados.
  Modo `strip` por defecto (interop Mongoose). Ids/fechas como `z.string()` plano.
- `TIPOS_DISPOSITIVOS` (`auxiliares/tipoDispositivo.ts`) ahora es
  `TipoDispositivoGasSchema.options` — fuente única de verdad, ya sin la restricción
  histórica de "no puede tener consumidores".
- Tipos genéricos (`auxiliares/exactly.ts`, `listado.ts`, `queryParams.ts`,
  `responses.ts`) quedan como interfaces TS puras, sin schema asociado — no forzar un
  `z.object` genérico para "cualquier T".

Verificación previa a un PR (todas deben pasar):

```bash
npm run build
node -e "const m = require('./dist/index.js'); if (!Object.keys(m).length) throw new Error('barrel vacío')"
npm run gen:json-schema -- --verbose
npx madge --circular --extensions js dist/interfaces   # 0 esperado
```

## Dispositivos soportados

### NUC4G (Network Unit Concentrator 4G)
- Versión original: NUC-04-R35
- Versión v2.0: NUC-2 con soporte GPIO (2 entradas digitales + 1 salida digital)

**Interfaces relevantes:**
- `IConfigDispositivoNUC4G` - Configuración del dispositivo
- `ISetConfiguracionV2` - Mensaje de configuración desde servidor
- `IGetConfiguracionV2` - Solicitud de configuración desde NUC
- `ISetReporteV3` - Reporte de registros
- `ISetReporteGpio` - Reporte de estados GPIO
- `ISetAlertaGpio` - Alerta de entrada digital

### NSP4G
Dispositivo de telemetría con soporte de 3 números de teléfono para alertas SMS.

### Veribox
Dispositivo de medición con configuración de APN y teléfono.

### SCADA
Tags de telemetría con límites configurables.

### NME (Medidor Eléctrico)
Medidor inteligente de energía sobre ESP32-S3 que lee un medidor HEXING HXE34K-S por
RS-485 y reporta por LoRaWAN (AU915, Clase C, OTAA con **JoinEUI = DevEUI**). Pertenece
a la división `"Medidores Eléctricos"`. Protocolo y formato de uplinks en
`/INTEGRACION_LORAWAN_NUBE.md` (raíz del sistema). Energías en Wh/varh **acumuladas**
(little-endian, epoch UTC); el backend calcula los deltas.

**Interfaces relevantes:**
- `IMedidorElectrico` (`medidor-electrico.ts`) - Entidad del medidor
- `IRegistroMedidorElectrico` (`registro-medidor-electrico.ts`) - Registro horario (serie
  temporal; colección propia, upsert por `deveui` + `timestamp`)
- `IDispositivoNme` (`configs-dispositivo/dispositivoNme.ts`) - Config del dispositivo
- `tipoDispositivo = "NME"` en `TipoDispositivoGas`

## Divisiones y modelo Punto de Medición

El catálogo de divisiones es el type `Division` en
`src/interfaces/tenant/usuario/permiso.ts`. Cada permiso de usuario pertenece a una
división y el filtrado por división se aplica en `gas-api-cliente`.

Patrón de cada división: un **dispositivo** (`IDispositivo`, distinguido por
`tipoDispositivo`) se vincula por `deveui` a una **entidad medidor** (p. ej.
`IMedidorResidencial`, `IMedidorElectrico`), que a su vez se asocia a un
`IPuntoMedicion` mediante un campo `idMedidor*` + `fechaAsignacionMedidor*`, y el punto
lleva el campo `division`. Para sumar una división nueva se replica esta cadena
(ver división "Residencial" como espejo).

## Convenciones

### Tipos de Entrada Digital (NUC v2.0)
```typescript
export type TipoEntradaDigital = "CONTADOR" | "FLAG" | "ALERTA" | "EN_DESUSO";
```

- **CONTADOR**: Cuenta pulsos (entero 32-bit)
- **FLAG**: Booleano que se activa con un pulso
- **ALERTA**: Genera alerta inmediata por 4G + SMS
- **EN_DESUSO**: Entrada deshabilitada

### Formatos de Teléfono
- Formato internacional: `+54XXXXXXXXXXX` (13 caracteres)
- Se valida en frontend con regex: `/^\+54\d{10}$/`
- En firmware: `SIZE_TEL_STANDARD = 13`

## Cambios recientes

### 2026-08-06 - `tsCorrido` en el registro de correctora

`IRegistro` suma `tsCorrido?: boolean`: el `timestamp` de ese registro está corrido +1 h
respecto de la etiqueta que reportó el equipo. Sólo lo llevan los registros de correctoras
**American Meter**, que etiquetan la lectura horaria con el **inicio** de la hora mientras
el resto de los modelos la etiqueta con el **cierre** — y como el día gas corre de 7:00 a
6:00 ARG, sin corregir cada hora caía en el día gas equivocado. Plan completo en
`/PLAN-CORRIMIENTO-AMERICAN-METER.md` (raíz del sistema).

**No es un campo informativo: es el discriminante de convención.** Un registro sin la marca
está en la convención vieja. Eso es lo que permite que `/externo` de gas-api-cliente
devuelva la etiqueta original en los datos anteriores a la fecha de implementación —y que la
regla siga siendo correcta durante la ventana mixta entre el deploy y el backfill del
histórico, cuando la colección tiene documentos de las dos convenciones. También hace el
backfill idempotente y resumible.

⚠️ Necesita su `@Prop()` en `gas-datos/src/entidades/registros/registro.model.ts`. El
schema es estricto y sin el `@Prop()` Mongoose descarta el valor **en silencio**: le pasa
hoy a `horaTruncada`, que está en esta interfaz, lo setea gas-nuc4g y no tiene `@Prop()` —
en PROD hay 0 documentos con ese campo.

### 2026-08-06 - Grados-día proyectados desde el pronóstico

`IResumenOperativoNivel.pronosticoGradosDia` (nuevo `IPuntoGradosDiaPronostico`): los
próximos ~8 días de grados-día, para extender la curva.

**Va aparte de `serie` y NO entra en `gradosDiaAcumulado` ni en `desvioClimaticoPct`**: un
desvío que mezcla medición con pronóstico deja de ser una medición, y es el número con el
que se decide.

**Se calcula por Localidad y se agrega ponderado**, igual que la serie real. Hacerlo sobre
la temperatura ya promediada del nivel —que es lo que haría el frontend con `pronostico`—
subestima entre **9% y 24%** (medido sobre 29 días de una UN: −9,1% desde la media, −23,6%
desde `(Tmax+Tmin)/2`). Mismo Jensen que gobierna el resto del diseño.

`integracionHoraria` distingue los dos tramos: el pronóstico horario cubre ~48 h y permite
el método exacto; de ahí en adelante sólo hay máxima y mínima, y `(Tmax+Tmin)/2` subestima
−2,5% (medido sobre 790 pares Localidad-día). A partir del día 3 ese sesgo queda tapado por
la incertidumbre del pronóstico en sí, pero los dos tramos no se midieron igual y eso se dice.


### 2026-08-06 - Cinco tipos de alerta para las alarmas del SML/WRC

`TipoAlertaSchema` suma `"Flujo inverso"`, `"Falla de medición"`, `"Medidor detenido"`,
`"Fuga"` y `"Sobrecaudal"`. Son alarmas que el firmware **ya reporta en cada uplink** y que
`gas-api-wrc` **ya decodifica** (`/82/0`, 25 keys) y gas-sml **ya persiste** en cada reporte
horario — pero que no tenían ningún tipo de alerta donde expresarse, así que nadie las lee.
Análisis completo en `/ANALISIS-ALARMAS-SML-WRC.md` (raíz del sistema).

Medido en PROD sobre 3.052 equipos: 254 con `metering fault`, 321 con `meter_stop_alarm`,
236 con `leakage_alarm`, 90 con `reverse_flow_alarm`, 9 con `over_flow_alarm`. Ninguno
generó una sola alerta.

⚠️ **`metering_error_status` es un bitfield, no un enum** (`/80/0` key 6: bit 1 = metering
data error, bit 4 = metering fault). Se lee `(err & 16) !== 0`. En PROD hoy sólo toma los
valores 0 y 16, pero compararlo con `=== 16` se rompe el día que el firmware prenda bit 1.

⚠️ **`meter_stop_alarm` y `leakage_alarm` no son alertables tal cual.** Su criterio lo fija
la configuración del propio equipo (`/82/0` key 14 caudal mínimo de fuga, key 15 duración de
fuga, key 16 duración de consumo cero), así que el mismo flag no significa lo mismo en dos
equipos con distinta config. Verificado en PROD: `SML-4G-2601270290` tiene
`meter_stop_alarm=1` con consumo 0 y acumulado 0,08 m³ — es una casa deshabitada, no una
falla. Hay que relevar los umbrales del parque antes de conectarlas.

**El enum es único para todo el sistema y tiene tres listas divergentes** (hallazgo A7 de
`/ANALISIS-RECLAMO-SML-CAMUZZI.md`): el modelo Mongoose de puntos en gas-datos, el filtro del
listado en gas-web-cliente y el catálogo de export en gas-datos. Un tipo nuevo que no se dé
de alta en las tres queda invisible en los filtros.

No se tocó `TipoAlertaEnvioSchema` (`envio-sms.ts`): son las categorías que disparan canal
externo (SMS/push), no tiene ninguna categoría residencial, y qué alertas ameritan
notificación externa es una decisión de producto que todavía no se tomó.

### 2026-08-06 - Grados-día de relleno desde OpenWeatherMap

ERA5-Land publica con ~5 días de atraso, así que el último tramo del rango —el que se mira
para saber cómo viene el invierno— queda vacío. Desde el **27-jul-2026** la serie horaria de
OWM cubre las **24 h** de cada Localidad (antes eran 1 a 4 muestras por día), así que permite
el mismo cálculo por integración horaria, y con resolución por Localidad en vez de por celda
de 9 km.

`ResumenDiarioLocalidad` suma `gradosDiaOwm` (record por base, igual que el de ERA5) y
`PuntoSerieResumen` suma `gradosDiaProvisorio`. **Campo aparte, no reemplazo**: cuando llega
ERA5 gana solo, sin borrar nada.

**No cuesta requests**: el dato ya está en `registroclimas`. Se calcula en el `$group` por
hora que el rollup ya ejecuta.

⚠️ **Las dos series no son intercambiables.** Medido sobre 158 pares Localidad-día con ambas
completas: OWM corre **+0,48 °C de media** (mediana +0,25, p90 +1,90; 31% por encima de 1 °C)
más cálido que ERA5 — en base 18, ~0,3-0,5 grados-día por día. Como la normal sale de ERA5,
ese sesgo entra directo en el desvío. De ahí la bandera: lo que el lector necesita saber es
que **ese punto se va a mover**.

Mismo gate de calidad que ERA5: sólo con **≥ 20 horas** del día.


### 2026-08-05 - Banda p10-p90 del día y desvío por hijo

Lo que le faltaba al DTO para que la vista Resumen pueda dibujar los grados-día.

`ResumenDiarioLocalidadSchema` suma `gradosDiaNormalP10` y `gradosDiaNormalP90` (records
por base, igual que `gradosDiaNormal`, que es la mediana). `PuntoSerieResumenSchema` suma
los dos escalares equivalentes.

⚠️ **Los percentiles no son aditivos.** Sumar los p10 diarios NO da el p10 del acumulado:
los desvíos diarios se cancelan a lo largo de la temporada, así que la suma da una banda
mucho más ancha que la real y nada cae nunca afuera. La banda del acumulado se percentila
sobre acumulados de temporada — y eso necesita antes una definición de temporada, que es
un pendiente por cliente. Por eso estos campos son **sólo del día** y no hay acumulados
p10/p90 en el nivel.

`ResumenOperativoNivelSchema` suma `cantidadLocalidadesTotal` y
`cantidadLocalidadesConGeografia`: sin centroide no hay celda ERA5-Land y por lo tanto no
hay grados-día, y eso hay que poder decirlo. Son 175 Localidades de Naturgy BAN y todas
las de Metrogas, Ecogas y Naturgy NOA; mostrarlas como `0%` sería mentir sobre miles de
puntos. "Sin geografía cargada" pide una acción, "sin dato climático todavía" se resuelve
solo.

Nuevo `IResumenDesvioHijo` (`GET /resumen/desvio-hijos/:nivel` en gas-api-cliente),
separado de `IResumenClimaHijo` a propósito: depende del rango de fechas (la tarjeta
climática no, y se cachea por nivel+padre) y sale del rollup diario (la tarjeta sale de
`registroclimas`).

### 2026-08-05 - Grados-día en el rollup diario y en el DTO de resumen

Cierra el puente entre el histórico ERA5-Land —que vive en el PostgreSQL propio de
`gas-api-clima`— y las vistas, que leen Mongo. Los grados-día se **copian** al rollup en
vez de leerse al vuelo, para que el camino de servicio siga siendo una sola consulta.

`ResumenDiarioLocalidadSchema` suma `gradosDia`, `gradosDiaEfectivos` y `gradosDiaNormal`
(los tres como `z.record(z.string(), z.number())`, indexados por temperatura base),
`temperaturaEfectiva`, `heladaConsecutivos`, `climaConsolidado` y `claveGridEra5`.

**Se guarda el VECTOR de bases, no un escalar.** La base de grados-día todavía no está
decidida: se calibra con consenso de cada tenant (`PLAN-GRADOS-DIA.md` §F5-bis), porque un
ajuste puramente estadístico confundiría un shock tarifario con un cambio de comportamiento
térmico. Con el vector guardado, cambiar la base es una decisión de **lectura** y no obliga
a recalcular el rollup de las 395 Localidades.

⚠️ **`gradosDia` NO se deriva de `temperaturaMedia` del mismo documento.** Esa temperatura
viene de OpenWeatherMap y en PROD tiene ~1 muestra por día en la mayoría de las filas; los
grados-día salen de ERA5-Land, con las 24 horas y por integración horaria. Son dos series
distintas conviviendo en la misma fila.

`PuntoSerieResumenSchema` suma `gradosDia` y `gradosDiaNormal` como **escalares** ya
resueltos a la base vigente: el frontend dibuja una serie, no quince.
`ResumenOperativoNivelSchema` suma `baseHdd`, `gradosDiaAcumulado`,
`gradosDiaNormalAcumulado` y `desvioClimaticoPct`. `baseHdd` viaja explícita porque el
número no se interpreta sin ella — 600 grados-día base 18 y 600 base 22 describen inviernos
muy distintos.

Se dejó afuera `baseHddAplicada` a nivel de fila del rollup: su productor es el mecanismo de
calibración, que todavía no existe.


### 2026-08-04 - Ícono/color por estado configurable por cliente

`IConfigCliente.iconosEstado?: Partial<Record<IEstado, IconoEstado>>` — el cliente puede
reasignar qué ícono del catálogo fijo usa cada estado de punto de medición. El ícono trae
el color horneado (los assets son círculo de color + glifo blanco), así que elegir ícono
elige color. Caso de uso: Camuzzi invierte `Alerta` ↔ `Sin Reportar`.
Plan completo en `/PLAN-COLORES-ESTADO-POR-CLIENTE.md` (raíz del sistema).

`IconoEstadoSchema` es un `z.enum` de 9 slugs, uno por asset existente en los frontends.
Acá van **sólo los slugs**: el catálogo con asset + hex + variantes de card es un valor
que sólo consumen los frontends Angular y vive duplicado en gas-web-cliente y
gas-web-admin.

**`EstadoCorrectoraSchema` / `IEstado` se movieron de `entidades/correctora.ts` a
`entidades/estado.ts`** (archivo hoja, sólo depende de zod). Motivo: `cliente.model.ts`
necesita el schema como VALOR para el `z.partialRecord`, y tomarlo de `correctora.ts`
cerraba un ciclo runtime real — `correctora → localidad.ts → ClienteSchema → correctora`
(`localidad.ts` importa `ClienteSchema` como valor). `correctora.ts` **no** lo re-exporta:
el barrel de `entidades` exporta `./estado` y un `export *` duplicado haría ambigua la
exportación. Los 6 archivos que lo importaban (`correctora`, `punto-medicion`, `scada`,
`unidad-presion`, `medidor-residencial`, `medidor-residencial-agua`, `medidor-electrico`)
apuntan a `./estado`. Para los consumidores no cambia nada: importan de `'modelos'` y el
barrel sigue exportando `IEstado` una sola vez.

### 2026-08-03 - Registro NME: las 18 métricas del protocolo declaradas

`IRegistroMedidorElectrico` suma los 26 campos de las tarifas 1 y 2 (energías T1/T2 con
acumulado + delta + kilo, y las dos demandas de T2). Con eso están las **18 métricas** que
define el protocolo: 6 bases × 3 tarifas, `bit = base + 8×tarifa`, fPort `110 + bit`.

**Declarados a propósito sin productor.** Ningún firmware las reporta todavía
(`INTEGRACION_LORAWAN_NUBE_NME.md` §4: "Definido, sin soporte aún" para los bits 8-11 y
toda la tarifa 2). Se declaran igual porque **este es el paso caro** del cambio futuro:
este repo es dependencia de todos los servicios, así que un campo nuevo son un PR acá, un
bump en cada consumidor y un `@Prop()` en el schema de gas-datos — que es **estricto**, y
sin el `@Prop()` Mongoose descarta el valor en silencio. Mapear el fPort en cada servicio,
en cambio, es una línea. El día que el firmware las mande, no hay que tocar modelos.

No cuesta nada: un campo opcional ausente no ocupa lugar en el documento ni pide
migración. El `implements Exactly<IRegistroMedidorElectrico, ...>` del schema de gas-datos
fuerza que los dos lados queden alineados.

El medidor de banco ya lista dos de éstas — reporta `disponible_mask = 7199`, con los bits
10 y 11 (`3.8.0.1` y `4.8.0.1`) encendidos: el dato existe en el medidor, falta que el
firmware lo pueda reportar.

### 2026-08-03 - Serie climática histórica por celda (grados-día) — Modelos A

Primer PR de `PLAN-GRADOS-DIA.md`. Sólo la superficie que **cruza el borde de la API**;
el esquema del store histórico vive en las migraciones de `gas-api-clima`.

- Nuevo `clima-historico.ts`: `IGridEra5` (celda de la grilla ERA5-Land 0,1° ≈ 9 km a la
  que cae una Localidad) e `IClimaDiarioCelda` (DTO de lectura del día histórico:
  agregados, vector de grados-día, temperatura efectiva, helada consecutiva).
- `ILocalidad`: nuevo `gridEra5?: IGridEra5`. Lo escribe `gas-api-clima` al resolver la
  celda. Deriva de `ubicacion`: **Localidad sin centroide = sin celda = sin histórico**,
  hasta que cargue su geografía.
- `FuenteClima`: nuevo `"ERA5-Land"`.

**Por qué el histórico NO es una colección de Mongo.** Vive en un **PostgreSQL propio de
`gas-api-clima`**, fuera de `gas-datos`. El motivo no es performance: **el dataset no
tiene tenant** — es geodato público de referencia (reanálisis del Copernicus CDS), sin
`idCliente`, sin permisos, sin ciclo de vida ligado a un cliente. La regla "todo acceso a
DB pasa por gas-datos" gobierna datos de tenant. Es además lo que le da a `gas-api-clima`
el módulo de **lectura** que le faltaba para ser de verdad la "API única de clima".

**Se indexa por CELDA, no por Localidad**, y por eso el store crece sublinealmente: varias
Localidades comparten celda y la serie se guarda una sola vez. Medido en PROD: las 395
Localidades con centroide dan **353 celdas únicas** (10,6% de dedup).

**`esFallback` no es un detalle interno.** ERA5-Land es *sólo tierra*: 11 de esas 353
celdas (3,1%) caen en mar — Mar del Plata, Comodoro Rivadavia, Ushuaia, Necochea y otras
— y se resuelven con la celda contigua (6,4 a 11,1 km). Quien lee ese dato tiene que poder
saber que viene de un punto desplazado.

**`gradosDia` es un vector por base, no un escalar.** 18,3 °C es sólo la conversión de los
65 °F del default estadounidense; IRAM 11603 usa 18/20/22 y la base óptima real varía por
segmento. Guardar el vector permite recalibrar sin releer el histórico. Se calculan por
**integración horaria**, no por `(Tmax+Tmin)/2`, que subestima cuando la temperatura cruza
la base durante el día. Y **no se promedian entre Localidades**: `max(0, base − T)` es
convexa, así que por Jensen el HDD de una temperatura promediada queda sistemáticamente
por debajo del promedio de los HDD.

Lo que **no** entra en este PR, por no tener productor todavía: los campos de HDD en
`IResumenDiarioLocalidad`, la extensión de `IResumenOperativoNivel` y el DTO de la normal
climática. Van en Modelos B, cuando exista el código que los escribe.
También se descartó agregar `"HISTORICO"` a `TipoDatoClima`: la serie histórica no se
persiste en `registroclimas`, así que sería un valor sin productor.

### 2026-07-31 - Migración a schemas Zod v4

- Todas las interfaces pasaron a `XSchema` (Zod) + `IX = z.infer<typeof XSchema>`,
  mismo patrón que `gestion-modelos`. `package.json` agrega `zod`, `main`/`types`
  apuntan a `dist/`, hook `prepare` compila en el install del consumidor.
  `scripts/gen-json-schema.mjs` genera JSON Schema/OpenAPI desde los schemas.
- Ningún nombre de tipo (`IX`) existente se eliminó (verificado antes/después).
  Consumidores actuales (100% imports de tipos, 0 de valores, relevado antes de
  mergear) no se rompen por el merge en sí — el trabajo de actualizar los ~30
  consumidores para usar los schemas queda para otra sesión (ver `CONSUMIDORES.md`).
- Todos los imports de barrel (`from "."`, `from "../entidades"`, etc.) se
  reemplazaron por imports directos al archivo específico.
- El cluster de 19 archivos de `IDispositivo` (ver sección "De solo tipos a schemas
  Zod" arriba) usa `z.custom<T>()` entre sí. Verificado con
  `npx madge --circular --extensions js dist/interfaces`: **0 ciclos** en el JS
  compilado (el único chequeo confiable — sobre el `.ts` fuente madge da falsos
  positivos porque no distingue `import type`).
- `ModeloCorrectora`/`modelosCorrectoras` (modelo/marca de correctora) se mantuvo en
  `entidades/mensajes-nuc/mensajes-nuc.ts`, su ubicación original — no se dupliques
  en otro archivo (`correctora.ts` los reimportaba desde ahí antes de la migración;
  sigue haciéndolo, sin redefinirlos, para no chocar con el barrel de
  `entidades/index.ts`).
- Colisiones de nombre resueltas al promover types locales a `XSchema` (dos archivos
  distintos tenían un type con el mismo nombre, invisible antes porque nunca se había
  compilado el barrel completo como un solo programa): `envio-sms.ts` renombró su
  `TipoAlerta`/`Agrupacion` locales a `TipoAlertaEnvio`/`AgrupacionEnvio` (distintos de
  `alerta.ts`/`gas/agrupacion`); `mensajes-nuc.ts` renombró su `TipoMensaje` a
  `TipoMensajeNuc` (distinto del de `LLM/chat-tipos.ts`).

### 2026-07-31 - Configuración Global «Parámetros OBIS» (ciclo C)

- `IConfigCliente`: nuevo `parametrosObis?: IParametrosObis` — el `reporte_mask` de
  24 bits que el cliente quiere en todos sus NME. Cuarta configuración global, al
  lado de `sincHoraria`, `moduloClima` y `vistasPersonalizadas`.
- Nueva `IConfigDownlinkNme` (`configDownlinkNme.ts`) + `ICreate`/`IUpdate` y los
  types `EstadoConfigDownlinkNme` / `IIntentoConfigDownlinkNme`. Control por equipo
  del SET_CONFIG, espejo de `IConfigDownlinkEuw300`. Colección `configDownlinkNme`
  en gas-datos.
- **Es de un solo tiro, NO reconciliación.** La existencia del documento de control
  es lo que lo garantiza: la pasada de alta solo toma equipos que nunca lo tuvieron,
  así que un mask cambiado por BLE en campo no se pisa. Se descarta a propósito la
  reconciliación continua que recomienda la doc del firmware, porque dejaría sin
  sentido la pantalla OBIS de la app móvil.
- El estado nuevo `'esperando_equipo'` es para el equipo que nunca mandó un fPort
  100: el SET_CONFIG de 4 B lleva `tz` + mask juntos y no se le inventa una zona
  horaria. **No consume intentos.**

### 2026-07-31 - Estado 'fecha_invalida' en la recuperación NME (ciclo B)

- `EstadoRecuperacionNme`: nuevo `'fecha_invalida'` — la plataforma pidió un día
  futuro y el equipo lo rechazó (fPort 34 motivo 3). **Terminal**: reintentar
  repite el error.
- Sale de desambiguar `'error'`, que el ciclo A había dejado con dos significados
  opuestos: el original "falló el enqueue" (transitorio, se reintenta) y el motivo
  3 del fPort 34 (el pedido estaba mal armado, no reintentar). `'error'` vuelve a
  significar solo lo primero.
- **Al agregar un estado hay que darlo de alta en `ESTADOS_TERMINALES`**
  (`gas-cron/src/auxiliares/recuperacion-nme/constants.ts`), que es el único lugar
  que los enumera desde el ciclo B. Antes eran tres listas separadas y esa
  duplicación es justo lo que rompió `'sin_datos'`.

### 2026-07-30 - Ingesta v3 del NME (ciclo A de plataforma)

- `IDispositivoNme`: nuevos `reporteMask?` y `disponibleMask?` (u24 del fPort 100 de
  11 B). El primero es configuración (qué reporta), el segundo observación (qué lista el
  medidor). `reporteMask` **no** indica disponibilidad. `intervaloRegistroMin` queda
  declarado pero deprecado: el firmware dejó de mandarlo en junio 2026.
- `IRegistroMedidorElectrico`: nuevo `regresionAcumulado?` — marca la hora cuyo acumulado
  bajó respecto del último válido. La muestra no produce delta ni avanza el baseline, así
  que tras un recambio de medidor el equipo deja de producir deltas: este flag es cómo se
  encuentran los equipos que esperan intervención.
- `EstadoRecuperacionNme`: nuevo `'sin_datos'` — el equipo confirmó por fPort 34 que el día
  no tiene registros. Terminal. **No confundir con `'agotado'`**: acá el dato no existe,
  allá no lo pudimos traer; piden acciones opuestas.
- `IIntentoRecuperacionNme`: nuevo `motivo?` — el motivo del fPort 34 (1/2/3).

### 2026-07-29 - Demandas máximas horarias del NME

- `IRegistroMedidorElectrico`: nuevos `demandaMaxImportadaW`, `demandaMaxExportadaW`,
  `demandaMaxImportadaT1W`, `demandaMaxExportadaT1W` (OBIS 1.6.0 / 2.6.0 / 1.6.0.1 /
  2.6.0.1). **Snapshots en W al cierre de la hora, NO acumulados**: es la máxima desde el
  último reset de facturación del medidor. No calcular deltas ni sumarlos.
- Llegan por dos caminos con la misma forma: el reporte diario LoRaWAN (fPort 114/115/122/123)
  y el backfill BLE de la app móvil (claves `dmd_w`/`dmd_exp_w`/`dmd_t1_w`/`dmd_exp_t1_w` de
  la característica Registros `…06`).
- Ausencia = campo **omitido** (el medidor no lista ese OBIS, o el registro es previo al
  upgrade de firmware). El `-1` (`REGISTRO_AUSENTE`) sigue reservado al centinela
  `0xFFFFFFFF` del path LoRa.
- Los puertos de reporte diario ya no son fijos 110-113: son `110 + bit` del `reporte_mask`
  configurable (ver `INTEGRACION_LORAWAN_NUBE_NME.md` §4).

### 2026-07-30 - IMEI del UWM-NB (payload V4 cifrado)

- `IDispositivoUwmNb`: nuevo `imei?: string`. El payload V4 (AES) del UWM-NB deja el
  IMEI **en claro** (reemplaza al IMSI del V1, que pasa adentro del bloque cifrado…
  desaparece del frame) y es la clave de lookup para resolver `claveAes` del device
  antes de descifrar.
- `IReporteUWMNB`: nuevo `imei?: string`; `imsi` queda como campo del payload V1.

### 2026-07-29 - Catálogo de exportación y jobs de export

- Nuevo namespace `interfaces/gas/exportacion`: descriptores del catálogo
  (`IColumnaExportDescriptor`, `IFiltroExportDescriptor`, `IPresetColumnasExport`,
  `ICatalogoExport`), pedido y estado del job (`ICrearExportRequest`,
  `ICrearExportResponse`, `IExportJob`) y filtros del padrón de puntos
  (`IFiltrosExportPuntosMedicion`). `TipoExportJob` agrega `"puntos-medicion"`.
- El **catálogo con sus valores vive en gas-datos**
  (`entidades/puntos-medicion-export/puntos-medicion-export.catalogo.ts`), no acá: son
  valores runtime y romperían los servicios NestJS (ver "SOLO TIPOS" arriba). Acá solo
  está la forma que viaja por la API.
- `IExportJob` reemplaza las cinco copias sueltas de esa interfaz que había en el front
  y en los services de gas-api-cliente.

### 2026-07-28 - Tarjetas climáticas de la vista Resumen (1 pedido en vez de N)

- `resumen-operativo-nivel.ts`: nuevos `IResumenClimaHijo`, `IPuntoTemperaturaResumen`,
  `ITendenciaResumen` y `DireccionTendencia`. DTO de la grilla de drill-down de la vista
  Resumen (Clima): describe la tarjeta de cada hijo (UN / CO / Localidad) con clima
  actual, tendencia del pronóstico y serie de temperatura para el sparkline.
  Lo produce `GET /resumen/hijos/:nivel` en gas-api-cliente, que resuelve **todos** los
  hijos en una sola llamada. Antes el frontend pedía `GET /resumen/:nivel/:id` una vez
  por tarjeta (N veces las 4 consultas a gas-datos, devolviendo `serie[30]` +
  `pronostico[8]` para usar 6 valores).
- Es solo clima a propósito: consumo y conteos de parque no van en la tarjeta.

### 2026-07-27 - Módulo Clima activable por cliente

- `IConfigCliente`: nuevo `moduloClima?: IModuloClima` (`{ activo?: boolean }`), mismo
  patrón que `moduloCoberturaLorawan`. Gatea la sección "Clima" (vistas resumen) en
  gas-web-cliente: sin el flag no aparece en el menú y la ruta `/clima` redirige. Permite
  desplegar el frontend a producción con la funcionalidad aún sin liberar al cliente.
  No requiere cambios en gas-datos: `config` es `@Prop({ type: Object })`.

### 2026-07-27 - Revertido: helper `windChillC`

Se había agregado `auxiliares/clima.ts` con una función `windChillC` compartida entre
`gas-api-clima` y `gas-api-cliente`. **Se revierte**: al ser un valor y no un tipo,
dejó a los dos servicios en CrashLoopBackOff con `MODULE_NOT_FOUND` (ver la sección
"Este paquete es de SOLO TIPOS" arriba). La fórmula quedó duplicada en cada servicio,
documentada en ambos.

### 2026-07-27 - Granularidad del dato climático + sensación térmica

- `IRegistroClima`: nuevos `granularidad?: GranularidadClima` (`"horaria" | "diaria"`) y
  `sensacionTermica?: number` (°C). La serie horaria y la diaria se persistían ambas con
  `tipo: "PRONOSTICO"` y sin discriminante: el promedio del día usaba 1-3 muestras
  diurnas (nunca la madrugada) y la curva de pronóstico promediaba horas sueltas con la
  media del día, sesgando los primeros días. Los registros previos quedan sin
  `granularidad`: los `ACTUAL` históricos se tratan como horarios, los `PRONOSTICO` sin
  granularidad quedan fuera de los cálculos diarios.
- `IResumenDiarioLocalidad`: nuevos `sensacionTermicaMedia?` y `horasClima?` (horas
  distintas con dato: 24 = día completo). El clima del día ahora se calcula agrupando
  primero **por hora** (cada hora pesa igual y no se cuenta dos veces) y después por día.
  Corregido el comentario de `consumoResidencial`: es el delta del acumulado
  `valores.consumo`, no una suma de `consumoTotal`.
- `IPuntoSerieResumen`: nuevos `sensacionTermicaMedia?` y `horasClima?`.
  `IClimaResumen`: nuevo `sensacionTermica?`. `climaActual` pasa a ser el punto horario
  más cercano a ahora (antes: último `ACTUAL`, hasta 6 h de atraso).

### 2026-07-24 - Consumo parcial EUW300 (agua residencial)
- `IReporteDiarioEUW300`: agregado `consumoParcial?: number` (consumo del período =
  `consumo` de este reporte − `consumo` del reporte anterior del medidor). Lo calcula
  `gas-api-euw300`, mismo patrón que `IReporteSML.consumoParcial` en gas-sml /
  gas-api-mra-beta-ml107a.
- Aclarado que `consumo` (alias de `flujoAcumuladoActual`) es **acumulado/odómetro**,
  no parcial: el frontend lo sumaba a lo largo de la ventana e inflaba los cards de
  consumo 24hs / mensual / bimestral.
- `IReporteHorarioEUW300`: `flujoAcumuladoInicial` e `incrementosHorarios` ahora vienen
  escalados según `unidadFlujoAcumulado` (antes eran enteros crudos, a diferencia del
  reporte diario).

### 2026-07-16 - Recuperación de registros faltantes NME (GET_HISTORIC)
- Nueva interfaz `IRecuperacionNme` (`recuperacion-nme.ts`) + `ICreate/IUpdate` y
  types `EstadoRecuperacionNme` / `IIntentoRecuperacionNme`. Control y auditoría de
  la recuperación de días incompletos de un NME: gas-cron detecta huecos en
  `registrosmedidorelectrico`, encola y envía un downlink GET_HISTORIC (fPort 108) a
  ChirpStack, y persiste estado/intentos por (`deveui`, `dia`). Colección
  `recuperacionNme` en gas-datos.

### 2026-07-08 - Vista personalizada para división Residencial
- `DivisionConVistaPersonalizada`: ahora incluye `"Residencial"` además de
  `"Correctoras"`
- `IVistasPersonalizadasPorDivision`: agregado `Residencial?`
- Nuevos types: `ColumnaVistaPersonalizadaResidencial` (`consumoInstantaneo`,
  `consumo`, `consumoCorregido`, `bateria`) y `ColumnaVistaPersonalizada`
  (unión de correctoras + residencial). `IVistaPersonalizadaColumna.key` usa
  la unión.

### 2026-06-26 - Subfiltro por tipo de alerta en Punto de Medición
- `IPuntoMedicion`: agregado `tiposAlertaActivos?: ITipoAlerta[]` (campo calculado por
  el backend). Permite subfiltrar el listado de puntos por tipo de alerta cuando
  `estado === "Alerta"`. Reutiliza el type `ITipoAlerta` de `alerta.ts`. Se espeja la
  señal de `estado` en los write-paths de cada división (no se consulta la colección
  `alertas`, salvo SCADA que la recomputa por ser 1:N con closure confiable).

### 2026-06-08 - Nueva división "Medidores Eléctricos" (dispositivo NME)
- Agregado `"Medidores Eléctricos"` al type `Division`
- Agregado `"NME"` a `TipoDispositivoGas` y `TIPOS_DISPOSITIVOS`
- Nuevas interfaces: `IMedidorElectrico`, `IRegistroMedidorElectrico`, `IDispositivoNme`
- `IPuntoMedicion`: agregados `idMedidorElectrico`, `fechaAsignacionMedidorElectrico` y
  virtual `medidorElectrico`
- `IAlerta`: agregados `idMedidorElectrico` y virtual `medidorElectrico`

### 2025-10-15 - Soporte de teléfonos SMS para NUC v2.0
- Agregados `telefono1`, `telefono2`, `telefono3` a `IConfigDispositivoNUC4G`
- Agregados campos de teléfono a `ISetConfiguracionV2`
- Agregados campos GPIO (`tipo_input_1`, `tipo_input_2`) a `ISetConfiguracionV2`

## Referencias

- Ver `/CLAUDE.md` (raíz del sistema) para arquitectura general
- Ver `/NUC/CLAUDE.md` para detalles del firmware NUC
- Ver `/NUC/NUC-2/CLAUDE.md` para funcionalidad GPIO del NUC v2.0
