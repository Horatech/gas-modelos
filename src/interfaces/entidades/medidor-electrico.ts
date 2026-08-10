import { z } from 'zod';
import { CoordenadasSchema, ICoordenadas } from '../auxiliares/coordenadas';
import { CentroOperativoSchema } from '../gas/centroOperativo/schema';
import { UnidadNegocioSchema } from '../gas/unidadNegocio/schema';
import { EstadoCorrectoraSchema } from './estado';
import type { IEstado } from './estado';
import { CuencaSchema } from './cuenca';
import { GrupoSchema } from './grupo';
import { LocalidadSchema } from './localidad';
import type { IDispositivo } from './dispositivo';
import type { IRegistroMedidorElectrico } from './registro-medidor-electrico';

// Populates intra-SCC (IDispositivo, IRegistroMedidorElectrico) como
// z.custom: ver CLAUDE.md, "De solo tipos a schemas Zod".
export const MedidorElectricoSchema = z.object({
  _id: z.string().optional(),
  deveui: z.string().optional(),
  fechaAsignacionDispositivo: z.string().nullable().optional(),
  deviceName: z.string().optional(),
  fechaCreacion: z.string().optional(),
  serial: z.string().optional(),
  identificacion: z.string().optional(),
  modelo: z.string().optional(),
  ultimoReporte: z.custom<IRegistroMedidorElectrico>().optional(),
  estadoActual: EstadoCorrectoraSchema.optional(),
  energiaExterna: z.boolean().optional(),
  lecturasOk: z.number().optional(),
  lecturasFail: z.number().optional(),
  ubicacionGps: CoordenadasSchema.optional(),
  direccion: z.string().optional(),
  idLocalidad: z.string().optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idCuenca: z.string().optional(),
  idsGrupos: z.array(z.string()).optional(),
  // Populate
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
  cuenca: CuencaSchema.optional(),
  grupos: z.array(GrupoSchema).optional(),
  dispositivo: z.custom<IDispositivo>().optional(),
});

/**
 * Interface hand-written (mismo shape que el schema): parte del SCC de
 * IDispositivo, no usa z.infer.
 */
export interface IMedidorElectrico {
  _id?: string;
  deveui?: string;
  fechaAsignacionDispositivo?: string | null;
  deviceName?: string;
  fechaCreacion?: string;
  serial?: string;
  identificacion?: string;
  modelo?: string;
  ultimoReporte?: IRegistroMedidorElectrico;
  estadoActual?: IEstado;
  energiaExterna?: boolean;
  lecturasOk?: number;
  lecturasFail?: number;
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  idLocalidad?: string;
  nombre?: string;
  descripcion?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  unidadNegocio?: import('../gas/unidadNegocio/schema').IUnidadNegocio;
  centroOperativo?: import('../gas/centroOperativo/schema').ICentroOperativo;
  localidad?: import('./localidad').ILocalidad;
  cuenca?: import('./cuenca').ICuenca;
  grupos?: import('./grupo').IGrupo[];
  dispositivo?: IDispositivo;
}

////// CREATE
export const CreateMedidorElectricoSchema = MedidorElectricoSchema.omit({
  _id: true,
  unidadNegocio: true,
  centroOperativo: true,
  localidad: true,
  cuenca: true,
  grupos: true,
  dispositivo: true,
});
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
export const UpdateMedidorElectricoSchema = CreateMedidorElectricoSchema;
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
