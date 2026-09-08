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

// Populates intra-SCC (IDispositivo, IReporte) como z.custom: ver CLAUDE.md,
// "De solo tipos a schemas Zod".
export const MedidorResidencialSchema = z.object({
  _id: z.string().optional(),
  deviceMeterNumber: z.string().optional(),
  deveui: z.string().optional(),
  fechaAsignacionDispositivo: z.string().nullable().optional(),
  deviceName: z.string().optional(),
  fechaCreacion: z.string().optional(),
  ultimoReporte: z.custom<IReporte>().optional(),
  estadoActual: EstadoCorrectoraSchema.optional(),
  /**
   * Ancla del dial del medidor mecánico para el vínculo VIGENTE, en m³.
   *
   * **Copia denormalizada del `dialInicial` del tramo abierto** (evento `asignar`
   * en `asignaciones`), que es la fuente de verdad. Existe para que la ingesta
   * resuelva el acumulado sin una consulta por uplink: es el camino rápido, igual
   * que `VinculosService` usa el estado actual cuando el bloque cae entero dentro
   * del vínculo vigente.
   *
   * Ya NO lo edita el ABM del medidor: la lectura se declara al asignar el
   * dispositivo (`/vinculacion/dispositivo`) y se corrige con un evento
   * `cambio-lectura`. Motivo: una lectura del dial sin la fecha en que se tomó no
   * se puede proyectar al instante de instalación, y la auditoría muestra que se
   * editaba de rutina —hay medidores con seis ediciones en tres semanas—.
   */
  consumoInicial: z.number().optional(),
  /**
   * Odómetro del DISPOSITIVO al abrirse el vínculo VIGENTE. Es el baseline que se
   * resta para que el medidor no herede lo que el equipo midió en instalaciones
   * anteriores: `consumoCorregido = consumoInicial + (consumo - lecturaInicialDispositivo)`.
   *
   * Copia denormalizada del campo homónimo del tramo abierto. Lo escribe
   * `asignarDispositivo`; la ingesta sólo lo CONFIRMA cuando está `provisorio`,
   * nunca lo re-baselinea por su cuenta.
   *
   * Ausente o 0 = comportamiento histórico (todo el odómetro cuenta).
   */
  lecturaInicialDispositivo: z.number().optional(),
  /** Ver `EstadoBaselineDispositivoSchema`. Ausente = `confirmado`. */
  lecturaInicialDispositivoEstado: EstadoBaselineDispositivoSchema.optional(),
  /**
   * Nadie leyó el dial en el vínculo vigente: el acumulado es relativo al equipo,
   * no la lectura del medidor físico. Copia denormalizada de `dialPendiente` del
   * tramo abierto; ver `IAsignacion`.
   */
  dialPendiente: z.boolean().optional(),
  ubicacionGps: CoordenadasSchema.optional(),
  direccion: z.string().optional(),
  idLocalidad: z.string().optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  corregido: z.boolean().optional(),
  modelo: z.string().optional(),
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
export interface IMedidorResidencial {
  _id?: string;
  deviceMeterNumber?: string;
  deveui?: string;
  fechaAsignacionDispositivo?: string | null;
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
   * Ausente o 0 = comportamiento histórico (todo el odómetro cuenta).
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
  idLocalidad?: string;
  nombre?: string;
  descripcion?: string;
  corregido?: boolean;
  modelo?: string;
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
export const CreateMedidorResidencialSchema = MedidorResidencialSchema.omit({
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
export interface ICreateMedidorResidencial extends Omit<
  Partial<IMedidorResidencial>,
  OmitirCreate
> {}

////// UPDATE
export const UpdateMedidorResidencialSchema = CreateMedidorResidencialSchema;
type OmitirUpdate =
  | '_id'
  | 'unidadNegocio'
  | 'centroOperativo'
  | 'localidad'
  | 'cuenca'
  | 'grupos'
  | 'dispositivo';
export interface IUpdateMedidorResidencial extends Omit<
  Partial<IMedidorResidencial>,
  OmitirUpdate
> {}
