import { ICoordenadas } from '../auxiliares';
import { ICentroOperativo, IUnidadNegocio } from '../gas';
import { IEstado } from './correctora';
import { ICuenca } from './cuenca';
import { IDispositivo } from './dispositivo';
import { IGrupo } from './grupo';
import { ILocalidad } from './localidad';
import { IRegistroMedidorElectrico } from './registro-medidor-electrico';

export interface IMedidorElectrico {
  _id?: string;
  //
  deveui?: string;
  deviceName?: string;
  fechaCreacion?: string;
  // Datos del medidor HEXING (fPort 104)
  serial?: string;
  identificacion?: string;
  modelo?: string; /// HXE34K-S + lo que escriba el usuario.
  //
  ultimoReporte?: IRegistroMedidorElectrico;
  estadoActual?: IEstado;
  // Estado reportado por el dispositivo (byte_estado / alerta corte 220V)
  energiaExterna?: boolean; // hay 220 VAC presente
  lecturasOk?: number;
  lecturasFail?: number;
  //
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  idLocalidad?: string;
  nombre?: string;
  descripcion?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
  cuenca?: ICuenca;
  grupos?: IGrupo[];
  dispositivo?: IDispositivo;
}

////// CREATE
type OmitirCreate =
  | '_id'
  | 'unidadNegocio'
  | 'centroOperativo'
  | 'localidad'
  | 'cuenca'
  | 'grupos'
  | 'dispositivo';
export interface ICreateMedidorElectrico extends Omit<
  Partial<IMedidorElectrico>,
  OmitirCreate
> {}

////// UPDATE
type OmitirUpdate =
  | '_id'
  | 'unidadNegocio'
  | 'centroOperativo'
  | 'localidad'
  | 'cuenca'
  | 'grupos'
  | 'dispositivo';
export interface IUpdateMedidorElectrico extends Omit<
  Partial<IMedidorElectrico>,
  OmitirUpdate
> {}
