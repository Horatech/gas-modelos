import { GeoJSON, ICoordenadas } from "../auxiliares";
import { Division, ICliente } from "../tenant";
import { IAgrupacion } from "../gas/agrupacion";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ICorrectora, IEstado } from "./correctora";
import { ITipoAlerta } from "./alerta";
import { IUnidadPresion } from "./unidad-presion";
import { ILocalidad } from "./localidad";
import { IGrupo } from "./grupo";
import { ISubzonaTarifaria } from "./subzona-tarifaria";
import { IMedidorResidencial } from "./medidor-residencial";
import { IMedidorResidencialAgua } from "./medidor-residencial-agua";
import { IMedidorElectrico } from "./medidor-electrico";
import { IScada } from "./scada";
import { ICuenca } from "./cuenca";
import { IDispositivoEUW300 } from "./configs-dispositivo";
import { IDispositivoExternoNuc } from "./dispositivo-externo-nuc";

export interface ILimitesNotificacion {
  sms?: number;
  whatsapp?: number;
  llamada?: number;
  email?: number;
  push?: number;
}

export interface IPuntoMedicion {
  _id?: string;
  // GPS
  geojson?: GeoJSON;
  ubicacion?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  // Detalles
  nombre?: string;
  descripcion?: string;
  codigoSimec?: string; // Para exportacion de datos a Simec
  numeroSuministro?: string; // Identificador Numero de Suministro para facturacion
  // Dispositivo externo NUC
  idsDipositivosExternosNuc?: string[] | null;
  fechaAsignacionDispositivoExternoNuc?: string | null;
  // Correctora
  idCorrectora?: string | null;
  fechaAsignacionCorrectora?: string | null;
  desfaseHorario?: number | null;
  // Unidad de Presion
  idUnidadPresion?: string | null;
  fechaAsignacionUnidadPresion?: string | null;
  // Medidor Residencial
  idMedidorResidencial?: string | null;
  fechaAsignacionMedidorResidencial?: string | null;
  // Medidor Residencial Agua
  idMedidorResidencialAgua?: string | null;
  fechaAsignacionMedidorResidencialAgua?: string | null;
  // Medidor Electrico
  idMedidorElectrico?: string | null;
  fechaAsignacionMedidorElectrico?: string | null;
  // SCADA
  idsScada?: string[] | null;
  fechaAsignacionScada?: string | null;
  posicion?: number; // Orden en el listado
  // Calculado por el backend
  estado?: IEstado;
  timestampUltimoReporte?: string | null;
  // Tipos de alerta activos (denormalizado para subfiltrar el listado por tipo
  // de alerta cuando estado === "Alerta"). Espeja la señal de estado en los
  // write-paths de cada división; SCADA lo recomputa desde alertas activas.
  tiposAlertaActivos?: ITipoAlerta[];
  // Tenancy
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idSubzonaTarifaria?: string; // solo división Residencial
  idsGrupos?: string[];
  idsAgrupaciones?: string[];
  idCuenca?: string;
  division?: Division;
  // Notificaciones
  limitesNotificacion?: ILimitesNotificacion;
  // Virtuals
  correctora?: ICorrectora;
  unidadPresion?: IUnidadPresion;
  medidorResidencial?: IMedidorResidencial;
  medidorResidencialAgua?: IMedidorResidencialAgua;
  medidorElectrico?: IMedidorElectrico;
  scadas?: IScada[];
  dispositivosExternosNuc?: IDispositivoExternoNuc[];
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad2?: ILocalidad;
  subzonaTarifaria?: ISubzonaTarifaria;
  grupos?: IGrupo[];
  agrupaciones?: IAgrupacion[];
  cuenca?: ICuenca;
}

////// CREATE/UPDATE
type Omitir =
  | "_id"
  | "correctora"
  | "unidadPresion"
  | "medidorResidencial"
  | "medidorResidencialAgua"
  | "medidorElectrico"
  | "scadas"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad2"
  | "subzonaTarifaria"
  | "grupos"
  | "agrupaciones"
  | "cuenca";
export interface ICreatePuntoMedicion extends Omit<
  Partial<IPuntoMedicion>,
  Omitir
> {}

export interface IUpdatePuntoMedicion extends Omit<
  Partial<IPuntoMedicion>,
  Omitir
> {}
