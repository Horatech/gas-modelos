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

⚠️ **NO intentar compilar este paquete**. No tiene script de build ni es necesario.

Los cambios en las interfaces se reflejan automáticamente en los proyectos que las consumen mediante el sistema de módulos de TypeScript.

### ⛔ Este paquete es de SOLO TIPOS: no exportar valores runtime

Sólo hay archivos `.ts` y **no se emite JS**. Consecuencia:

- Importar **tipos** (`interface`, `type`) es gratis: TypeScript los borra al compilar y no queda nada en el `dist`.
- Importar un **valor** (una función, una constante, un `enum` real) deja un
  `require('modelos/src')` en el JS compilado, y **Node no lo puede resolver**: en
  `node_modules/modelos/src` no hay ningún `index.js`. El servicio arranca y muere con
  `MODULE_NOT_FOUND`.

**`npm run lint && npm run build` NO lo detectan** — para TypeScript la resolución es
correcta. El fallo aparece sólo al ejecutar. Ya ocurrió (jul 2026): un helper de wind
chill exportado desde acá dejó `gas-api-clima v1.1.2` y `gas-api-cliente v3.7.4` en
CrashLoopBackOff en producción.

Por eso `TIPOS_DISPOSITIVOS` (`auxiliares/tipoDispositivo.ts`) no tiene ningún
consumidor de código en los servicios: **no puede tenerlo**.

**Si hace falta lógica compartida** entre servicios: duplicarla en cada uno con un
comentario que lo explique, o crear un paquete aparte que sí compile a JS. Los frontends
Angular sí podrían importar valores (bundlean el TS), pero los backends NestJS no.

Chequeo rápido antes de dar por buena una importación nueva:

```bash
npm run build && node -e "require('./dist/<archivo-que-importa>.js')"
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
