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
 * El reporte diario del NME llega como un uplink por métrica habilitada
 * (fPort = 110 + bit del reporte_mask; con el default de fábrica son 110-114),
 * cada uno con 24 acumulados horarios. El backend correlaciona los puertos por
 * (deveui, timestamp de hora) y arma un registro por hora (upsert), guardando el
 * acumulado de cada metrica y el delta consumido en esa hora respecto del
 * registro previo. Energias en Wh / varh (acumulados little-endian, epoch UTC).
 * Las demandas maximas (fPort 114/115/122/123) son snapshots en W: se guardan
 * tal cual, sin delta.
 *
 * Los campos de acumulado (`*Acum`) pueden valer -1 ("registro ausente"): el
 * dispositivo NO tiene el registro para ese timestamp (llega 0xFFFFFFFF en el
 * uplink) y NO se puede recuperar. Distinto de un registro faltante (ausente en
 * la coleccion), que si podria recuperarse si el mensaje se perdio. El valor -1
 * (constante REGISTRO_AUSENTE) se define en cada repo consumidor, porque este
 * paquete es solo de tipos (no se compila a JS).
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
  // Demanda máxima del medidor en W, SNAPSHOT al cierre de la hora (NO acumulado):
  // es la máxima registrada desde el último reset de facturación del medidor. Si
  // nadie lo resetea, la serie es monótona no decreciente y un salto entre dos
  // horas indica que en esa hora se registró un pico nuevo. NO calcular deltas ni
  // sumar estos campos.
  //
  // Ausencia = campo OMITIDO: el medidor no lista ese OBIS, o el registro es
  // previo al upgrade de firmware del equipo. El valor -1 (REGISTRO_AUSENTE)
  // queda reservado al centinela 0xFFFFFFFF del path LoRa, igual que los *Acum.
  demandaMaxImportadaW?: number; // OBIS 1.6.0   — fPort 114 / BLE dmd_w
  demandaMaxExportadaW?: number; // OBIS 2.6.0   — fPort 115 / BLE dmd_exp_w
  demandaMaxImportadaT1W?: number; // OBIS 1.6.0.1 — fPort 122 / BLE dmd_t1_w
  demandaMaxExportadaT1W?: number; // OBIS 2.6.0.1 — fPort 123 / BLE dmd_exp_t1_w
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
