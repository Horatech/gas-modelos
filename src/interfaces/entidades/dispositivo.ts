import { z } from "zod";
import { CoordenadasSchema, ICoordenadas } from "../auxiliares/coordenadas";
import { TipoDispositivoGasSchema, TipoDispositivoGas } from "../auxiliares/tipoDispositivo";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { ClienteSchema } from "../tenant/cliente.model";
import { LoraServerSchema } from "../tenant/lora-server.model";
import { LoteDispositivoSchema } from "../tenant/loteDispositivo.model";
import { LocalidadSchema } from "./localidad";
import { IUltimaRecepcion, UltimaRecepcionSchema } from "./recepcion-uplink";
import type { IAlerta } from "./alerta";
import type { IRegistro } from "./registro";

export const TipoConectividadSchema = z.enum(["4G", "LORA"]);
export type TipoConectividad = z.infer<typeof TipoConectividadSchema>;

// Populates intra-SCC (IAlerta, IRegistro) como z.custom (import type-only):
// un schema real acá arrastra el shape completo del ciclo Dispositivo <->
// Registro/Correctora/PuntoMedicion/... y revienta la resolución en runtime
// (ver CLAUDE.md, "De solo tipos a schemas Zod").
export const DispositivoSchema = z.object({
  // Info autogenerada
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  // Tenant
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
  // Info de carga
  deveui: z.string().optional(),
  deviceName: z.string().optional(),
  appkey: z.string().optional(),
  conectividad: TipoConectividadSchema.optional(),
  idLote: z.string().optional(),
  tipoDispositivo: TipoDispositivoGasSchema.optional(),
  // Solo con conectividad Lora
  idLoraServer: z.string().optional(),
  // Info de comunicacion
  /** @deprecated sin escritor en LoRa: usar `ultimaRecepcion.maxSnr` */
  snr: z.number().optional(),
  /** @deprecated sin escritor en LoRa: usar `ultimaRecepcion.maxRssi` */
  rssi: z.number().optional(),
  /** @deprecated sin escritor: usar `ultimaRecepcion.adr` */
  adr: z.boolean().optional(),
  /** @deprecated sin escritor: usar `ultimaRecepcion.dr` */
  dr: z.number().optional(),
  fechaUltimaComunicacion: z.string().optional(),
  /**
   * Estado del enlace en el último uplink recibido, con el detalle por gateway.
   * Lo escribe gas-entrada-lora (único punto por donde pasan todos los uplinks
   * LoRa de los tres network servers). Sólo dispositivos con conectividad LORA.
   */
  ultimaRecepcion: UltimaRecepcionSchema.optional(),
  // Otra info
  firmware: z.string().optional(),
  versionHardware: z.string().optional(), // Versión de hardware (ej: "v1", "v3" para NUC con/sin GPIO)
  serieTransmisor: z.string().optional(), // serie del transmisor (integración externa, p. ej. TNS_NRO_SERIE)
  codigoExternoTransmisor: z.string().optional(), // TNS_ID del sistema externo (idempotencia de la ingesta)
  ubicacion: CoordenadasSchema.optional(),
  // Info especifica de cada tipo de dispositivo
  config: z.record(z.string(), z.any()).optional(),
  ultimoReporte: z.custom<IRegistro>().optional(),
  ultimaAlerta: z.custom<IAlerta>().optional(),
  // Virtuals
  cliente: ClienteSchema.optional(),
  lote: LoteDispositivoSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
  loraServer: LoraServerSchema.optional(),
});

/**
 * Interface hand-written (mismo shape que el schema): al ser parte del SCC de
 * IDispositivo no usa z.infer, para no arrastrar el ciclo al declaration emit.
 */
export interface IDispositivo {
  _id?: string;
  fechaCreacion?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  deveui?: string;
  deviceName?: string;
  appkey?: string;
  conectividad?: TipoConectividad;
  idLote?: string;
  tipoDispositivo?: TipoDispositivoGas;
  idLoraServer?: string;
  /** @deprecated sin escritor en LoRa: usar `ultimaRecepcion.maxSnr` */
  snr?: number;
  /** @deprecated sin escritor en LoRa: usar `ultimaRecepcion.maxRssi` */
  rssi?: number;
  /** @deprecated sin escritor: usar `ultimaRecepcion.adr` */
  adr?: boolean;
  /** @deprecated sin escritor: usar `ultimaRecepcion.dr` */
  dr?: number;
  fechaUltimaComunicacion?: string;
  ultimaRecepcion?: IUltimaRecepcion;
  firmware?: string;
  versionHardware?: string;
  serieTransmisor?: string;
  codigoExternoTransmisor?: string;
  ubicacion?: ICoordenadas;
  config?: Record<string, any>;
  ultimoReporte?: IRegistro;
  ultimaAlerta?: IAlerta;
  cliente?: import("../tenant/cliente.model").ICliente;
  lote?: import("../tenant/loteDispositivo.model").ILoteDispositivo;
  unidadNegocio?: import("../gas/unidadNegocio/schema").IUnidadNegocio;
  centroOperativo?: import("../gas/centroOperativo/schema").ICentroOperativo;
  localidad?: import("./localidad").ILocalidad;
  loraServer?: import("../tenant/lora-server.model").ILoraServer;
}

////// CREATE
export const CreateDispositivoSchema = DispositivoSchema.omit({
  _id: true,
  centroOperativo: true,
  localidad: true,
  cliente: true,
});
type OmitirCreate = "_id" | "unidadDeNegocio" | "centroOperativo" | "localidad" | "cliente";
export interface ICreateDispositivo
  extends Omit<Partial<IDispositivo>, OmitirCreate> {}

////// UPDATE
export const UpdateDispositivoSchema = CreateDispositivoSchema;
type OmitirUpdate = "_id" | "unidadDeNegocio" | "centroOperativo" | "localidad" | "cliente";
export interface IUpdateDispositivo
  extends Omit<Partial<IDispositivo>, OmitirUpdate> {}
