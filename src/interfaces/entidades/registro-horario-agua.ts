import { ICliente } from '../tenant';
import { ICentroOperativo } from '../gas/centroOperativo';
import { IUnidadNegocio } from '../gas/unidadNegocio';
import { IPuntoMedicion } from './punto-medicion';
import { ILocalidad } from './localidad';
import { IGrupo } from './grupo';
import { ICuenca } from './cuenca';
import { IAgrupacion } from '../gas';
import { IMedidorResidencialAgua } from './medidor-residencial-agua';

/**
 * Registro horario de un medidor de agua residencial (serie temporal).
 *
 * Motivación (device UWM-NB, ver gas/PLAN-UWM-NB-INTEGRACION.md §3.2): el frame diario
 * trae un buffer de hasta 72 volúmenes horarios y llega 1 vez/día, pero el buffer cubre
 * las últimas 72 h → cada hora reaparece en ~3 frames consecutivos. Persistir la serie
 * en una colección aparte con UPSERT idempotente por (deveui, timestamp) deduplica el
 * solapamiento y hace la ingesta re-inyectable desde el DLQ sin duplicar registros.
 * Espejo del patrón de IRegistroMedidorElectrico (NME).
 *
 * El volumen es un odómetro TOTAL (m³); `consumoParcial` es el delta consumido en esa
 * hora respecto del registro previo (lo calcula el backend, patrón SML/NME).
 *
 * NOTA (zona horaria): `timestamp` se ancla con el supuesto de RTC en hora local UY
 * (UTC-3), no UTC. Ver R1 del plan.
 *
 * Colección genérica de agua (no atada a UWM-NB): cualquier device de agua residencial
 * con buffer horario puede escribir acá; el vínculo es por `deveui` + `idMedidorResidencialAgua`.
 */
export interface IRegistroHorarioAgua {
  _id?: string;
  timestamp?: string; // ISO, hora en punto (cierre de la hora)
  //
  volumenM3?: number; // odómetro TOTAL de esa hora (m³)
  consumoParcial?: number; // delta respecto del registro previo (m³)
  //
  deveui?: string;
  deviceName?: string;
  meterId?: string;
  //
  idMedidorResidencialAgua?: string;
  idPuntoMedicion?: string;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  idsAgrupaciones?: string[];
  //
  fechaCreacion?: string;

  // Virtuals
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
  cuenca?: ICuenca;
  puntoMedicion?: IPuntoMedicion;
  medidorResidencialAgua?: IMedidorResidencialAgua;
  grupos?: IGrupo[];
  agrupaciones?: IAgrupacion[];
}

////// CREATE
type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'unidadNegocio'
  | 'centroOperativo'
  | 'localidad'
  | 'cuenca'
  | 'puntoMedicion'
  | 'medidorResidencialAgua'
  | 'grupos'
  | 'agrupaciones';
export interface ICreateRegistroHorarioAgua extends Omit<
  Partial<IRegistroHorarioAgua>,
  OmitirCreate
> {}

////// UPDATE
type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'unidadNegocio'
  | 'centroOperativo'
  | 'localidad'
  | 'cuenca'
  | 'puntoMedicion'
  | 'medidorResidencialAgua'
  | 'grupos'
  | 'agrupaciones';
export interface IUpdateRegistroHorarioAgua extends Omit<
  Partial<IRegistroHorarioAgua>,
  OmitirUpdate
> {}
