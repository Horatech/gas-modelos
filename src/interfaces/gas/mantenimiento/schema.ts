import { ICliente, IDispositivo, IUsuario } from '../../tenant';
import { IAgrupacion } from '../agrupacion';
import { ICentroOperativo } from '../centroOperativo';
import { ICorrectora } from '../correctora';
import { IUnidadNegocio } from '../unidadNegocio';

export interface IMantenimiento {
  _id?: string;
  // Generado
  fechaCreacion?: string;
  // Input
  fecha?: string;
  descripcion?: string;
  tipo?: string;
  idAsignado?: string;
  // Tenancy
  idCliente?: string;
  idUsuario?: string;
  idUnidadDeNegocio?: string;
  idCentroOperativo?: string;
  idAgrupacion?: string;

  // Virtuals
  correctora?: ICorrectora;
  dispositivo?: IDispositivo;
  cliente?: ICliente;
  usuario?: IUsuario;
  unidadDeNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  agrupacion?: IAgrupacion;
}

/////////////////////////////////////////
// CREATE
type OmitirCreate =
  | '_id'
  | 'correctora'
  | 'dispositivo'
  | 'cliente'
  | 'usuario'
  | 'unidadDeNegocio'
  | 'centroOperativo'
  | 'agrupacion'
  | 'fechaCreacion';
export interface ICreateMantenimiento
  extends Omit<Partial<IMantenimiento>, OmitirCreate> {}
// UPDATE
type OmitirUpdate =
  | '_id'
  | 'fechaCreacion'
  | 'correctora'
  | 'dispositivo'
  | 'cliente'
  | 'usuario'
  | 'unidadDeNegocio'
  | 'centroOperativo'
  | 'agrupacion';
export interface IUpdateMantenimiento
  extends Omit<Partial<IMantenimiento>, OmitirUpdate> {}
/////////////////////////////////////////
