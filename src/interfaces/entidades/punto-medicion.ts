import { z } from "zod";
import { GeoJSONSchema, GeoJSON, CoordenadasSchema, ICoordenadas } from "../auxiliares/coordenadas";
import { DivisionSchema } from "../tenant/usuario/permiso";
import { ClienteSchema } from "../tenant/cliente.model";
import { AgrupacionSchema } from "../gas/agrupacion/schema";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { EstadoCorrectoraSchema } from "./estado";
import { TipoAlertaSchema } from "./alerta";
import { LocalidadSchema } from "./localidad";
import { GrupoSchema } from "./grupo";
import { SubzonaTarifariaSchema } from "./subzona-tarifaria";
import { CuencaSchema } from "./cuenca";
import type { ICorrectora } from "./correctora";
import type { IUnidadPresion } from "./unidad-presion";
import type { IMedidorResidencial } from "./medidor-residencial";
import type { IMedidorResidencialAgua } from "./medidor-residencial-agua";
import type { IMedidorElectrico } from "./medidor-electrico";
import type { IScada } from "./scada";
import type { ICuentaCliente } from "./cuenta-cliente";
import type { IDispositivoExternoNuc } from "./dispositivo-externo-nuc";
import { ClasificacionPuntoSchema } from "./clasificacion-punto";
import { ZonaBalanceSchema } from "./zona-balance";

export const LimitesNotificacionSchema = z.object({
  sms: z.number().optional(),
  whatsapp: z.number().optional(),
  llamada: z.number().optional(),
  email: z.number().optional(),
  push: z.number().optional(),
});
export interface ILimitesNotificacion {
  sms?: number;
  whatsapp?: number;
  llamada?: number;
  email?: number;
  push?: number;
}

// Estado del Factor de Carga: "Parcial" si el punto tiene menos de 365 días de
// reportes; "Completo" si tiene 365 días o más.
export const FactorCargaEstadoSchema = z.enum(["Parcial", "Completo"]);
export type FactorCargaEstado = z.infer<typeof FactorCargaEstadoSchema>;

// Populates intra-SCC (ICorrectora, IUnidadPresion, IMedidorResidencial,
// IMedidorResidencialAgua, IMedidorElectrico, IScada, ICuentaCliente,
// IDispositivoExternoNuc) como z.custom: ver CLAUDE.md, "De solo tipos a
// schemas Zod".
export const PuntoMedicionSchema = z.object({
  _id: z.string().optional(),
  // GPS
  geojson: GeoJSONSchema.optional(),
  ubicacion: CoordenadasSchema.optional(),
  direccion: z.string().optional(),
  localidad: z.string().optional(),
  // Detalles
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  codigoSimec: z.string().optional(), // Para exportacion de datos a Simec
  numeroSuministro: z.string().optional(), // Identificador Numero de Suministro para facturacion
  // Cuenta / agrupador de facturación (integración externa, p. ej. Manantial).
  idCuenta: z.string().nullable().optional(),
  codigoExternoConexion: z.string().optional(),
  codigoExternoInmueble: z.string().optional(),
  diametroConexion: z.number().optional(),
  materialConexion: z.string().optional(),
  facturable: z.boolean().optional(),
  // Dispositivo externo NUC
  idsDipositivosExternosNuc: z.array(z.string()).nullable().optional(),
  fechaAsignacionDispositivoExternoNuc: z.string().nullable().optional(),
  // Correctora
  idCorrectora: z.string().nullable().optional(),
  fechaAsignacionCorrectora: z.string().nullable().optional(),
  desfaseHorario: z.number().nullable().optional(),
  // Unidad de Presion
  idUnidadPresion: z.string().nullable().optional(),
  fechaAsignacionUnidadPresion: z.string().nullable().optional(),
  // Medidor Residencial
  idMedidorResidencial: z.string().nullable().optional(),
  fechaAsignacionMedidorResidencial: z.string().nullable().optional(),
  // Medidor Residencial Agua
  idMedidorResidencialAgua: z.string().nullable().optional(),
  fechaAsignacionMedidorResidencialAgua: z.string().nullable().optional(),
  // Medidor Electrico
  idMedidorElectrico: z.string().nullable().optional(),
  fechaAsignacionMedidorElectrico: z.string().nullable().optional(),
  // SCADA
  idsScada: z.array(z.string()).nullable().optional(),
  fechaAsignacionScada: z.string().nullable().optional(),
  posicion: z.number().optional(),
  // Calculado por el backend
  estado: EstadoCorrectoraSchema.optional(),
  timestampUltimoReporte: z.string().nullable().optional(),
  tiposAlertaActivos: z.array(TipoAlertaSchema).optional(),
  // Factor de Carga
  factorCarga: z.number().nullable().optional(),
  factorCargaEstado: FactorCargaEstadoSchema.nullable().optional(),
  fechaConsumoMaximo: z.string().nullable().optional(),
  fechaCalculoFactorCarga: z.string().nullable().optional(),
  // Tenancy
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
  idSubzonaTarifaria: z.string().optional(),
  idsGrupos: z.array(z.string()).optional(),
  idsAgrupaciones: z.array(z.string()).optional(),
  idCuenca: z.string().optional(),
  division: DivisionSchema.optional(),
  // Clasificación del punto — qué ES el punto (instalación, rol en la red, nivel,
  // categoría tarifaria). Ortogonal a `division`, que sigue siendo tipo de equipo
  // + permiso. Objeto embebido: no agrega ninguna referencia al SCC.
  // Ver clasificacion-punto.ts y /PLAN-MODELO-CANONICO-MULTIVERTICAL.md.
  clasificacion: ClasificacionPuntoSchema.optional(),
  // Zonas de balance a las que pertenece el punto. N a N: un punto puede estar en
  // la zona de su transformador y en la del alimentador que la alimenta.
  idsZonasBalance: z.array(z.string()).optional(),
  // Notificaciones
  limitesNotificacion: LimitesNotificacionSchema.optional(),
  // Virtuals
  correctora: z.custom<ICorrectora>().optional(),
  unidadPresion: z.custom<IUnidadPresion>().optional(),
  medidorResidencial: z.custom<IMedidorResidencial>().optional(),
  medidorResidencialAgua: z.custom<IMedidorResidencialAgua>().optional(),
  medidorElectrico: z.custom<IMedidorElectrico>().optional(),
  scadas: z.array(z.custom<IScada>()).optional(),
  dispositivosExternosNuc: z.array(z.custom<IDispositivoExternoNuc>()).optional(),
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad2: LocalidadSchema.optional(),
  subzonaTarifaria: SubzonaTarifariaSchema.optional(),
  grupos: z.array(GrupoSchema).optional(),
  agrupaciones: z.array(AgrupacionSchema).optional(),
  cuenca: CuencaSchema.optional(),
  cuenta: z.custom<ICuentaCliente>().optional(),
  // `IZonaBalance` está FUERA del SCC de IDispositivo (no popula al punto: su
  // `idPuntoFrontera` es un string sin populate, justamente para no cerrar el
  // ciclo), así que acá se puede usar el schema real y no `z.custom`.
  zonasBalance: z.array(ZonaBalanceSchema).optional(),
});

/**
 * Interface hand-written (mismo shape que el schema): parte del SCC de
 * IDispositivo, no usa z.infer.
 */
export interface IPuntoMedicion {
  _id?: string;
  geojson?: GeoJSON;
  ubicacion?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  nombre?: string;
  descripcion?: string;
  codigoSimec?: string;
  numeroSuministro?: string;
  idCuenta?: string | null;
  codigoExternoConexion?: string;
  codigoExternoInmueble?: string;
  diametroConexion?: number;
  materialConexion?: string;
  facturable?: boolean;
  idsDipositivosExternosNuc?: string[] | null;
  fechaAsignacionDispositivoExternoNuc?: string | null;
  idCorrectora?: string | null;
  fechaAsignacionCorrectora?: string | null;
  desfaseHorario?: number | null;
  idUnidadPresion?: string | null;
  fechaAsignacionUnidadPresion?: string | null;
  idMedidorResidencial?: string | null;
  fechaAsignacionMedidorResidencial?: string | null;
  idMedidorResidencialAgua?: string | null;
  fechaAsignacionMedidorResidencialAgua?: string | null;
  idMedidorElectrico?: string | null;
  fechaAsignacionMedidorElectrico?: string | null;
  idsScada?: string[] | null;
  fechaAsignacionScada?: string | null;
  posicion?: number;
  estado?: import("./estado").IEstado;
  timestampUltimoReporte?: string | null;
  tiposAlertaActivos?: import("./alerta").ITipoAlerta[];
  factorCarga?: number | null;
  factorCargaEstado?: FactorCargaEstado | null;
  fechaConsumoMaximo?: string | null;
  fechaCalculoFactorCarga?: string | null;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idSubzonaTarifaria?: string;
  idsGrupos?: string[];
  idsAgrupaciones?: string[];
  idCuenca?: string;
  division?: import("../tenant/usuario/permiso").Division;
  clasificacion?: import("./clasificacion-punto").IClasificacionPunto;
  idsZonasBalance?: string[];
  limitesNotificacion?: ILimitesNotificacion;
  // Virtuals
  correctora?: ICorrectora;
  unidadPresion?: IUnidadPresion;
  medidorResidencial?: IMedidorResidencial;
  medidorResidencialAgua?: IMedidorResidencialAgua;
  medidorElectrico?: IMedidorElectrico;
  scadas?: IScada[];
  dispositivosExternosNuc?: IDispositivoExternoNuc[];
  cliente?: import("../tenant/cliente.model").ICliente;
  unidadNegocio?: import("../gas/unidadNegocio/schema").IUnidadNegocio;
  centroOperativo?: import("../gas/centroOperativo/schema").ICentroOperativo;
  localidad2?: import("./localidad").ILocalidad;
  subzonaTarifaria?: import("./subzona-tarifaria").ISubzonaTarifaria;
  grupos?: import("./grupo").IGrupo[];
  agrupaciones?: import("../gas/agrupacion/schema").IAgrupacion[];
  cuenca?: import("./cuenca").ICuenca;
  cuenta?: ICuentaCliente;
  zonasBalance?: import("./zona-balance").IZonaBalance[];
}

////// CREATE/UPDATE
export const CreatePuntoMedicionSchema = PuntoMedicionSchema.omit({
  _id: true,
  correctora: true,
  unidadPresion: true,
  medidorResidencial: true,
  medidorResidencialAgua: true,
  medidorElectrico: true,
  scadas: true,
  cliente: true,
  unidadNegocio: true,
  centroOperativo: true,
  localidad2: true,
  subzonaTarifaria: true,
  grupos: true,
  agrupaciones: true,
  cuenca: true,
  cuenta: true,
  zonasBalance: true,
});
export const UpdatePuntoMedicionSchema = CreatePuntoMedicionSchema;
type Omitir =
  | "_id"
  | "correctora"
  | "unidadPresion"
  | "medidorResidencial"
  | "medidorResidencialAgua"
  | "medidorElectrico"
  | "scadas"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "localidad2"
  | "subzonaTarifaria"
  | "grupos"
  | "agrupaciones"
  | "cuenca"
  | "cuenta"
  | "zonasBalance";
export interface ICreatePuntoMedicion extends Omit<
  Partial<IPuntoMedicion>,
  Omitir
> {}

export interface IUpdatePuntoMedicion extends Omit<
  Partial<IPuntoMedicion>,
  Omitir
> {}
