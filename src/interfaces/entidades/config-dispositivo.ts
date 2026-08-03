import { z } from "zod";
import { TipoDispositivoGasSchema, TipoDispositivoGas } from "../auxiliares/tipoDispositivo";
import type { IDispositivo } from "./dispositivo";
import type { IScada } from "./scada";

export const TipoEntradaDigitalSchema = z.enum([
  "CONTADOR",
  "FLAG",
  "ALERTA",
  "EN_DESUSO",
]);
export type TipoEntradaDigital = z.infer<typeof TipoEntradaDigitalSchema>;

export const TipoEdgeDeteccionSchema = z.enum([
  "NONE", // 0 - Sin detección
  "FALLING", // 1 - Flanco descendente
  "RISING", // 2 - Flanco ascendente
  "BOTH", // 3 - Ambos flancos
  "LOW", // 4 - Nivel bajo (continuo)
  "HIGH", // 5 - Nivel alto (continuo)
]);
export type TipoEdgeDeteccion = z.infer<typeof TipoEdgeDeteccionSchema>;

export const ConfigDispositivoNUC4GSchema = z.object({
  horaInicio: z.number().optional(),
  modoOperacion: z.enum(["REG1_DIARIO", "REG24_DIARIO", "REG8_8HORAS"]).optional(),
  modoEnv: z.enum(["TEST", "PROD"]).optional(),
  claveMercury: z.string().optional(),
  modoRegistros: z.enum(["REG_TOTALIZADOS", "REG_PARCIALES"]).optional(),
  nsa: z.number().optional(),
  syncHora: z.boolean().optional(),
  firmwareNuc: z.string().optional(),
  iccid: z.number().optional(),
  apiVersion: z.string().optional(),
  operadora: z.string().optional(),
  voltajeBateria: z.number().optional(),
  in1Type: TipoEntradaDigitalSchema.optional(),
  in1EdgeType: TipoEdgeDeteccionSchema.optional(),
  in2Type: TipoEntradaDigitalSchema.optional(),
  in2EdgeType: TipoEdgeDeteccionSchema.optional(),
  outputActivo: z.boolean().optional(),
  timestampActivacion: z.number().optional(),
  tiempoActivacion: z.number().optional(),
  deviceMode: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
  telefono1: z.string().optional(),
  telefono2: z.string().optional(),
  telefono3: z.string().optional(),
});
// Numero de serie de american meter: nsa. Formato teléfono: +54XXXXXXXXXXX
// (13 caracteres). deviceMode: 0 Solo Correctora, 1 Solo I/O, 2 Ambos.
export type IConfigDispositivoNUC4G = z.infer<typeof ConfigDispositivoNUC4GSchema>;

export const ConfigDispositivoNSP4GSchema = z.object({
  limiteMin: z.number().optional(),
  limiteMax: z.number().optional(),
  horaUTC: z.number().optional(),
  horaInicio: z.number().optional(),
  modoEnv: z.enum(["TEST", "PROD"]).optional(),
  modoOperacion: z.enum([
    "REG1_DIARIO",
    "REG24_DIARIO",
    "REG1_1HORA",
    "REG2_2HORAS",
    "REG3_3HORAS",
    "REG4_4HORAS",
    "REG6_6HORAS",
    "REG8_8HORAS",
    "REG12_12HORAS",
  ]).optional(),
  timestampBloqueo: z.number().optional(),
  telefono1: z.string().optional(),
  telefono2: z.string().optional(),
  telefono3: z.string().optional(),
  lugar: z.string().optional(),
  iccid: z.string().optional(),
  apn: z.string().optional(),
  user: z.string().optional(),
  pass: z.string().optional(),
  estadoAPN: z.boolean().optional(),
  operadora: z.string().optional(),
});
export type IConfigDispositivoNSP4G = z.infer<typeof ConfigDispositivoNSP4GSchema>;

export const ConfigDispositivoVeriboxSchema = z.object({
  telefono: z.string().optional(),
  frecuenciaComunicacion: z.number().optional(),
  limiteMin: z.number().optional(),
  limiteMax: z.number().optional(),
  apn: z.string().optional(),
  usuario: z.string().optional(),
  clave: z.string().optional(),
  fechaAplicacion: z.string().optional(),
});
export type IConfigDispositivoVeribox = z.infer<typeof ConfigDispositivoVeriboxSchema>;

export const ConfigDispositivoScadaSchema = z.object({
  limiteHH: z.number().optional(),
  limiteH: z.number().optional(),
  limiteLL: z.number().optional(),
  limiteL: z.number().optional(),
  minimo: z.number().optional(),
  maximo: z.number().optional(),
  textoTrue: z.string().optional(),
  textoFalse: z.string().optional(),
  fechaAplicacion: z.string().optional(),
});
export type IConfigDispositivoScada = z.infer<typeof ConfigDispositivoScadaSchema>;

export const ConfigDispositivoSmlSchema = z.object({
  calibrationDeviceNodeReading: z.number().optional(),
  reportingCycleInterval: z.number().optional(),
  timezone: z.string().optional(),
  ipReporte: z.string().optional(),
  pn: z.number().optional(),
  maximunMeterReading: z.number().optional(),
  reportingRange: z.number().optional(),
  fechaAplicacion: z.string().optional(),
});
export type IConfigDispositivoSml = z.infer<typeof ConfigDispositivoSmlSchema>;

// Populates intra-SCC (IDispositivo, IScada) como z.custom: ver CLAUDE.md,
// "De solo tipos a schemas Zod".
export const ConfigDispositivoSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  fechaCreacion: z.string().optional(),
  fechaAplicacion: z.string().optional(),
  deveui: z.string().optional(),
  tag: z.string().optional(),
  tipo: TipoDispositivoGasSchema.optional(),
  config: z.record(z.string(), z.any()).optional(),
  // Virtuals
  dispositivo: z.custom<IDispositivo>().optional(),
  scada: z.custom<IScada>().optional(),
});

/**
 * Interface hand-written (mismo shape que el schema): parte del SCC de
 * IDispositivo, no usa z.infer.
 */
export interface IConfigDispositivo {
  _id?: string;
  idCliente?: string;
  fechaCreacion?: string;
  fechaAplicacion?: string;
  deveui?: string;
  tag?: string;
  tipo?: TipoDispositivoGas;
  config?: Record<string, any>;
  dispositivo?: IDispositivo;
  scada?: IScada;
}

// CREATE
export const CreateConfigDispositivoSchema = ConfigDispositivoSchema.omit({
  _id: true,
  dispositivo: true,
});
type OmitirCreate = "_id" | "dispositivo";
export interface ICreateConfigDispositivo extends Omit<
  Partial<IConfigDispositivo>,
  OmitirCreate
> {}

// UPDATE
export const UpdateConfigDispositivoSchema = CreateConfigDispositivoSchema;
type OmitirUpdate = "_id" | "dispositivo";
export interface IUpdateConfigDispositivo extends Omit<
  Partial<IConfigDispositivo>,
  OmitirUpdate
> {}
