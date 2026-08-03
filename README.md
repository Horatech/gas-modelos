# gas-modelos

Modelos para el sistema de gas: **schemas Zod v4 + tipos TypeScript inferidos**.

Cada entidad exporta su schema runtime (`DispositivoSchema`, `CreateDispositivoSchema`, `UpdateDispositivoSchema`) y los tipos derivados con los mismos nombres de siempre (`IDispositivo`, `ICreateDispositivo`, `IUpdateDispositivo`). Los imports existentes de tipos no cambian.

## ⚠️ Hay que buildearlo para usarlo

Este paquete **NO se publica compilado**: `dist/` está en `.gitignore`, así que un
checkout crudo del repo no trae los `.js`/`.d.ts`. El `main`/`types` del
`package.json` apuntan a `dist/index.js` / `dist/index.d.ts`, que **solo existen
después de compilar** (`npm run build` → `tsc`).

Hay dos formas de consumirlo — **la regla acá es más estricta que en el repo hermano
`gestion-modelos`**, por el incidente de producción documentado en `CLAUDE.md`:

1. **Import desde `modelos/src`** — **solo para tipos** (`ICliente`, `IPuntoMedicion`,
   etc.). Es gratis: TypeScript los borra al compilar, no genera ningún `require` en el
   JS del consumidor.
2. **Import desde `modelos`** (entrypoint `dist`) — **obligatorio para cualquier uso
   runtime de un `*Schema`** (`.parse()`, `.safeParse()`, `.shape`, `.options`,
   `createZodDto(...)`). Requiere que `dist/` exista, generado automáticamente por el
   hook **`prepare` → `tsc`** que corre en el `npm install`/`npm ci` del consumidor.

> Nunca importar un `*Schema` como valor desde `modelos/src` en un backend NestJS. No
> hay garantía de que el `tsc` del consumidor resuelva ese `require` correctamente (ver
> el incidente de `windChillC` en `CLAUDE.md`) — usar siempre el entrypoint `modelos`
> (dist) para eso.

> Consecuencia operativa: cualquier cambio en modelos hay que verificarlo con
> `npm run build` acá **y** con el build del consumidor antes de mergear.

## Instalación (consumidores)

En `package.json` del servicio, como git-dependency:

```json
"modelos": "github:Horatech/gas-modelos"
```

Script para (re)apuntar y refrescar el lockfile:

```bash
npm install modelos@git+https://github.com/Horatech/gas-modelos.git
```

El import clásico de tipos sigue funcionando sin cambios:

```typescript
import { ICoordenadas, IDispositivo } from 'modelos/src';
```

## Uso de los schemas

```typescript
import { CreateDispositivoSchema, TipoDispositivoGasSchema } from 'modelos';

// Validación runtime de un body
const resultado = CreateDispositivoSchema.safeParse(body);
if (!resultado.success) {
  // resultado.error.issues tiene el detalle campo por campo
}

// Valores de un enum en runtime (ej: opciones de un select)
TipoDispositivoGasSchema.options; // ['NUC', 'SML', ...]
```

## Convenciones (Zod v4)

- API canónica: `z.object` / `z.union` / `z.enum`. **No** usar `z.nativeEnum` ni los deprecados `.passthrough()` / `.strict()` / `.strip()`. No hay `z.discriminatedUnion` en este repo: las uniones heterogéneas (ej. `IValoresReporte`) no tienen un discriminante literal limpio, van con `z.union([...])` simple.
- Tipos siempre por `z.infer<typeof XSchema>`, sin casts manuales.
- ids y fechas son `z.string()` plano (fechas en ISO string, como siempre).
- `Create` = `XSchema.omit({...})`; `Update` ídem (a veces con `.required({...})` cuando el original tenía campos requeridos que en la entidad base son opcionales).
- **Cluster de `IDispositivo`** (19 archivos: `dispositivo.ts`, `registro.ts`, `punto-medicion.ts`, `dispositivo-externo-nuc.ts`, `correctora.ts`, `cuenta-cliente.ts`, `reporte.ts`, `medidor-residencial.ts`, `medidor-residencial-agua.ts`, `medidor-electrico.ts`, `registro-medidor-electrico.ts`, `unidad-presion.ts`, `valores-reporte/valoresReporte.ts`, `valores-reporte/reporte-inputs-nuc.ts`, `alerta.ts`, `scada.ts`, `config-dispositivo.ts`, `tenant/cliente.model.ts`, `tenant/cliente.dto.ts`): cuando se referencian entre sí, el campo va como:

  ```typescript
  ultimoReporte: z.custom<IRegistro>().optional(),
  ```

  con una interface hand-written en paralelo al schema (sin `z.infer`, para no arrastrar el ciclo al declaration emit). Ver detalle completo y por qué en `CLAUDE.md`.

## JSON Schema / OpenAPI

```bash
npm run build
npm run gen:json-schema            # dist/json-schema/<Name>.json + index.json
npm run gen:json-schema -- --only=Dispositivo --verbose
```

Usa `z.toJSONSchema(schema, { target: 'openapi-3.0' })` nativo de Zod v4, sin librerías extra. Para Swagger en las APIs NestJS se puede usar `nestjs-zod` (`createZodDto(CreateDispositivoSchema)`).

## Pasaje a producción (migración Zod)

Los consumidores resuelven la git-dependency a un **commit fijo** en su
`package-lock.json`, y el Dockerfile usa `npm ci` (respeta el lock exacto). Por
eso **mergear a `main` no cambia nada en prod por sí solo**: cada consumidor
sigue clavado a su commit hasta que refresque el lock y rebuildee su imagen.

Estado de verificación y lista completa de consumidores: **`CONSUMIDORES.md`**.
