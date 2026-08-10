import { z } from "zod";
import { TenantInfoGasSchema } from "../auxiliares/tenentInfo";
import { MotivoAsignacionSchema } from "./asignacion";

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
export const TipoEntidadVinculableSchema = z.enum([
  "Correctora",
  "Unidad de Presión",
  "Medidor Residencial",
  "Medidor Residencial Agua",
  "Medidor Eléctrico",
  "Dispositivo Externo NUC",
  "Scada",
]);
export type ITipoEntidadVinculable = z.infer<
  typeof TipoEntidadVinculableSchema
>;

////// Metadatos de cada entidad vinculable

/**
 * Fuente única de verdad del mapeo entidad ↔ división ↔ tipo de dispositivo ↔
 * campo del punto. La consumen gas-api-cliente (validaciones y sincronización de
 * histórico) y gas-web-cliente (filtros de los selectores, etiquetas).
 *
 * Vive acá y no en cada consumidor porque el sistema ya tuvo el problema de tener
 * el mismo mapa escrito tres veces con criterios distintos: en
 * `dispositivos.service.ts` de gas-api-cliente, `BOVE` figuraba en uno solo y
 * `OCR`/`MRA` clasificaban distinto entre dos de ellos.
 *
 * Es data pura (sin referencias a servicios), así que es seguro exportarla como
 * valor runtime desde este paquete.
 */
export interface IMetadataEntidadVinculable {
  tipoEntidad: ITipoEntidadVinculable;
  /** Divisiones de punto en las que esta entidad puede participar. */
  divisiones: string[];
  /**
   * Tipos de dispositivo compatibles. Vacío = la entidad no acepta dispositivo
   * (Scada se vincula por `tag`).
   */
  tiposDispositivo: string[];
  /** Campo del punto de medición que guarda el vínculo. */
  campoIdPunto: string;
  campoFechaPunto: string;
  /** El campo del punto es un array (`idsScada`, `idsDipositivosExternosNuc`). */
  multiple: boolean;
  /** Campo por el que el histórico referencia a esta entidad. */
  campoHistorico: string;
  /** Campo por el que la alerta referencia a esta entidad. */
  campoAlerta: string;
  /** Nombre humano para mensajes de error y para el historial. */
  etiqueta: string;
  /** Colección de gas-datos donde vive el histórico de esta entidad. */
  coleccionesHistoricas: Array<
    "registros" | "reportes" | "registrosMedidorElectrico"
  >;
}

export const METADATA_ENTIDADES_VINCULABLES: Record<
  ITipoEntidadVinculable,
  IMetadataEntidadVinculable
> = {
  Correctora: {
    tipoEntidad: "Correctora",
    divisiones: ["Correctoras"],
    tiposDispositivo: ["NUC"],
    campoIdPunto: "idCorrectora",
    campoFechaPunto: "fechaAsignacionCorrectora",
    multiple: false,
    campoHistorico: "idCorrectora",
    campoAlerta: "idCorrectora",
    etiqueta: "correctora",
    coleccionesHistoricas: ["registros"],
  },
  "Unidad de Presión": {
    tipoEntidad: "Unidad de Presión",
    divisiones: ["Presión"],
    tiposDispositivo: ["NSP", "VERIBOX MICRO"],
    campoIdPunto: "idUnidadPresion",
    campoFechaPunto: "fechaAsignacionUnidadPresion",
    multiple: false,
    campoHistorico: "idsAsignados",
    campoAlerta: "idUnidadPresion",
    etiqueta: "unidad de presión",
    coleccionesHistoricas: ["reportes"],
  },
  "Medidor Residencial": {
    tipoEntidad: "Medidor Residencial",
    divisiones: ["Residencial"],
    tiposDispositivo: ["SML", "WRC", "OCR"],
    campoIdPunto: "idMedidorResidencial",
    campoFechaPunto: "fechaAsignacionMedidorResidencial",
    multiple: false,
    campoHistorico: "idsAsignados",
    campoAlerta: "idMedidorResidencial",
    etiqueta: "medidor residencial",
    coleccionesHistoricas: ["reportes"],
  },
  "Medidor Residencial Agua": {
    tipoEntidad: "Medidor Residencial Agua",
    divisiones: ["Residencial Agua"],
    tiposDispositivo: [
      "ML107A",
      "ML107GH",
      "EUW300",
      "BOVE",
      "MRA",
      "UWM-NB",
    ],
    campoIdPunto: "idMedidorResidencialAgua",
    campoFechaPunto: "fechaAsignacionMedidorResidencialAgua",
    multiple: false,
    campoHistorico: "idsAsignados",
    campoAlerta: "idMedidorResidencialAgua",
    etiqueta: "medidor de agua",
    coleccionesHistoricas: ["reportes"],
  },
  "Medidor Eléctrico": {
    tipoEntidad: "Medidor Eléctrico",
    divisiones: ["Medidores Eléctricos"],
    tiposDispositivo: ["NME"],
    campoIdPunto: "idMedidorElectrico",
    campoFechaPunto: "fechaAsignacionMedidorElectrico",
    multiple: false,
    // gas-api-nme escribe en registrosmedidorelectrico, no en reportes.
    campoHistorico: "idMedidorElectrico",
    campoAlerta: "idMedidorElectrico",
    etiqueta: "medidor eléctrico",
    coleccionesHistoricas: ["registrosMedidorElectrico"],
  },
  "Dispositivo Externo NUC": {
    tipoEntidad: "Dispositivo Externo NUC",
    divisiones: ["Dispositivo Externo NUC"],
    tiposDispositivo: ["NUC"],
    // Typo histórico del modelo (falta la "s" de "Dispositivos"): está así en el
    // schema, en gas-datos y en el front. No se corrige acá para no romperlos.
    campoIdPunto: "idsDipositivosExternosNuc",
    campoFechaPunto: "fechaAsignacionDispositivoExternoNuc",
    multiple: true,
    campoHistorico: "idsAsignados",
    campoAlerta: "idDispositivoExternoNuc",
    etiqueta: "dispositivo externo NUC",
    coleccionesHistoricas: ["reportes"],
  },
  Scada: {
    tipoEntidad: "Scada",
    divisiones: ["SCADA Mediciones", "SCADA Unifilares"],
    // Se vincula por `tag` desde la config del dispositivo, no por deveui.
    tiposDispositivo: [],
    campoIdPunto: "idsScada",
    campoFechaPunto: "fechaAsignacionScada",
    multiple: true,
    campoHistorico: "idsAsignados",
    campoAlerta: "idScada",
    etiqueta: "tag SCADA",
    coleccionesHistoricas: ["reportes"],
  },
};

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
