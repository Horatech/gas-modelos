import { z } from "zod";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { LocalidadSchema } from "./localidad";
import { CromatografiaSchema } from "./cromatografia";
import { ModeloCorrectoraSchema } from "./mensajes-nuc/mensajes-nuc";
import type { ModeloCorrectora } from "./mensajes-nuc/mensajes-nuc";
import { EstadoCorrectoraSchema } from "./estado";
import type { IEstado } from "./estado";
import type { IAlerta } from "./alerta";
import type { IDispositivo } from "./dispositivo";
import type { IRegistro } from "./registro";

// El modelo/marca de correctora se define en mensajes-nuc.ts (protocolo NUC),
// no acá — no se re-exporta desde este archivo para no chocar con el barrel
// de entidades/index.ts (export * de dos módulos con el mismo nombre). Para
// consumir el schema/array de valores, importar directo de mensajes-nuc.ts.

// EstadoCorrectoraSchema / IEstado se movieron a `./estado` (archivo hoja) para
// que `tenant/cliente.model.ts` los pueda consumir sin cerrar el ciclo runtime
// correctora → localidad → ClienteSchema → correctora. No se re-exportan desde
// acá: el barrel de entidades ya exporta `./estado` y un `export *` duplicado
// haría ambigua la exportación.

// Populates intra-SCC (IAlerta, IDispositivo, IRegistro) como z.custom: ver
// CLAUDE.md, "De solo tipos a schemas Zod".
export const CorrectoraSchema = z.object({
  _id: z.string().optional(),
  firmware: z.string().optional(),
  numeroSerie: z.string().nullable().optional(),
  deveui: z.string().nullable().optional(),
  fechaAsignacionDispositivo: z.string().nullable().optional(),
  modelo: ModeloCorrectoraSchema.optional(),
  fechaCreacion: z.string().optional(),
  bateria: z.number().optional(),
  ultimoRegistro: z.custom<IRegistro>().optional(),
  ultimaAlerta: z.custom<IAlerta>().optional(),
  ultimaCromatografia: CromatografiaSchema.optional(),
  fechaUltimaCromatografia: z.string().optional(),
  estadoActual: EstadoCorrectoraSchema.optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
  // Populate
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
  dispositivo: z.custom<IDispositivo>().optional(),
});

/**
 * Interface hand-written (mismo shape que el schema): parte del SCC de
 * IDispositivo, no usa z.infer.
 */
export interface ICorrectora {
  _id?: string;
  firmware?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  fechaAsignacionDispositivo?: string | null;
  modelo?: ModeloCorrectora;
  fechaCreacion?: string;
  bateria?: number;
  ultimoRegistro?: IRegistro;
  ultimaAlerta?: IAlerta;
  ultimaCromatografia?: import("./cromatografia").ICromatografia;
  fechaUltimaCromatografia?: string;
  estadoActual?: IEstado;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  unidadNegocio?: import("../gas/unidadNegocio/schema").IUnidadNegocio;
  centroOperativo?: import("../gas/centroOperativo/schema").ICentroOperativo;
  localidad?: import("./localidad").ILocalidad;
  dispositivo?: IDispositivo;
}

////// CREATE
export const CreateCorrectoraSchema = CorrectoraSchema.omit({
  _id: true,
  centroOperativo: true,
  localidad: true,
  dispositivo: true,
});
type OmitirCreate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "dispositivo";
export interface ICreateCorrectora extends Omit<
  Partial<ICorrectora>,
  OmitirCreate
> {}

////// UPDATE
export const UpdateCorrectoraSchema = CreateCorrectoraSchema;
type OmitirUpdate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "dispositivo";
export interface IUpdateCorrectora extends Omit<
  Partial<ICorrectora>,
  OmitirUpdate
> {}
