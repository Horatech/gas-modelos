import { z } from 'zod';
import { CoordenadasSchema, ICoordenadas } from '../auxiliares/coordenadas';
import { CentroOperativoSchema } from '../gas/centroOperativo/schema';
import { UnidadNegocioSchema } from '../gas/unidadNegocio/schema';
import { EstadoCorrectoraSchema } from './estado';
import type { IEstado } from './estado';
import { EstadoBaselineDispositivoSchema } from './baseline-dispositivo';
import type { IEstadoBaselineDispositivo } from './baseline-dispositivo';
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
  /**
   * Ancla del dial del medidor mecánico para el vínculo VIGENTE, en m³. Copia
   * denormalizada del `dialInicial` del tramo abierto (`IAsignacion`), que es la
   * fuente de verdad. Ya no lo edita el ABM del medidor.
   */
  consumoInicial: z.number().optional(),
  /**
   * Odómetro del DISPOSITIVO al abrirse el vínculo VIGENTE. Es el baseline que se
   * resta para que el medidor no herede lo que el equipo midió en instalaciones
   * anteriores: `consumoCorregido = consumoInicial + (consumo - lecturaInicialDispositivo)`.
   *
   * Copia denormalizada del campo homónimo del tramo abierto. Lo escribe
   * `asignarDispositivo`; la ingesta sólo lo CONFIRMA cuando está `provisorio`.
   *
   * Ausente o 0 = comportamiento histórico (todo el odómetro cuenta). En agua eso
   * es TODO el parque: medido en prod el 7-sep-2026, 0 de 1091 medidores de agua
   * tienen baseline y 0 tienen `fechaAsignacionDispositivo`.
   */
  lecturaInicialDispositivo: z.number().optional(),
  /** Ver `EstadoBaselineDispositivoSchema`. Ausente = `confirmado`. */
  lecturaInicialDispositivoEstado: EstadoBaselineDispositivoSchema.optional(),
  /**
   * Nadie leyó el dial en el vínculo vigente: el acumulado es relativo al equipo,
   * no la lectura del medidor físico. Ver `IAsignacion.dialPendiente`. En agua es
   * hoy TODO el parque de alta automática (1075 ML107A).
   */
  dialPendiente: z.boolean().optional(),
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
  /**
   * Ancla del dial del medidor mecánico para el vínculo VIGENTE, en m³. Copia
   * denormalizada del `dialInicial` del tramo abierto (`IAsignacion`), que es la
   * fuente de verdad. Ya no lo edita el ABM del medidor.
   */
  consumoInicial?: number;
  /**
   * Odómetro del DISPOSITIVO al abrirse el vínculo VIGENTE. Es el baseline que se
   * resta para que el medidor no herede lo que el equipo midió en instalaciones
   * anteriores: `consumoCorregido = consumoInicial + (consumo - lecturaInicialDispositivo)`.
   *
   * Copia denormalizada del campo homónimo del tramo abierto. Lo escribe
   * `asignarDispositivo`; la ingesta sólo lo CONFIRMA cuando está `provisorio`.
   *
   * Ausente o 0 = comportamiento histórico. En agua eso es TODO el parque: medido
   * en prod el 7-sep-2026, 0 de 1091 medidores tienen baseline.
   */
  lecturaInicialDispositivo?: number;
  /** Ver `EstadoBaselineDispositivoSchema`. Ausente = `confirmado`. */
  lecturaInicialDispositivoEstado?: IEstadoBaselineDispositivo;
  /**
   * Nadie leyó el dial en el vínculo vigente: el acumulado es relativo al equipo,
   * no la lectura del medidor físico. Ver `IAsignacion.dialPendiente`.
   */
  dialPendiente?: boolean;
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
