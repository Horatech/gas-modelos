import { IAgrupacion, IUnidadNegocio } from "../gas";
import { ICliente, IUsuario } from "../tenant";
import { TipoAlerta, TipoEnvio } from "./envio-sms";
import { IGrupo } from "./grupo";
import { ILocalidad } from "./localidad";
import { IPuntoMedicion } from "./punto-medicion";
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
  idScada?: string;
  idPuntoMedicion?: string;
  // Virtuals
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: string;
  grupo?: IGrupo;
  agrupacion?: IAgrupacion;
  localidad?: ILocalidad;
  scada?: IScada;
  puntoMedicion?: IPuntoMedicion;
  usuarios?: IUsuario[];
}

////// CREATE/UPDATE
type Omitir = "_id" | "cliente" | "scada" | "usuarios";
export interface ICreateConfigNotificacion
  extends Omit<Partial<IConfigNotificacion>, Omitir> {}

export interface IUpdateConfigNotificacion
  extends Omit<Partial<IConfigNotificacion>, Omitir> {}
