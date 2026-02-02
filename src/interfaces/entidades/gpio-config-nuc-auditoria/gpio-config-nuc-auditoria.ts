import { TipoDispositivo } from "../../auxiliares";
import { ICliente } from "../../tenant";
import {
  IConfigDispositivo,
  TipoEdgeDeteccion,
  TipoEntradaDigital,
} from "../config-dispositivo";
import { IDispositivo } from "../dispositivo";

// Configuración GPIO (NUC v2.0)
// in1Type?: TipoEntradaDigital;
// in1EdgeType?: TipoEdgeDeteccion; // Tipo de detección de flanco para IN1
// in2Type?: TipoEntradaDigital;
// in2EdgeType?: TipoEdgeDeteccion; // Tipo de detección de flanco para IN2
// outputActivo?: boolean;
// timestampActivacion?: number; // Segundos desde 00:00:00 del día
// tiempoActivacion?: number; // Segundos que debe estar activada

export interface IAuditoriaConfigGpio {
  usuarioId: string;
  nombreUsuario: string;
}

export interface ITimelineEntry {
  fechaInicio: string; // Fecha del inicio del cambio (ISO 8601) - NO opcional para garantizar búsquedas
  fechaFin?: string; // Si es null/undefined, esta configuración sigue activa para este canal
  activo: boolean; // true si es la configuración actual activa (fechaFin == null), facilita consultas

  type: TipoEntradaDigital; // El nuevo tipo asignado
  edgeType?: TipoEdgeDeteccion; // El nuevo tipo de detección
  // Metadatos de la auditoría (El "Quién")
  auditoria?: IAuditoriaConfigGpio;
}

export interface IGpioConfigNucAuditoria {
  // Info autogenerada
  _id?: string;
  fechaCreacion?: string;
  // El historial ordenado de todos los cambios que sufrieron las configuraciones GPIO del NUC
  // Con auditoría completa de usuario que hizo el cambio y cuándo
  // HISTORIALES INDEPENDIENTES
  // Esto permite que IN1 tenga una fecha de inicio y IN2 otra totalmente distinta
  historialIn1?: ITimelineEntry[];
  historialIn2?: ITimelineEntry[];

  // Guardamos tambien un currentConfig para consultas rápidas
  currentConfigIn1?: ITimelineEntry;
  currentConfigIn2?: ITimelineEntry;

  // Tenant
  idCliente?: string;
  idDispositivo: string;
  idConfigDispositivo: string; // El _id de IConfigDispositivo que disparó este cambio
  tipoDispositivo?: TipoDispositivo;
  // populate
  cliente?: ICliente;
  dispositivo?: IDispositivo;
  configDispositivo?: IConfigDispositivo;
}

////// CREATE
type OmitirCreate = "_id" | "dispositivo" | "cliente" | "configDispositivo";
export interface ICreateGpioConfigNucAuditoria extends Omit<
  Partial<IGpioConfigNucAuditoria>,
  OmitirCreate
> {}

////// UPDATE
type OmitirUpdate = "_id" | "dispositivo" | "cliente" | "configDispositivo";
export interface IUpdateGpioConfigNucAuditoria extends Omit<
  Partial<IGpioConfigNucAuditoria>,
  OmitirUpdate
> {}
