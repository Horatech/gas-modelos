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
import type { IReporte } from './reporte';

export const TitularMedidorResidencialAguaSchema = z.object({
  nombre: z.string().optional(),
  tipo: z.enum(['persona', 'empresa']),
  documento: z.string().optional(),
  tipoDocumento: z.enum(['DNI', 'CUIT']).optional(),
  telefono: z.string().optional(),
  email: z.string().optional(),
  activo: z.boolean().optional(),
});
export type ITitularMedidorResidencialAgua = z.infer<typeof TitularMedidorResidencialAguaSchema>;

// Populates intra-SCC (IDispositivo, IReporte) como z.custom: ver CLAUDE.md,
// "De solo tipos a schemas Zod".
export const MedidorResidencialAguaSchema = z.object({
  _id: z.string().optional(),
  deviceMeterNumber: z.string().optional(),
  deveui: z.string().optional(),
  deviceName: z.string().optional(),
  fechaCreacion: z.string().optional(),
  ultimoReporte: z.custom<IReporte>().optional(),
  estadoActual: EstadoCorrectoraSchema.optional(),
  consumoInicial: z.number().optional(),
  /**
   * Odómetro del DISPOSITIVO en el momento de vincularlo a este medidor. Es el
   * baseline que se resta al acumulado para que el medidor no herede lo que el
   * equipo midió en instalaciones anteriores:
   * `consumoCorregido = consumoInicial + (consumo - lecturaInicialDispositivo)`.
   *
   * No confundir con `consumoInicial`, que es la lectura del dial del medidor
   * mecánico cargada por el operador. Lo escribe `asignarDispositivo`
   * (gas-api-cliente, `/vinculacion/dispositivo`), nunca la ingesta.
   *
   * Ausente o 0 = comportamiento histórico (todo el odómetro cuenta).
   */
  lecturaInicialDispositivo: z.number().optional(),
  ubicacionGps: CoordenadasSchema.optional(),
  direccion: z.string().optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  titular: TitularMedidorResidencialAguaSchema.optional(),
  corregido: z.boolean().optional(),
  modelo: z.string().optional(),
  letra: z.string().optional(),
  serieAlfa: z.string().optional(),
  medIdExterno: z.string().optional(),
  diametro: z.number().optional(),
  caudalMaximo: z.number().optional(),
  claseMetrologica: z.string().optional(),
  fechaAsignacionDispositivo: z.string().nullable().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
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
export interface IMedidorResidencialAgua {
  _id?: string;
  deviceMeterNumber?: string;
  deveui?: string;
  deviceName?: string;
  fechaCreacion?: string;
  ultimoReporte?: IReporte;
  estadoActual?: IEstado;
  consumoInicial?: number;
  /**
   * Odómetro del DISPOSITIVO en el momento de vincularlo a este medidor. Es el
   * baseline que se resta al acumulado para que el medidor no herede lo que el
   * equipo midió en instalaciones anteriores:
   * `consumoCorregido = consumoInicial + (consumo - lecturaInicialDispositivo)`.
   *
   * No confundir con `consumoInicial`, que es la lectura del dial del medidor
   * mecánico cargada por el operador. Lo escribe `asignarDispositivo`
   * (gas-api-cliente, `/vinculacion/dispositivo`), nunca la ingesta.
   *
   * Ausente o 0 = comportamiento histórico (todo el odómetro cuenta).
   */
  lecturaInicialDispositivo?: number;
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  nombre?: string;
  descripcion?: string;
  titular?: ITitularMedidorResidencialAgua;
  corregido?: boolean;
  modelo?: string;
  letra?: string;
  serieAlfa?: string;
  medIdExterno?: string;
  diametro?: number;
  caudalMaximo?: number;
  claseMetrologica?: string;
  fechaAsignacionDispositivo?: string | null;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
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
export const CreateMedidorResidencialAguaSchema = MedidorResidencialAguaSchema.omit({
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
export interface ICreateMedidorResidencialAgua extends Omit<
  Partial<IMedidorResidencialAgua>,
  OmitirCreate
> {}

////// UPDATE
export const UpdateMedidorResidencialAguaSchema = CreateMedidorResidencialAguaSchema;
type OmitirUpdate =
  | '_id'
  | 'unidadNegocio'
  | 'centroOperativo'
  | 'localidad'
  | 'cuenca'
  | 'grupos'
  | 'dispositivo';
export interface IUpdateMedidorResidencialAgua extends Omit<
  Partial<IMedidorResidencialAgua>,
  OmitirUpdate
> {}
