import { z } from "zod";
import { TenantInfoGasSchema } from "../auxiliares/tenentInfo";
import { MotivoAsignacionSchema } from "./asignacion";
import { TIPOS_ENTIDAD_VINCULABLE } from "./metadata-vinculacion";

/**
 * Contratos de los endpoints del proceso de asignación (gas-api-cliente,
 * `/vinculacion/*`). Reemplazan la escritura directa de `entidad.deveui` y de
 * `punto.idXxx` desde los ABM.
 *
 * Plan: `/PLAN-ASIGNACION-VINCULACION.md`.
 */

/**
 * Las 7 entidades intermedias que se pueden vincular a un punto de medición.
 * Subconjunto de `IEntidades` (que además incluye Dispositivo, UN, CO, Localidad
 * y el propio Punto de Medición, que no son vinculables en este sentido).
 *
 * `Scada` es la única que NO acepta un dispositivo: se vincula por `tag`. Sólo
 * participa de los endpoints entidad→punto.
 */
export const TipoEntidadVinculableSchema = z.enum(
  TIPOS_ENTIDAD_VINCULABLE,
);

////// Dispositivo -> Entidad intermedia

export const AsignarDispositivoSchema = z.object({
  tipoEntidad: TipoEntidadVinculableSchema,
  idEntidad: z.string(),
  deveui: z.string(),
  /**
   * Fecha real de instalación del equipo en la entidad. No puede ser futura.
   *
   * Sí puede ser retroactiva sin límite cuando el equipo nunca tuvo dispositivo:
   * el alta normal es cargar hoy una instalación de días atrás. Si ya tuvo uno,
   * el piso es el retiro del anterior: los dos tramos no se superponen.
   */
  fechaAsignacion: z.string(),
  motivo: MotivoAsignacionSchema,
  observaciones: z.string().optional(),
  /**
   * Lectura del dial del medidor mecánico al instalar, en m³. **Sólo medidores
   * residenciales** (gas y agua): es el ancla del acumulado del tramo que se abre.
   *
   * Ausente = nadie leyó el dial. El vínculo se abre con `dialPendiente` y el
   * acumulado del medidor queda relativo al equipo hasta que se cargue. Es el caso
   * del alta automática de la ingesta, y también el de un operador que instala sin
   * anotar la lectura.
   *
   * Acá se declara la lectura y NO en el ABM del medidor: una lectura sin la fecha
   * en que se tomó no se puede proyectar al instante de instalación.
   */
  dialLectura: z.number().optional(),
  /**
   * Cuándo se tomó `dialLectura`. Ausente = se asume `fechaAsignacion`.
   *
   * Puede ser posterior a `fechaAsignacion` (el operador carga el dial días
   * después): el ancla se proyecta hacia atrás con lo que midió el equipo en el
   * medio. Futura, no.
   */
  dialLecturaFecha: z.string().optional(),
});
export type IAsignarDispositivo = z.infer<typeof AsignarDispositivoSchema>;

export const DesasignarDispositivoSchema = z.object({
  tipoEntidad: TipoEntidadVinculableSchema,
  idEntidad: z.string(),
  /** Fecha real de retiro del equipo. No puede ser futura. */
  fechaDesasignacion: z.string(),
  motivo: MotivoAsignacionSchema,
  observaciones: z.string().optional(),
  /**
   * Lectura del dial del medidor mecánico al retirar el equipo, en m³. Opcional.
   *
   * Cierra el tramo con un dial conocido, y es lo único que permite acotar el
   * **hueco sin medición** que empieza acá: sin equipo el medidor sigue contando y
   * nadie lo mide, así que la diferencia contra la lectura de la próxima
   * instalación es consumo real que no tiene serie.
   */
  dialLectura: z.number().optional(),
  /** Cuándo se tomó `dialLectura`. Ausente = se asume `fechaDesasignacion`. */
  dialLecturaFecha: z.string().optional(),
});
export type IDesasignarDispositivo = z.infer<
  typeof DesasignarDispositivoSchema
>;

/**
 * Corrección de la lectura del dial de un vínculo dispositivo→medidor ya abierto.
 *
 * Va como operación propia y deja un evento `cambio-lectura` en `asignaciones`, en
 * vez de editar el medidor: la colección es un log append-only y al resolver el
 * tramo gana la corrección más reciente. La auditoría muestra que la lectura se
 * corrige de rutina —hay medidores con seis ediciones de `consumoInicial` en tres
 * semanas— y con la fecha de cada lectura eso deja de ser una reescritura ciega.
 *
 * ⚠️ **No reescribe el histórico de reportes.** Regla del dueño del dominio
 * (2026-09-08): los reportes ya escritos conservan su acumulado y la serie conserva
 * el escalón. Corregir hacia atrás, si alguna vez hace falta, es una operación
 * explícita y aparte.
 */
export const CambiarLecturaDialSchema = z.object({
  tipoEntidad: TipoEntidadVinculableSchema,
  idEntidad: z.string(),
  /** Lectura del dial, en m³. */
  dialLectura: z.number(),
  /** Cuándo se tomó. No puede ser futura ni anterior a la apertura del vínculo. */
  dialLecturaFecha: z.string(),
  motivo: MotivoAsignacionSchema,
  observaciones: z.string().optional(),
});
export type ICambiarLecturaDial = z.infer<typeof CambiarLecturaDialSchema>;

////// Entidad intermedia -> Punto de medición

export const VincularEntidadPuntoSchema = z.object({
  idPuntoMedicion: z.string(),
  tipoEntidad: TipoEntidadVinculableSchema,
  idEntidad: z.string(),
  /**
   * Desde cuándo el equipo está instalado en el punto. Puede ser retroactiva: es
   * la fecha de corte que decide qué reportes, registros y alertas pasan a
   * contabilizarse en este punto.
   *
   * Sin límite hacia atrás si el equipo nunca estuvo en un punto; si estuvo, el
   * piso es su desvinculación del anterior. Futura, no.
   */
  fechaAsignacion: z.string(),
  motivo: MotivoAsignacionSchema,
  observaciones: z.string().optional(),
});
export type IVincularEntidadPunto = z.infer<
  typeof VincularEntidadPuntoSchema
>;

export const DesvincularEntidadPuntoSchema = z.object({
  idPuntoMedicion: z.string(),
  tipoEntidad: TipoEntidadVinculableSchema,
  idEntidad: z.string(),
  /**
   * Desde cuándo el equipo dejó de estar en el punto. El histórico anterior
   * queda en el punto; el posterior se desvincula.
   */
  fechaDesasignacion: z.string(),
  motivo: MotivoAsignacionSchema,
  observaciones: z.string().optional(),
});
export type IDesvincularEntidadPunto = z.infer<
  typeof DesvincularEntidadPuntoSchema
>;

////// Re-vinculación del histórico (gas-datos)

/**
 * Cuerpo de `PUT /reportes/revincular?filter=...`.
 *
 * Existe como operación propia porque `idsAsignados` es un array y no se puede
 * reasignar con un `$set` plano sin perder los ids que no participan del cambio
 * (el ingest escribe `[idDispositivo, idEntidad, idPunto]`). Además hay que
 * recalcular `idsAsignadosHash`, que los hooks del schema no calculan en
 * `updateMany`, y corregir el snapshot `tenant.*` cuando el punto nuevo está en
 * otra UN/CO/Localidad.
 */
export const RevincularReportesSchema = z.object({
  /** Ids a agregar a `idsAsignados` (idempotente). */
  agregar: z.array(z.string()).optional(),
  /** Ids a quitar de `idsAsignados`. */
  quitar: z.array(z.string()).optional(),
  /** Campos del snapshot de tenancy a corregir. Sólo los presentes se tocan. */
  tenant: TenantInfoGasSchema.partial().optional(),
});
export type IRevincularReportes = z.infer<typeof RevincularReportesSchema>;

export const RevincularReportesResultadoSchema = z.object({
  matched: z.number(),
  modified: z.number(),
});
export type IRevincularReportesResultado = z.infer<
  typeof RevincularReportesResultadoSchema
>;
