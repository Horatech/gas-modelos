import { z } from "zod";
import { EstadoCorrectoraSchema } from "./estado";
import type { IEstado } from "./estado";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { LocalidadSchema } from "./localidad";
import type { IReporte } from "./reporte";
import type { IAlerta } from "./alerta";
import type { IDispositivo } from "./dispositivo";

// Populates intra-SCC (IReporte, IAlerta, IDispositivo) como z.custom: ver
// CLAUDE.md, "De solo tipos a schemas Zod".
export const UnidadPresionSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  modelo: z.string().optional(),
  numeroSerie: z.string().nullable().optional(),
  deveui: z.string().nullable().optional(),
  fechaAsignacionDispositivo: z.string().nullable().optional(),
  ultimoRegistro: z.custom<IReporte>().optional(),
  ultimaAlerta: z.custom<IAlerta>().optional(),
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
export interface IUnidadPresion {
  _id?: string;
  fechaCreacion?: string;
  modelo?: string;
  numeroSerie?: string | null;
  deveui?: string | null;
  fechaAsignacionDispositivo?: string | null;
  ultimoRegistro?: IReporte;
  ultimaAlerta?: IAlerta;
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
export const CreateUnidadPresionSchema = UnidadPresionSchema.omit({
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
export interface ICreateUnidadPresion
  extends Omit<Partial<IUnidadPresion>, OmitirCreate> {}

////// UPDATE
export const UpdateUnidadPresionSchema = CreateUnidadPresionSchema;
type OmitirUpdate =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "dispositivo";
export interface IUpdateUnidadPresion
  extends Omit<Partial<IUnidadPresion>, OmitirUpdate> {}
