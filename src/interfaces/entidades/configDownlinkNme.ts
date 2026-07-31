import { ICliente } from "../tenant/cliente.model";
import { ILoraServer } from "../tenant/lora-server.model";
import { IDispositivo } from "./dispositivo";

/**
 * Control y auditoría del downlink de configuración de un NME.
 *
 * Cada documento representa el `reporte_mask` que se pidió aplicar a un equipo y
 * para el cual se programa un SET_CONFIG (fPort 100, 4 bytes) hacia ChirpStack.
 * Clave lógica: `deveui` — hay a lo sumo un downlink de config vigente por
 * equipo, el último upsert pisa al anterior.
 *
 * Dos productores lo crean: el fan-out de gas-api-cliente al guardar la
 * Configuración Global, y la pasada de alta de gas-cron para un equipo nuevo.
 *
 * **La existencia del documento es lo que hace que esto sea de un solo tiro.**
 * La pasada de alta solo toma equipos que NUNCA tuvieron control: si un técnico
 * cambió el mask por BLE, el control ya existe y no se lo vuelve a pisar.
 */
export type EstadoConfigDownlinkNme =
  | "pendiente" // fan-out hecho, aún no encolado
  | "esperando_equipo" // sin tz conocida; NO consume intentos
  | "encolado" // job creado en la cola de downlinks
  | "enviado" // downlink en ChirpStack, esperando el fPort 100 de respuesta
  | "confirmado" // TERMINAL: el reporteMask observado iguala al solicitado
  | "agotado" // TERMINAL: se alcanzó el tope de intentos
  | "error"; // falló el último enqueue; se reintenta

export interface IIntentoConfigDownlinkNme {
  fecha?: string; // ISO del intento
  resultado?: "ok" | "error";
  error?: string; // mensaje si resultado = 'error'
}

export interface IConfigDownlinkNme {
  _id?: string;
  //
  deveui?: string;
  deviceName?: string;
  //
  // Config solicitada (la que viaja en el downlink)
  reporteMask?: number;
  /**
   * tz con la que se armó el downlink. El SET_CONFIG de 4 B lleva tz + mask
   * juntos: no hay forma de mandar solo el mask. Se reenvía la que el propio
   * equipo reportó por fPort 100.
   */
  tz?: number;
  //
  estado?: EstadoConfigDownlinkNme;
  intentos?: number;
  ultimoIntento?: string;
  historialIntentos?: IIntentoConfigDownlinkNme[];
  //
  fechaSolicitud?: string;
  fechaEnviado?: string;
  fechaConfirmado?: string;
  //
  idLoraServer?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  //
  fechaCreacion?: string;
  fechaActualizacion?: string;
  // Populate
  cliente?: ICliente;
  dispositivo?: IDispositivo;
  loraServer?: ILoraServer;
}

////// CREATE
type OmitirCreate = "_id" | "cliente" | "dispositivo" | "loraServer";
export interface ICreateConfigDownlinkNme
  extends Omit<Partial<IConfigDownlinkNme>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = "_id" | "cliente" | "dispositivo" | "loraServer";
export interface IUpdateConfigDownlinkNme
  extends Omit<Partial<IConfigDownlinkNme>, OmitirUpdate> {}
