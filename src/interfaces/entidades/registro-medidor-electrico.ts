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
  // ===== Tarifas 1 y 2: declarados antes de tener productor =====
  //
  // Las 18 métricas del protocolo son 6 bases × 3 tarifas (`bit = base + 8×tarifa`,
  // fPort de reporte = `110 + bit`). Arriba están las 8 que el firmware conocido
  // reporta; lo que sigue son las 10 que el protocolo define y todavía nadie manda
  // (`INTEGRACION_LORAWAN_NUBE_NME.md` §4: "Definido, sin soporte aún").
  //
  // **Están declarados a propósito, sin productor.** El día que un firmware empiece
  // a reportarlas, el cambio caro es justamente éste: este repo es una dependencia
  // de todos los servicios, así que sumar un campo son un PR acá, un bump de
  // dependencia en cada consumidor y un `@Prop()` en el schema de gas-datos — que
  // es **estricto**, y sin el `@Prop()` Mongoose descarta el valor en silencio.
  // Comparado con eso, mapear el fPort en cada servicio es una línea.
  //
  // No cuesta nada tenerlos: un campo opcional ausente no ocupa lugar en el
  // documento ni exige migración. Y el `implements Exactly<...>` del schema de
  // gas-datos obliga a que los dos lados queden alineados.
  //
  // El medidor de banco ya lista dos de éstas: reporta `disponible_mask = 7199`,
  // con los bits 10 y 11 (`3.8.0.1` y `4.8.0.1`) encendidos. El dato existe en el
  // medidor; falta que el firmware lo pueda reportar.
  //
  // Tarifa 1 — energías (bits 8-11, fPorts 118-121)
  whImportadaT1Acum?: number; // OBIS 1.8.0.1
  whExportadaT1Acum?: number; // OBIS 2.8.0.1
  varhImportadaT1Acum?: number; // OBIS 3.8.0.1
  varhExportadaT1Acum?: number; // OBIS 4.8.0.1
  whImportadaT1?: number;
  whExportadaT1?: number;
  varhImportadaT1?: number;
  varhExportadaT1?: number;
  kwhImportadaT1?: number;
  kwhExportadaT1?: number;
  kvarhImportadaT1?: number;
  kvarhExportadaT1?: number;
  // Tarifa 2 — energías (bits 16-19, fPorts 126-129)
  whImportadaT2Acum?: number; // OBIS 1.8.0.2
  whExportadaT2Acum?: number; // OBIS 2.8.0.2
  varhImportadaT2Acum?: number; // OBIS 3.8.0.2
  varhExportadaT2Acum?: number; // OBIS 4.8.0.2
  whImportadaT2?: number;
  whExportadaT2?: number;
  varhImportadaT2?: number;
  varhExportadaT2?: number;
  kwhImportadaT2?: number;
  kwhExportadaT2?: number;
  kvarhImportadaT2?: number;
  kvarhExportadaT2?: number;
  // Tarifa 2 — demandas máximas (bits 20-21, fPorts 130-131). Snapshots en W,
  // mismas reglas que las de arriba: no se suman ni se promedian.
  demandaMaxImportadaT2W?: number; // OBIS 1.6.0.2
  demandaMaxExportadaT2W?: number; // OBIS 2.6.0.2
  //
  periodoIncompleto?: boolean; // count < 24 -> hubo huecos (corte/reboot)
  /**
   * El acumulado de esta hora es MENOR que el último válido: regresión.
   * Causas típicas: recambio de medidor (baja legítima y permanente) o un rebote
   * transitorio del readout.
   *
   * La muestra se persiste pero NO produce delta, y NO avanza el baseline de la
   * serie — por eso, tras un recambio, el equipo deja de producir deltas hasta
   * que alguien intervenga. Este flag es cómo se encuentran esos equipos:
   * `db.registromedidorelectricos.find({ regresionAcumulado: true })`.
   */
  regresionAcumulado?: boolean;
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
