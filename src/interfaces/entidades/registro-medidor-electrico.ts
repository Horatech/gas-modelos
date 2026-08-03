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
