import { ICliente, IUsuario } from "../tenant";
import { TipoAlerta, TipoEnvio } from "./envio-sms";
import { IScada } from "./scada";

export interface IConfigNotificacion {
  _id?: string;
  //
  fechaCreacion?: string;
  tipoEnvio?: TipoEnvio;
  tipoAlerta?: TipoAlerta;
  idsUsuarios?: string[];
  tag?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idGrupo?: string;
  idAgrupacion?: string;
  idLocalidad?: string;
  // Populate
  cliente?: ICliente;
  scada?: IScada;
  usuarios?: IUsuario[];
}

////// CREATE/UPDATE
type Omitir = "_id" | "cliente" | "scada" | "usuarios";
export interface ICreateConfigNotificacion
  extends Omit<Partial<IConfigNotificacion>, Omitir> {}

export interface IUpdateConfigNotificacion
  extends Omit<Partial<IConfigNotificacion>, Omitir> {}
