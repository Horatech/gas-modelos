import type { TipoDispositivoGas } from "../auxiliares/tipoDispositivo";
import type { Division } from "../tenant/usuario/permiso";

/**
 * Catálogo del proceso de asignación: la tabla de metadatos y las listas cerradas
 * que la acompañan.
 *
 * **Archivo hoja, sin Zod y sin un solo import de valor.** Mismo criterio que
 * `canal-descriptor.ts`: es catálogo, no entidad; no se persiste ni viaja en un body.
 *
 * El motivo es concreto y medido: cuando la tabla vivía en `vinculacion.ts`, un
 * `import { METADATA_ENTIDADES_VINCULABLES }` desde gas-web-cliente arrastraba
 * `asignacion.ts` → `CorrectoraSchema`, `PuntoMedicionSchema`, `UsuarioSchema` y todo
 * `zod` al bundle: **+390 kB en el chunk inicial** (4,89 MB → 5,28 MB), por una tabla
 * de 7 filas de datos estáticos. Acá el consumidor se lleva un objeto literal.
 *
 * Los `*Schema` de Zod se construyen A PARTIR de estas listas
 * (`asignacion.ts`, `vinculacion.ts`), así que la fuente de verdad sigue siendo una.
 */

/** Las 7 entidades intermedias que se pueden vincular a un punto de medición. */
export const TIPOS_ENTIDAD_VINCULABLE = [
  "Correctora",
  "Unidad de Presión",
  "Medidor Residencial",
  "Medidor Residencial Agua",
  "Medidor Eléctrico",
  "Dispositivo Externo NUC",
  "Scada",
] as const;
export type ITipoEntidadVinculable = (typeof TIPOS_ENTIDAD_VINCULABLE)[number];

/** Catálogo cerrado de motivos, para que el historial se filtre y cuente por causa. */
export const MOTIVOS_ASIGNACION = [
  "Instalación inicial",
  "Recambio por falla",
  "Recambio programado",
  "Retiro por baja de servicio",
  "Corrección de carga errónea",
  "Automático",
] as const;
export type IMotivoAsignacion = (typeof MOTIVOS_ASIGNACION)[number];

export const ACCIONES_ASIGNACION = [
  "asignar",
  "desasignar",
  "reemplazar",
  "cambio-fecha",
] as const;
export type IAccionAsignacion = (typeof ACCIONES_ASIGNACION)[number];

export const ORIGENES_ASIGNACION = [
  "USUARIO",
  "SISTEMA",
  "MOVIL",
  "IMPORT",
] as const;
export type IOrigenAsignacion = (typeof ORIGENES_ASIGNACION)[number];

export interface IMetadataEntidadVinculable {
  tipoEntidad: ITipoEntidadVinculable;
  /** Divisiones de punto en las que esta entidad puede participar. */
  divisiones: Division[];
  /**
   * Tipos de dispositivo compatibles. Vacío = la entidad no acepta dispositivo
   * (Scada se vincula por `tag`).
   */
  tiposDispositivo: TipoDispositivoGas[];
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

/**
 * Fuente única de verdad del mapeo entidad ↔ división ↔ tipo de dispositivo ↔ campo
 * del punto. La consumen gas-api-cliente (validaciones y sincronización de histórico)
 * y gas-web-cliente (filtros de los selectores, etiquetas).
 *
 * Vive en modelos y no en cada consumidor porque el sistema ya tuvo el mismo mapa
 * escrito tres veces con criterios distintos en `dispositivos.service.ts` de
 * gas-api-cliente: `BOVE` figuraba en uno solo y `OCR`/`MRA` clasificaban distinto
 * entre dos de ellos.
 */
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
    tiposDispositivo: ["ML107A", "ML107GH", "EUW300", "BOVE", "MRA", "UWM-NB"],
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
