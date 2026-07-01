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
