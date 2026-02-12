import { TipoDispositivo } from "../../auxiliares";
import { ICliente } from "../../tenant";
import {
  IConfigDispositivo,
  TipoEdgeDeteccion,
  TipoEntradaDigital,
} from "../config-dispositivo";
import { IDispositivo } from "../dispositivo";

// Metadatos de auditoría (sin cambios)
export interface IAuditoriaConfigGpio {
  usuarioId: string;
  nombreUsuario: string;
}

// Nueva interfaz: Cada documento es una entrada individual de timeline
export interface IGpioConfigNucAuditoria {
  _id?: string; // ObjectId generado por MongoDB
  fechaCreacion?: string; // Fecha de creación de esta entrada (opcional)

  // Campos de timeline (de ITimelineEntry)
  fechaInicio: string; // Fecha del inicio del cambio (ISO 8601) - NO opcional
  fechaFin?: string; // Si es null/undefined, esta configuración sigue activa
  activo: boolean; // true si es la configuración actual activa (fechaFin == null)
  type: TipoEntradaDigital; // El tipo asignado
  edgeType?: TipoEdgeDeteccion; // Tipo de detección
  auditoria?: IAuditoriaConfigGpio; // Metadatos de auditoría

  // Nuevo campo para distinguir canal
  canal: "IN1" | "IN2"; // Indica el canal GPIO

  // Tenant y referencias (sin cambios)
  idCliente?: string;
  idDispositivo: string;
  idConfigDispositivo?: string; // El _id de IConfigDispositivo que disparó este cambio
  tipoDispositivo?: TipoDispositivo;

  // Populate (sin cambios)
  cliente?: ICliente;
  dispositivo?: IDispositivo;
  configDispositivo?: IConfigDispositivo;
}

// CREATE: Omitir campos autogenerados
type OmitirCreate = "_id" | "dispositivo" | "cliente" | "configDispositivo";
export interface ICreateGpioConfigNucAuditoria extends Omit<
  Partial<IGpioConfigNucAuditoria>,
  OmitirCreate
> {}

// UPDATE: Similar, pero parcial
type OmitirUpdate = "_id" | "dispositivo" | "cliente" | "configDispositivo";
export interface IUpdateGpioConfigNucAuditoria extends Omit<
  Partial<IGpioConfigNucAuditoria>,
  OmitirUpdate
> {}
