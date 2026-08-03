import { z } from 'zod';
import { ClienteSchema } from '../tenant/cliente.model';
import { CentroOperativoSchema } from '../gas/centroOperativo/schema';
import { UnidadNegocioSchema } from '../gas/unidadNegocio/schema';
import { LocalidadSchema } from './localidad';
import { GrupoSchema } from './grupo';
import { CuencaSchema } from './cuenca';
import { AgrupacionSchema } from '../gas/agrupacion/schema';
import type { IPuntoMedicion } from './punto-medicion';
import type { IMedidorElectrico } from './medidor-electrico';

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
// Populates intra-SCC (IPuntoMedicion, IMedidorElectrico) como z.custom: ver
// CLAUDE.md, "De solo tipos a schemas Zod".
export const RegistroMedidorElectricoSchema = z.object({
  _id: z.string().optional(),
  timestamp: z.string().optional(), // ISO, cierre de la hora en UTC
  // Acumulados del medidor (Wh / varh)
  whImportadaAcum: z.number().optional(),
  whExportadaAcum: z.number().optional(),
  varhImportadaAcum: z.number().optional(),
  varhExportadaAcum: z.number().optional(),
  // Consumo de la hora (delta respecto del registro previo, Wh / varh)
  whImportada: z.number().optional(),
  whExportada: z.number().optional(),
  varhImportada: z.number().optional(),
  varhExportada: z.number().optional(),
  // Equivalente en kWh / kvarh
  kwhImportada: z.number().optional(),
  kwhExportada: z.number().optional(),
  kvarhImportada: z.number().optional(),
  kvarhExportada: z.number().optional(),
  // Demanda máxima del medidor en W, SNAPSHOT al cierre de la hora (NO acumulado)
  demandaMaxImportadaW: z.number().optional(),
  demandaMaxExportadaW: z.number().optional(),
  demandaMaxImportadaT1W: z.number().optional(),
  demandaMaxExportadaT1W: z.number().optional(),
  // ===== Tarifas 1 y 2: declarados antes de tener productor =====
  //
  // Las 18 métricas del protocolo son 6 bases × 3 tarifas (`bit = base + 8×tarifa`,
  // fPort de reporte = `110 + bit`). Arriba están las 8 que el firmware conocido
  // reporta; lo que sigue son las 10 que el protocolo define y todavía nadie manda
  // (`INTEGRACION_LORAWAN_NUBE_NME.md` §4: "Definido, sin soporte aún").
  //
  // Están declarados a propósito, sin productor: el día que un firmware empiece a
  // reportarlas, el cambio caro es justamente éste (PR acá + bump en cada consumidor
  // + `@Prop()` en gas-datos); mapear el fPort en cada servicio es una línea.
  //
  // Tarifa 1 — energías (bits 8-11, fPorts 118-121)
  whImportadaT1Acum: z.number().optional(), // OBIS 1.8.0.1
  whExportadaT1Acum: z.number().optional(), // OBIS 2.8.0.1
  varhImportadaT1Acum: z.number().optional(), // OBIS 3.8.0.1
  varhExportadaT1Acum: z.number().optional(), // OBIS 4.8.0.1
  whImportadaT1: z.number().optional(),
  whExportadaT1: z.number().optional(),
  varhImportadaT1: z.number().optional(),
  varhExportadaT1: z.number().optional(),
  kwhImportadaT1: z.number().optional(),
  kwhExportadaT1: z.number().optional(),
  kvarhImportadaT1: z.number().optional(),
  kvarhExportadaT1: z.number().optional(),
  // Tarifa 2 — energías (bits 16-19, fPorts 126-129)
  whImportadaT2Acum: z.number().optional(), // OBIS 1.8.0.2
  whExportadaT2Acum: z.number().optional(), // OBIS 2.8.0.2
  varhImportadaT2Acum: z.number().optional(), // OBIS 3.8.0.2
  varhExportadaT2Acum: z.number().optional(), // OBIS 4.8.0.2
  whImportadaT2: z.number().optional(),
  whExportadaT2: z.number().optional(),
  varhImportadaT2: z.number().optional(),
  varhExportadaT2: z.number().optional(),
  kwhImportadaT2: z.number().optional(),
  kwhExportadaT2: z.number().optional(),
  kvarhImportadaT2: z.number().optional(),
  kvarhExportadaT2: z.number().optional(),
  // Tarifa 2 — demandas máximas (bits 20-21, fPorts 130-131). Snapshots en W,
  // mismas reglas que las de arriba: no se suman ni se promedian.
  demandaMaxImportadaT2W: z.number().optional(), // OBIS 1.6.0.2
  demandaMaxExportadaT2W: z.number().optional(), // OBIS 2.6.0.2
  periodoIncompleto: z.boolean().optional(),
  regresionAcumulado: z.boolean().optional(),
  deveui: z.string().optional(),
  deviceName: z.string().optional(),
  idMedidorElectrico: z.string().optional(),
  idPuntoMedicion: z.string().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
  idCuenca: z.string().optional(),
  idsGrupos: z.array(z.string()).optional(),
  idsAgrupaciones: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),
  // Virtuals
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
  cuenca: CuencaSchema.optional(),
  puntoMedicion: z.custom<IPuntoMedicion>().optional(),
  medidorElectrico: z.custom<IMedidorElectrico>().optional(),
  grupos: z.array(GrupoSchema).optional(),
  agrupaciones: z.array(AgrupacionSchema).optional(),
});

/**
 * Interface hand-written (mismo shape que el schema): parte del SCC de
 * IDispositivo, no usa z.infer.
 */
export interface IRegistroMedidorElectrico {
  _id?: string;
  timestamp?: string;
  whImportadaAcum?: number;
  whExportadaAcum?: number;
  varhImportadaAcum?: number;
  varhExportadaAcum?: number;
  whImportada?: number;
  whExportada?: number;
  varhImportada?: number;
  varhExportada?: number;
  kwhImportada?: number;
  kwhExportada?: number;
  kvarhImportada?: number;
  kvarhExportada?: number;
  demandaMaxImportadaW?: number;
  demandaMaxExportadaW?: number;
  demandaMaxImportadaT1W?: number;
  demandaMaxExportadaT1W?: number;
  whImportadaT1Acum?: number;
  whExportadaT1Acum?: number;
  varhImportadaT1Acum?: number;
  varhExportadaT1Acum?: number;
  whImportadaT1?: number;
  whExportadaT1?: number;
  varhImportadaT1?: number;
  varhExportadaT1?: number;
  kwhImportadaT1?: number;
  kwhExportadaT1?: number;
  kvarhImportadaT1?: number;
  kvarhExportadaT1?: number;
  whImportadaT2Acum?: number;
  whExportadaT2Acum?: number;
  varhImportadaT2Acum?: number;
  varhExportadaT2Acum?: number;
  whImportadaT2?: number;
  whExportadaT2?: number;
  varhImportadaT2?: number;
  varhExportadaT2?: number;
  kwhImportadaT2?: number;
  kwhExportadaT2?: number;
  kvarhImportadaT2?: number;
  kvarhExportadaT2?: number;
  demandaMaxImportadaT2W?: number;
  demandaMaxExportadaT2W?: number;
  periodoIncompleto?: boolean;
  regresionAcumulado?: boolean;
  deveui?: string;
  deviceName?: string;
  idMedidorElectrico?: string;
  idPuntoMedicion?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  idsAgrupaciones?: string[];
  fechaCreacion?: string;
  // Virtuals
  cliente?: import('../tenant/cliente.model').ICliente;
  unidadNegocio?: import('../gas/unidadNegocio/schema').IUnidadNegocio;
  centroOperativo?: import('../gas/centroOperativo/schema').ICentroOperativo;
  localidad?: import('./localidad').ILocalidad;
  cuenca?: import('./cuenca').ICuenca;
  puntoMedicion?: IPuntoMedicion;
  medidorElectrico?: IMedidorElectrico;
  grupos?: import('./grupo').IGrupo[];
  agrupaciones?: import('../gas/agrupacion/schema').IAgrupacion[];
}

////// CREATE
export const CreateRegistroMedidorElectricoSchema = RegistroMedidorElectricoSchema.omit({
  _id: true,
  cliente: true,
  unidadNegocio: true,
  centroOperativo: true,
  localidad: true,
  cuenca: true,
  puntoMedicion: true,
  medidorElectrico: true,
  grupos: true,
  agrupaciones: true,
});
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
export const UpdateRegistroMedidorElectricoSchema = CreateRegistroMedidorElectricoSchema;
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
