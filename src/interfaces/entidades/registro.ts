import { z } from "zod";
import { ClienteSchema } from "../tenant/cliente.model";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { LocalidadSchema } from "./localidad";
import { GrupoSchema } from "./grupo";
import { CuencaSchema } from "./cuenca";
import { AgrupacionSchema } from "../gas/agrupacion/schema";
import type { ICorrectora } from "./correctora";
import type { IPuntoMedicion } from "./punto-medicion";

// Populates intra-SCC (ICorrectora, IPuntoMedicion) como z.custom: ver
// CLAUDE.md, "De solo tipos a schemas Zod".
export const RegistroSchema = z.object({
  _id: z.string().optional(),
  timestamp: z.string().optional(),
  corrected: z.number().optional(),
  uncorrected: z.number().optional(),
  presion: z.number().optional(),
  temperatura: z.number().optional(),
  contador: z.number().optional(),
  bateria: z.number().optional(),
  bateriaNUC: z.number().optional(),
  // Valores firmware nuevo
  correctedTotalizado: z.number().optional(),
  uncorrectedTotalizado: z.number().optional(),
  correctedParcializado: z.number().optional(),
  uncorrectedParcializado: z.number().optional(),
  caudalPromedio: z.number().optional(),
  caudalPico: z.number().optional(),
  fpv: z.number().optional(), // Factor de compresibilidad
  horaTruncada: z.boolean().optional(),
  /**
   * El `timestamp` de este registro está corrido +1 h respecto de la etiqueta que
   * reportó el equipo. Sólo lo llevan los registros de correctoras American Meter,
   * que etiquetan la lectura con el INICIO de la hora mientras el resto de los
   * modelos la etiqueta con el CIERRE (por eso el día gas 7:00-6:00 les daba mal).
   *
   * Es el discriminante de convención: un registro sin la marca está en la
   * convención vieja (histórico previo al backfill). Lo usa `/externo` de
   * gas-api-cliente para devolver la etiqueta original en los datos anteriores a
   * la fecha de implementación.
   */
  tsCorrido: z.boolean().optional(),
  //
  numeroSerieCorrectora: z.string().nullable().optional(),
  deveui: z.string().optional(),
  deviceName: z.string().optional(),
  modelo: z.string().optional(),
  //
  idCorrectora: z.string().optional(),
  idPuntoMedicion: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
  idCuenca: z.string().optional(),
  idsGrupos: z.array(z.string()).optional(),
  idsAgrupaciones: z.array(z.string()).optional(),
  //
  fechaCreacion: z.string().optional(),
  // Virtuals
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
  cuenca: CuencaSchema.optional(),
  correctora: z.custom<ICorrectora>().optional(),
  puntoMedicion: z.custom<IPuntoMedicion>().optional(),
  grupos: z.array(GrupoSchema).optional(),
  agrupaciones: z.array(AgrupacionSchema).optional(),
});

/**
 * Interface hand-written (mismo shape que el schema): parte del SCC de
 * IDispositivo, no usa z.infer.
 */
export interface IRegistro {
  _id?: string;
  timestamp?: string;
  corrected?: number;
  uncorrected?: number;
  presion?: number;
  temperatura?: number;
  contador?: number;
  bateria?: number;
  bateriaNUC?: number;
  // Valores firmware nuevo
  correctedTotalizado?: number;
  uncorrectedTotalizado?: number;
  correctedParcializado?: number;
  uncorrectedParcializado?: number;
  caudalPromedio?: number;
  caudalPico?: number;
  fpv?: number; // Factor de compresibilidad
  horaTruncada?: boolean;
  //
  numeroSerieCorrectora?: string | null;
  deveui?: string;
  deviceName?: string;
  modelo?: string;
  //
  idCorrectora?: string;
  idPuntoMedicion?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  idsAgrupaciones?: string[];
  //
  fechaCreacion?: string;

  // Virtuals
  cliente?: import("../tenant/cliente.model").ICliente;
  unidadNegocio?: import("../gas/unidadNegocio/schema").IUnidadNegocio;
  centroOperativo?: import("../gas/centroOperativo/schema").ICentroOperativo;
  localidad?: import("./localidad").ILocalidad;
  cuenca?: import("./cuenca").ICuenca;
  correctora?: ICorrectora;
  puntoMedicion?: IPuntoMedicion;
  grupos?: import("./grupo").IGrupo[];
  agrupaciones?: import("../gas/agrupacion/schema").IAgrupacion[];
}

////// CREATE
export const CreateRegistroSchema = RegistroSchema.omit({
  _id: true,
  cliente: true,
  unidadNegocio: true,
  centroOperativo: true,
  localidad: true,
  cuenca: true,
  correctora: true,
  puntoMedicion: true,
  grupos: true,
  agrupaciones: true,
});
type OmitirCreate =
  | "_id"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad"
  | "cuenca"
  | "correctora"
  | "puntoMedicion"
  | "grupos"
  | "agrupaciones";
export interface ICreateRegistro extends Omit<
  Partial<IRegistro>,
  OmitirCreate
> {}

////// UPDATE
export const UpdateRegistroSchema = CreateRegistroSchema;
type OmitirUpdate =
  | "_id"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad"
  | "cuenca"
  | "correctora"
  | "puntoMedicion"
  | "grupos"
  | "agrupaciones";
export interface IUpdateRegistro extends Omit<
  Partial<IRegistro>,
  OmitirUpdate
> {}
