import { z } from "zod";
import { LocalidadSchema } from "./localidad";
import { DivisionSchema } from "../tenant/usuario/permiso";
import { ClienteSchema } from "../tenant/cliente.model";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import type { ICorrectora } from "./correctora";
import type { IScada } from "./scada";
import type { IPuntoMedicion } from "./punto-medicion";
import type { IUnidadPresion } from "./unidad-presion";
import type { IMedidorResidencial } from "./medidor-residencial";
import type { IMedidorResidencialAgua } from "./medidor-residencial-agua";
import type { IMedidorElectrico } from "./medidor-electrico";

export const EstadoAlertaSchema = z.enum(["Cerrado", "Activo"]);
export type IEstadoAlerta = z.infer<typeof EstadoAlertaSchema>;

export const TipoAlertaSchema = z.enum([
  "Sin Reportar",
  "Valor Alto",
  "Valor Bajo",
  "Fuera de rango",
  "Error de comunicación",
  "Sensor desconectado",
  "Batería baja",
  "Ataque magnético",
  "Alerta de Entrada Digital",
  "Alarma Correctora",
]);
export type ITipoAlerta = z.infer<typeof TipoAlertaSchema>;

export const AlertaInputsNucv2Schema = z.object({
  input: z.union([z.literal(1), z.literal(2)]).optional(),
  smsEnviado: z.boolean().optional(),
  fechaEnvioSms: z.string().optional(),
  errorSms: z.string().optional(),
});
export type IAlertaInputsNucv2 = z.infer<typeof AlertaInputsNucv2Schema>;

export const ValoresAlertaSchema = AlertaInputsNucv2Schema.nullable();
export type IValoresAlerta = z.infer<typeof ValoresAlertaSchema>;

// Populates intra-SCC (IPuntoMedicion, IUnidadPresion, ICorrectora, IScada,
// IMedidorResidencial, IMedidorResidencialAgua, IMedidorElectrico) como
// z.custom: ver CLAUDE.md, "De solo tipos a schemas Zod".
export const AlertaSchema = z.object({
  _id: z.string().optional(),
  deveui: z.string().optional(),
  tag: z.string().optional(),
  deviceName: z.string().optional(),
  firmwareNuc: z.string().optional(),
  apiVersion: z.string().optional(),
  numeroAlerta: z.number().optional(),
  timestamp: z.string().optional(),
  mensaje: z.string().optional(),
  estado: EstadoAlertaSchema.optional(),
  tipo: TipoAlertaSchema.optional(),
  fechaCierre: z.string().optional(),
  division: DivisionSchema.optional(),
  valores: ValoresAlertaSchema.optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
  idPuntoMedicion: z.string().optional(),
  idUnidadPresion: z.string().optional(),
  idCorrectora: z.string().optional(),
  idMedidorResidencial: z.string().optional(),
  idMedidorResidencialAgua: z.string().optional(),
  idMedidorElectrico: z.string().optional(),
  idScada: z.string().optional(),
  idDispositivoExternoNuc: z.string().optional(),
  numeroSerieCorrectora: z.string().nullable().optional(),
  fechaCreacion: z.string().optional(),
  // Virtuals
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
  puntoMedicion: z.custom<IPuntoMedicion>().optional(),
  unidadPresion: z.custom<IUnidadPresion>().optional(),
  correctora: z.custom<ICorrectora>().optional(),
  scada: z.custom<IScada>().optional(),
  medidorResidencial: z.custom<IMedidorResidencial>().optional(),
  medidorResidencialAgua: z.custom<IMedidorResidencialAgua>().optional(),
  medidorElectrico: z.custom<IMedidorElectrico>().optional(),
});

/**
 * Interface hand-written (mismo shape que el schema): parte del SCC de
 * IDispositivo, no usa z.infer.
 */
export interface IAlerta {
  _id?: string;
  deveui?: string;
  tag?: string;
  deviceName?: string;
  firmwareNuc?: string;
  apiVersion?: string;
  numeroAlerta?: number;
  timestamp?: string;
  mensaje?: string;
  estado?: IEstadoAlerta;
  tipo?: ITipoAlerta;
  fechaCierre?: string;
  division?: import("../tenant/usuario/permiso").Division;
  valores?: IValoresAlerta;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idPuntoMedicion?: string;
  idUnidadPresion?: string;
  idCorrectora?: string;
  idMedidorResidencial?: string;
  idMedidorResidencialAgua?: string;
  idMedidorElectrico?: string;
  idScada?: string;
  idDispositivoExternoNuc?: string;
  numeroSerieCorrectora?: string | null;
  fechaCreacion?: string;
  // Virtuals
  cliente?: import("../tenant/cliente.model").ICliente;
  unidadNegocio?: import("../gas/unidadNegocio/schema").IUnidadNegocio;
  centroOperativo?: import("../gas/centroOperativo/schema").ICentroOperativo;
  localidad?: import("./localidad").ILocalidad;
  puntoMedicion?: IPuntoMedicion;
  unidadPresion?: IUnidadPresion;
  correctora?: ICorrectora;
  scada?: IScada;
  medidorResidencial?: IMedidorResidencial;
  medidorResidencialAgua?: IMedidorResidencialAgua;
  medidorElectrico?: IMedidorElectrico;
}

////// CREATE
export const CreateAlertaSchema = AlertaSchema.omit({
  _id: true,
  cliente: true,
  unidadNegocio: true,
  centroOperativo: true,
  localidad: true,
  puntoMedicion: true,
  unidadPresion: true,
  correctora: true,
  scada: true,
  medidorResidencial: true,
  medidorResidencialAgua: true,
  medidorElectrico: true,
});
type OmitirCreate =
  | "_id"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad"
  | "puntoMedicion"
  | "unidadPresion"
  | "correctora"
  | "scada"
  | "medidorResidencial"
  | "medidorResidencialAgua"
  | "medidorElectrico";
export interface ICreateAlerta extends Omit<Partial<IAlerta>, OmitirCreate> {}

////// UPDATE
export const UpdateAlertaSchema = CreateAlertaSchema;
type OmitirUpdate =
  | "_id"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad"
  | "puntoMedicion"
  | "unidadPresion"
  | "correctora"
  | "scada"
  | "medidorResidencial"
  | "medidorResidencialAgua"
  | "medidorElectrico";
export interface IUpdateAlerta extends Omit<Partial<IAlerta>, OmitirUpdate> {}
