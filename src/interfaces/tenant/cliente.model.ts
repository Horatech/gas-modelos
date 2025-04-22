import { TipoDispositivo } from "../auxiliares";
import { IImagenesCliente } from "./cliente.dto";
import { IIntegracion } from "./integraciones";

export interface IApn {
  apn?: string;
  usuario?: string;
  password?: string;
}

export interface IConfigCliente {
  apns?: IApn[];
  usaLlm?: boolean;
  tokensMensualesDisponibles?: number;
  maximoUsuariosUsanLlm?: number;
  twilio?: {
    phoneSms?: string;
    phoneWhatsapp?: string;
    phoneLlamada?: string;
    accSid?: string;
    authToken?: string;
    msgServiceSid?: string;
    statusCallback?: string;
  };
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
