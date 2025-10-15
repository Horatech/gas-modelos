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

### 2025-10-15 - Soporte de teléfonos SMS para NUC v2.0
- Agregados `telefono1`, `telefono2`, `telefono3` a `IConfigDispositivoNUC4G`
- Agregados campos de teléfono a `ISetConfiguracionV2`
- Agregados campos GPIO (`tipo_input_1`, `tipo_input_2`) a `ISetConfiguracionV2`

## Referencias

- Ver `/CLAUDE.md` (raíz del sistema) para arquitectura general
- Ver `/NUC/CLAUDE.md` para detalles del firmware NUC
- Ver `/NUC/NUC-2/CLAUDE.md` para funcionalidad GPIO del NUC v2.0
