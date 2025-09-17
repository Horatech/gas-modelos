import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import {
  ICorrectora,
  IDispositivo,
  ILocalidad,
  IMedidorResidencial,
  IScada,
  IUnidadPresion,
} from ".";

export type IEntidades =
  | "Dispositivo"
  | "Correctora"
  | "Unidad de Presión"
  | "Scada"
  | "Medidor Residencial"
  | "Unidad de Negocio"
  | "Centro Operativo"
  | "Localidad";

export interface IAsignacion {
  _id?: string;
  //
  idCliente?: string;
  fechaCreacion?: string;
  idUsuario?: string;
  // Entidad Modificada
  tipoEntidadModificada?: IEntidades;
  idEntidadModificada?: string;
  nombreEntidadModificada?: string;
  // Entidad que se le asigna
  tipoEntidadAsignada?: IEntidades;
  idEntidadAsignada?: string;
  nombreEntidadAsignada?: string;

  // Populate
  dispositivo?: IDispositivo;
  correctora?: ICorrectora;
  unidadPresion?: IUnidadPresion;
  scada?: IScada;
  medidorResidencial?: IMedidorResidencial;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "dispositivo"
  | "correctora"
  | "unidadPresion"
  | "scada"
  | "medidorResidencial"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad";

export interface ICreateAsignacion
  extends Omit<Partial<IAsignacion>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "idCliente"
  | "dispositivo"
  | "correctora"
  | "unidadPresion"
  | "scada"
  | "medidorResidencial"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad";

export interface IUpdateAsignacion
  extends Omit<Partial<IAsignacion>, OmitirUpdate> {}
