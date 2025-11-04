import { TipoDispositivo } from "../auxiliares";
import { ModeloCorrectora, modelosCorrectoras } from "../entidades";
import { IImagenesCliente } from "./cliente.dto";
import { IIntegracion } from "./integraciones";

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

export interface IConfigCliente {
  apns?: IApn[];
  usaLlm?: boolean;
  tokensMensualesDisponibles?: number;
  maximoUsuariosUsanLlm?: number;
  twilio?: IConfigTwilio;
  sincHoraria?: Partial<Record<ModeloCorrectora, IConfigSincHoraria>>;
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
