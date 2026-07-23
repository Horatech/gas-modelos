import { ICliente } from "../tenant/cliente.model";
import { ILoraServer } from "../tenant/lora-server.model";
import { IDispositivo } from "./dispositivo";

/**
 * Control y auditoría del downlink de configuración de un medidor de agua EUW300.
 *
 * Cada documento representa la configuración de reporte (hora del reporte diario
 * + intervalo de comunicación) que se solicitó aplicar a un EUW300 y para la cual
 * se programa un downlink SET_CONFIG (trama DL/T645) hacia ChirpStack.
 *
 * A diferencia del control de recuperación NME (uno por día), acá la clave lógica
 * es solo `deveui`: hay a lo sumo un downlink de config vigente por dispositivo
 * (el último upsert pisa al anterior). gas-api-cliente crea/actualiza el documento
 * en estado `pendiente` cuando el usuario guarda la config desde la web; gas-cron
 * lo detecta, encola y envía el downlink de forma controlada (rate-limited).
 *
 * Sirve a la vez como control anti-loop (tope de `intentos`) y como auditoría
 * consultable (qué se pidió, cuándo y con qué resultado).
 */
export type EstadoConfigDownlinkEuw300 =
  | "pendiente" // config guardada desde la web, aún no encolada
  | "encolado" // job creado en la cola de downlinks
  | "enviado" // downlink SET_CONFIG enviado a ChirpStack
  | "agotado" // se alcanzó el tope de intentos sin éxito
  | "error"; // último enqueue falló

export interface IIntentoConfigDownlinkEuw300 {
  fecha?: string; // ISO del intento
  resultado?: "ok" | "error";
  error?: string; // mensaje si resultado = 'error'
}

export interface IConfigDownlinkEuw300 {
  _id?: string;
  //
  deveui?: string;
  deviceName?: string;
  deviceMeterNumber?: string; // S/N (14 dígitos BCD) usado para armar la trama
  //
  // Config solicitada (la que viaja en el downlink)
  horaReporteDiario?: string; // formato "HH:mm"
  intervaloComunicacion?: number; // minutos entre reportes
  //
  estado?: EstadoConfigDownlinkEuw300;
  intentos?: number; // contador de downlinks enviados (tope configurable)
  ultimoIntento?: string; // ISO del último envío
  historialIntentos?: IIntentoConfigDownlinkEuw300[]; // acotado al tope de intentos
  //
  fechaSolicitud?: string; // ISO en que el usuario guardó la config
  fechaEnviado?: string; // ISO en que se envió el downlink a ChirpStack
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
export interface ICreateConfigDownlinkEuw300
  extends Omit<Partial<IConfigDownlinkEuw300>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = "_id" | "cliente" | "dispositivo" | "loraServer";
export interface IUpdateConfigDownlinkEuw300
  extends Omit<Partial<IConfigDownlinkEuw300>, OmitirUpdate> {}
