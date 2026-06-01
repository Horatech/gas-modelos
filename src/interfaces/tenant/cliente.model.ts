import { TipoDispositivo } from "../auxiliares";
import { ModeloCorrectora, modelosCorrectoras } from "../entidades";
import { IImagenesCliente } from "./cliente.dto";
import { IIntegracion } from "./integraciones";
import { Division } from "./usuario/permiso";

export type TemplatesWhatsapp =
  | "Alerta de presión"
  | "Punto de medición en mantenimiento"
  | "Sensor de presión desconectado"
  | "Error de comunicación de alarma"
  | "Scada valor fuera de límite"
  | "Scada valor fuera de límite genérico"
  | "Scada valor reestablecido"
  | "Scada booleano alarma"
  | "Scada booleano reestablecido"
  | "Scada error de comunicación con servidor"
  | "Scada cambio de límites por fuera"
  | "Equipos fuera de línea"
  | "Batería baja";

export type TemplatesMail =
  | TemplatesWhatsapp
  | "Nuevo usuario"
  | "Reset de contraseña"
  | "Cambio de contraseña";

export interface IApn {
  apn?: string;
  usuario?: string;
  password?: string;
}

export interface IConfigTwilio {
  //Mensajes y llamadas
  accSid?: string;
  authToken?: string;
  msgServiceSid?: string;
  statusCallback?: string;
  phoneSms?: string;
  phoneWhatsapp?: string;
  phoneLlamada?: string;
  templatesWhatsapp?: {
    [K in TemplatesWhatsapp]?: string;
  };

  //Email
  senderEmail?: string;
  senderName?: string;
  senderAddress?: string;
  senderCity?: string;
  senderState?: string;
  senderZip?: number;
  sendGridApiKey?: string;
  templatesMail?: {
    [K in TemplatesMail]?: string;
  };
}

export interface IConfigSincHoraria {
  activo?: boolean;
  desfaseMinimo?: number;
  desfaseMaximo?: number;
}

export type ColumnaVistaPersonalizadaCorrectoras =
  | "temperatura"
  | "presion"
  | "volumenBaseTotalizado"
  | "volumenCorregidoTotalizado"
  | "volumenBaseHorario"
  | "volumenCorregidoHorario"
  | "caudalPico"
  | "caudalPromedio"
  | "fpv";

export type StatVistaPersonalizada = "min" | "max" | "avg";

export interface IVistaPersonalizadaColumna {
  key: ColumnaVistaPersonalizadaCorrectoras;
  /** Nombre custom de la columna; si no se define usa el label por defecto */
  label?: string;
  /**
   * Sólo aplica a columnas independientes (temperatura, presión, caudales, fpv)
   * en agrupación por día. Define cuáles de min/max/avg mostrar.
   * Si no se define o queda vacío, se muestran los tres.
   */
  stats?: StatVistaPersonalizada[];
}

export interface IVistaPersonalizadaFecha {
  /** true: fecha y hora en 2 columnas; false (default): una sola columna combinada */
  separar?: boolean;
  /** Formato de la columna combinada (separar=false). Ej: "YYYY-MM-DD HH:mm:ss" */
  formato?: string;
  /** Formato de la columna fecha (separar=true). Ej: "YYYY-MM-DD" */
  formatoFecha?: string;
  /** Formato de la columna hora (separar=true). Ej: "HH:mm:ss" */
  formatoHora?: string;
  /** Nombre custom de la columna combinada */
  label?: string;
  /** Nombre custom de la columna fecha (separar=true) */
  labelFecha?: string;
  /** Nombre custom de la columna hora (separar=true) */
  labelHora?: string;
}

export interface IVistaPersonalizadaCorrectoras {
  activo: boolean;
  columnas: IVistaPersonalizadaColumna[];
  agrupacion: "hora" | "dia";
  tipoDia?: "gas" | "calendario";
  fecha?: IVistaPersonalizadaFecha;
}

export interface IVistasPersonalizadasPorDivision {
  Correctoras?: IVistaPersonalizadaCorrectoras;
}

export type DivisionConVistaPersonalizada = Extract<Division, "Correctoras">;

export interface IConfigCliente {
  apns?: IApn[];
  usaLlm?: boolean;
  tokensMensualesDisponibles?: number;
  maximoUsuariosUsanLlm?: number;
  twilio?: IConfigTwilio;
  sincHoraria?: Partial<Record<ModeloCorrectora, IConfigSincHoraria>>;
  nucV3?: boolean;
  /**
   * Si es true, los registros se insertan con upsert, es decir, si ya existe un registro con el mismo
   * identificador, se sobreescribe. Si es false o no está definido, los registros duplicados se ignoran.
   */
  sobreEscribirRegistrosNuc?: boolean;

  /**
   * A nivel global genera alertas de batería baja para los dispositivos SML con bateria menor al valor definido
   */
  valorAlarmaBateriaSml?: number;

  /**
   * Si es true, los usuarios del cliente con rol TecnicoCampo o Administrador pueden crear dispositivos
   * vía el flujo de la app móvil (POST /dispositivos en gas-api-cliente). Default: false.
   * Pensado para habilitar la alta de medidores ML107A en campo, leyendo las keys LoRaWAN por NFC.
   */
  puedeCrearDispositivos?: boolean;

  /**
   * Vista personalizada del tab de registros, por división. Si activo, agrega un tab al inicio del
   * detalle del punto que muestra los mismos registros con columnas/agrupación configuradas.
   */
  vistasPersonalizadas?: IVistasPersonalizadasPorDivision;
}

export interface ICliente {
  _id?: string;
  fechaCreacion?: string;
  activo?: boolean;
  nombre?: string;
  admin?: boolean;
  imagenes?: IImagenesCliente;
  tiposDispositivo?: TipoDispositivo[];
  integraciones?: IIntegracion[];
  config?: IConfigCliente;
}
