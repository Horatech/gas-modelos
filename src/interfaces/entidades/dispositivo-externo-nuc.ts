import { z } from "zod";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { ClienteSchema } from "../tenant/cliente.model";
import { LocalidadSchema } from "./localidad";
import type { IAlerta } from "./alerta";
import type { IDispositivo } from "./dispositivo";
import type { IReporte } from "./reporte";

export const TipoInputDispositivoExternoSchema = z.enum([
  "Alarma",
  "Contador",
  "Testigo",
  "Estado",
]);
export type TipoInputDispositivoExterno = z.infer<typeof TipoInputDispositivoExternoSchema>;

// Populates intra-SCC (IAlerta, IDispositivo, IReporte) como z.custom: ver
// CLAUDE.md, "De solo tipos a schemas Zod".
export const DispositivoExternoNucSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
  identificador: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  numeroSerie: z.string().optional(),
  deveui: z.string().optional(),
  fechaAsignacionDispositivo: z.string().nullable().optional(),
  usaInput1: z.boolean().optional(),
  nombreInput1: z.string().optional(),
  factorCorreccionInput1: z.number().optional(),
  valorInicialInput1: z.number().optional(),
  usaInput2: z.boolean().optional(),
  nombreInput2: z.string().optional(),
  factorCorreccionInput2: z.number().optional(),
  valorInicialInput2: z.number().optional(),
  usaOutput1: z.boolean().optional(),
  ultimoReporte: z.custom<IReporte>().optional(),
  ultimaAlerta: z.custom<IAlerta>().optional(),
  // Virtuals
  dispositivo: z.custom<IDispositivo>().optional(),
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
});

/**
 * Interface hand-written (mismo shape que el schema): parte del SCC de
 * IDispositivo, no usa z.infer.
 */
export interface IDispositivoExternoNuc {
  // Info autogenerada
  _id?: string;
  fechaCreacion?: string;
  // Tenant
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;

  // Info de carga
  identificador?: string; // Identificador del dispositivo externo (ej: "Medidor de presión del pozo 1")
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  deveui?: string; // deveui del nuc asignado al dispositivo externo
  fechaAsignacionDispositivo?: string | null; // Fecha real de instalación del nuc en este dispositivo externo
  // Input 1
  usaInput1?: boolean; // Si el dispositivo externo reporta un valor de input1
  // tipoInput1?: TipoInput; // Esto se define en el dispositivo
  nombreInput1?: string; // Nombre personalizado para el input1 (ej: "Alarma de fuga")
  factorCorreccionInput1?: number; // Factor de corrección para el input1 (multiplicador para convertir pulsos en consumo o valor real, aplica cuando el tipo es "Contador")
  valorInicialInput1?: number; // Valor inicial para el input1 (ej: lectura del contador al momento de asignar el dispositivo, aplica cuando el tipo es "Contador")
  // Input 2
  usaInput2?: boolean; // Si el dispositivo externo reporta un valor de input2
  // tipoInput2?: TipoInput; // Esto se define en el dispositivo
  nombreInput2?: string; // Nombre personalizado para el input2 (ej: "Contador de eventos")
  factorCorreccionInput2?: number; // Factor de corrección para el input2 (multiplicador para convertir pulsos en consumo o valor real, aplica cuando el tipo es "Contador")
  valorInicialInput2?: number; // Valor inicial para el input2 (ej: lectura del contador al momento de asignar el dispositivo, aplica cuando el tipo es "Contador")
  // Output
  usaOutput1?: boolean; // Si el dispositivo externo tiene un valor de output1 que se puede controlar
  // horaActivacionOutput1?: number; // Segundos a partir de las 00:00 del dia en que se activa el output1 (ej: 3600 para activar a la 1am) // Se define en el dispositivo
  // tiempoActivacionOutput1?: number; // Tiempo en minutos que se mantiene activo el output1 al activarse (ej: 1) // Se define en el dispositivo

  ultimoReporte?: IReporte;
  ultimaAlerta?: IAlerta;

  // Virtuals
  dispositivo?: IDispositivo; // Vinculacion al dispositivo mediante el deveui
  cliente?: import("../tenant/cliente.model").ICliente;
  unidadNegocio?: import("../gas/unidadNegocio/schema").IUnidadNegocio;
  centroOperativo?: import("../gas/centroOperativo/schema").ICentroOperativo;
  localidad?: import("./localidad").ILocalidad;
}

////// CREATE
export const CreateDispositivoExternoNucSchema = DispositivoExternoNucSchema.omit({
  _id: true,
  dispositivo: true,
  cliente: true,
  centroOperativo: true,
  localidad: true,
});
type OmitirCreate =
  | "_id"
  | "dispositivo"
  | "cliente"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad";
export interface ICreateDispositivoExternoNuc extends Omit<
  Partial<IDispositivoExternoNuc>,
  OmitirCreate
> {}

////// UPDATE
export const UpdateDispositivoExternoNucSchema = CreateDispositivoExternoNucSchema;
type OmitirUpdate =
  | "_id"
  | "dispositivo"
  | "cliente"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad";
export interface IUpdateDispositivoExternoNuc extends Omit<
  Partial<IDispositivoExternoNuc>,
  OmitirUpdate
> {}
