import { ICliente } from '../tenant';
import { ICentroOperativo } from '../gas/centroOperativo';
import { IUnidadNegocio } from '../gas/unidadNegocio';
import { IPuntoMedicion } from './punto-medicion';
import { ILocalidad } from './localidad';
import { IGrupo } from './grupo';
import { ICuenca } from './cuenca';
import { IAgrupacion } from '../gas';
import { IMedidorElectrico } from './medidor-electrico';

/**
 * Registro horario de un medidor electrico NME.
 *
 * El reporte diario del NME llega como 4 uplinks separados (fPort 110/111/112/113),
 * cada uno con hasta 24 acumulados horarios. El backend correlaciona los 4 puertos
 * por (deveui, timestamp de hora) y arma un registro por hora (upsert), guardando el
 * acumulado de cada metrica y el delta consumido en esa hora respecto del registro
 * previo. Energias en Wh / varh (acumulados little-endian, epoch UTC).
 */
export interface IRegistroMedidorElectrico {
  _id?: string;
  timestamp?: string; // ISO, cierre de la hora en UTC
  // Acumulados del medidor (Wh / varh)
  whImportadaAcum?: number;
  whExportadaAcum?: number;
  varhImportadaAcum?: number;
  varhExportadaAcum?: number;
  // Consumo de la hora (delta respecto del registro previo, Wh / varh)
  whImportada?: number;
  whExportada?: number;
  varhImportada?: number;
  varhExportada?: number;
  // Equivalente en kWh / kvarh
  kwhImportada?: number;
  kwhExportada?: number;
  kvarhImportada?: number;
  kvarhExportada?: number;
  //
  periodoIncompleto?: boolean; // count < 24 -> hubo huecos (corte/reboot)
  //
  deveui?: string;
  deviceName?: string;
  //
  idMedidorElectrico?: string;
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
  medidorElectrico?: IMedidorElectrico;
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
  | 'medidorElectrico'
  | 'grupos'
  | 'agrupaciones';
export interface ICreateRegistroMedidorElectrico extends Omit<
  Partial<IRegistroMedidorElectrico>,
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
  | 'medidorElectrico'
  | 'grupos'
  | 'agrupaciones';
export interface IUpdateRegistroMedidorElectrico extends Omit<
  Partial<IRegistroMedidorElectrico>,
  OmitirUpdate
> {}
