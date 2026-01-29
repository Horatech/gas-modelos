import { TipoDispositivo } from "../../auxiliares";
import { ICliente } from "../../tenant";
import { IDispositivo } from "../dispositivo";

export interface ITimelineEntry {
  // Rango de validez de esta configuración específica
  fechaInicio: string;
  fechaFin?: string; // Si es null, es la configuración activa actualmente

  // Datos técnicos (Snapshot de lo que importa para los pulsos)
  configSnapshot: {
    in1: { tipo: TipoEntradaDigital; edge: TipoEdgeDeteccion };
    in2: { tipo: TipoEntradaDigital; edge: TipoEdgeDeteccion };
  };

  // Metadatos de la auditoría (El "Quién")
  auditoria: {
    usuarioId: string;
    nombreUsuario: string;
    origen: "WEB" | "APP" | "LOCAL" | "API";
    motivo?: string;
    idConfigReferencia: string; // El _id de IConfigDispositivo que disparó este cambio
  };
}

export interface gpioConfigNucAuditoria {
  // Info autogenerada
  _id?: string;
  fechaCreacion?: string;
  // El historial ordenado de todos los cambios que sufrieron las configuraciones GPIO del NUC
  // Con auditoría completa de usuario que hizo el cambio y cuándo
  timelineConfig: ITimelineEntry[];

  // Tenant
  idCliente?: string;
  idDispositivo: string;
  tipoDispositivo?: TipoDispositivo;
  // populate
  cliente?: ICliente;
  dispositivo?: IDispositivo;
}
