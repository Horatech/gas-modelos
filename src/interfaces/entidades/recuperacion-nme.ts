import { ICliente } from '../tenant/cliente.model';
import { ILoraServer } from '../tenant/lora-server.model';
import { IDispositivo } from './dispositivo';

/**
 * Control y auditoría de la recuperación de registros faltantes de un NME.
 *
 * Cada documento representa un DÍA (UTC) de un dispositivo que se detectó
 * incompleto en la colección `registrosmedidorelectrico` y para el cual se
 * programa un downlink GET_HISTORIC (fPort 108) hacia ChirpStack.
 *
 * Sirve a la vez como:
 *  - control anti-loop (tope de `intentos`; días > 30 días quedan fuera del
 *    buffer del device y no se piden),
 *  - registro de auditoría consultable (qué se pidió, cuándo, con qué resultado
 *    y estado final).
 *
 * Clave lógica: (`deveui`, `dia`).
 */
export type EstadoRecuperacionNme =
  | 'pendiente' // hueco detectado, aún no encolado
  | 'encolado' // job creado en la cola de downlinks
  | 'enviado' // downlink GET_HISTORIC enviado a ChirpStack
  | 'recuperado' // el día quedó completo en registrosmedidorelectrico
  | 'sin_datos' // el equipo confirmó que ese día no tiene registros (fPort 34
  //               motivo 1). TERMINAL: no re-pedir nunca. Distinto de 'agotado':
  //               acá el dato NO EXISTE, no es que no lo pudimos traer.
  | 'fecha_invalida' // pedimos un día futuro (fPort 34 motivo 3). TERMINAL:
  //                    reintentar repite el error. Distinto de 'error', que es un
  //                    fallo TRANSITORIO del enqueue y sí se reintenta.
  | 'agotado' // se alcanzó el tope de intentos sin recuperar
  | 'error'; // último enqueue falló (transitorio, se reintenta)

export interface IIntentoRecuperacionNme {
  fecha?: string; // ISO del intento
  resultado?: 'ok' | 'error';
  error?: string; // mensaje si resultado = 'error'
  /**
   * Motivo del uplink fPort 34 que cerró el intento, si lo hubo:
   * 1 = día terminado sin registros · 2 = día en curso · 3 = fecha futura.
   * Con `resultado: 'ok'` (el intercambio funcionó; lo que no hay es dato).
   */
  motivo?: number;
}

export interface IRecuperacionNme {
  _id?: string;
  //
  deveui?: string;
  deviceName?: string;
  dia?: string; // ISO 00:00:00.000Z del día (UTC) a recuperar
  //
  estado?: EstadoRecuperacionNme;
  intentos?: number; // contador de downlinks enviados (tope configurable)
  ultimoIntento?: string; // ISO del último envío
  historialIntentos?: IIntentoRecuperacionNme[]; // acotado al tope de intentos
  //
  fechaDeteccion?: string; // ISO en que se detectó el hueco
  fechaRecuperado?: string; // ISO en que se confirmó el día completo
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
type OmitirCreate = '_id' | 'cliente' | 'dispositivo' | 'loraServer';
export interface ICreateRecuperacionNme
  extends Omit<Partial<IRecuperacionNme>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = '_id' | 'cliente' | 'dispositivo' | 'loraServer';
export interface IUpdateRecuperacionNme
  extends Omit<Partial<IRecuperacionNme>, OmitirUpdate> {}
