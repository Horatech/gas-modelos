import { z } from "zod";
import { CoordenadasSchema, ICoordenadas } from "../auxiliares/coordenadas";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { DivisionSchema } from "../tenant/usuario/permiso";
import { LocalidadSchema } from "./localidad";
import type { IPuntoMedicion } from "./punto-medicion";

/**
 * Cuenta / Inmueble — agrupador de facturación proveniente de una integración
 * externa (p. ej. Sistema Manantial de AYSAM). Una cuenta agrupa N puntos de
 * medición (análogo a las "conexiones" de Manantial, que cuelgan de un
 * inmueble/cuenta). No es obligatoria: solo la usan los clientes con la
 * integración activa (capability `IConfigCliente.gestionCuentas`). Los PMs se
 * vinculan vía `IPuntoMedicion.idCuenta`.
 */
export const EstadoCuentaClienteSchema = z.enum(["Activa", "Baja"]);
export type EstadoCuentaCliente = z.infer<typeof EstadoCuentaClienteSchema>;

/**
 * Cuenta / Inmueble — agrupador de facturación proveniente de una integración
 * externa (p. ej. Sistema Manantial de AYSAM). Populate intra-SCC
 * (IPuntoMedicion) como z.custom: ver CLAUDE.md, "De solo tipos a schemas Zod".
 */
export const CuentaClienteSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  numeroCuenta: z.string().optional(),
  titular: z.string().optional(),
  codRegimen: z.number().optional(),
  regimen: z.string().optional(),
  coefZonal: z.number().optional(),
  baseConsumo: z.number().optional(),
  supTerreno: z.number().optional(),
  domicilio: z.string().optional(),
  ubicacion: CoordenadasSchema.optional(),
  provincia: z.string().optional(),
  departamento: z.string().optional(),
  idLocalidad: z.string().optional(),
  codigoExternoInmueble: z.string().optional(),
  datosExternos: z.record(z.string(), z.any()).optional(),
  estado: EstadoCuentaClienteSchema.optional(),
  fechaBaja: z.string().nullable().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  division: DivisionSchema.optional(),
  // Virtuals
  puntosMedicion: z.array(z.custom<IPuntoMedicion>()).optional(),
  localidad: LocalidadSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
});

/**
 * Interface hand-written (mismo shape que el schema): parte del SCC de
 * IDispositivo, no usa z.infer.
 */
export interface ICuentaCliente {
  _id?: string;
  fechaCreacion?: string;
  numeroCuenta?: string;
  titular?: string;
  codRegimen?: number;
  regimen?: string;
  coefZonal?: number;
  baseConsumo?: number;
  supTerreno?: number;
  domicilio?: string;
  ubicacion?: ICoordenadas;
  provincia?: string;
  departamento?: string;
  idLocalidad?: string;
  codigoExternoInmueble?: string;
  datosExternos?: Record<string, any>;
  estado?: EstadoCuentaCliente;
  fechaBaja?: string | null;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  division?: import("../tenant/usuario/permiso").Division;
  puntosMedicion?: IPuntoMedicion[];
  localidad?: import("./localidad").ILocalidad;
  unidadNegocio?: import("../gas/unidadNegocio/schema").IUnidadNegocio;
  centroOperativo?: import("../gas/centroOperativo/schema").ICentroOperativo;
}

////// CREATE
export const CreateCuentaClienteSchema = CuentaClienteSchema.omit({
  _id: true,
  puntosMedicion: true,
  localidad: true,
  unidadNegocio: true,
  centroOperativo: true,
});
type OmitirCreate =
  | "_id"
  | "puntosMedicion"
  | "localidad"
  | "unidadNegocio"
  | "centroOperativo";
export interface ICreateCuentaCliente
  extends Omit<Partial<ICuentaCliente>, OmitirCreate> {}

////// UPDATE
export const UpdateCuentaClienteSchema = CreateCuentaClienteSchema;
type OmitirUpdate =
  | "_id"
  | "puntosMedicion"
  | "localidad"
  | "unidadNegocio"
  | "centroOperativo";
export interface IUpdateCuentaCliente
  extends Omit<Partial<ICuentaCliente>, OmitirUpdate> {}
