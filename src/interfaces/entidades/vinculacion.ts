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
  /** Fecha real de instalación del equipo en la entidad. No puede ser futura. */
  fechaAsignacion: z.string(),
  motivo: MotivoAsignacionSchema,
  observaciones: z.string().optional(),
});
export type IAsignarDispositivo = z.infer<typeof AsignarDispositivoSchema>;

export const DesasignarDispositivoSchema = z.object({
  tipoEntidad: TipoEntidadVinculableSchema,
  idEntidad: z.string(),
  /** Fecha real de retiro del equipo. No puede ser futura. */
  fechaDesasignacion: z.string(),
  motivo: MotivoAsignacionSchema,
  observaciones: z.string().optional(),
});
export type IDesasignarDispositivo = z.infer<
  typeof DesasignarDispositivoSchema
>;

////// Entidad intermedia -> Punto de medición

export const VincularEntidadPuntoSchema = z.object({
  idPuntoMedicion: z.string(),
  tipoEntidad: TipoEntidadVinculableSchema,
  idEntidad: z.string(),
  /**
   * Desde cuándo el equipo está instalado en el punto. Puede ser retroactiva: es
   * la fecha de corte que decide qué reportes, registros y alertas pasan a
   * contabilizarse en este punto.
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
