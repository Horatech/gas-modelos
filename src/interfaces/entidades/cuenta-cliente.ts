import { ICoordenadas } from "../auxiliares";
import { ICentroOperativo, IUnidadNegocio } from "../gas";
import { Division } from "../tenant";
import { IPuntoMedicion } from "./punto-medicion";

/**
 * Cuenta / Inmueble — agrupador de facturación proveniente de una integración
 * externa (p. ej. Sistema Manantial de AYSAM). Una cuenta agrupa N puntos de
 * medición (análogo a las "conexiones" de Manantial, que cuelgan de un
 * inmueble/cuenta). No es obligatoria: solo la usan los clientes con la
 * integración activa (capability `IConfigCliente.gestionCuentas`). Los PMs se
 * vinculan vía `IPuntoMedicion.idCuenta`.
 */
export interface ICuentaCliente {
  _id?: string;
  fechaCreacion?: string;
  // Identidad
  numeroCuenta?: string; // INM_CUENTA — único por cliente
  titular?: string;
  // Metadatos de inmueble (datos fijos que devuelve el sistema externo)
  codRegimen?: number;
  regimen?: string; // p. ej. "C.Fija + exceso"
  coefZonal?: number;
  baseConsumo?: number;
  supTerreno?: number;
  domicilio?: string;
  ubicacion?: ICoordenadas; // coord_x / coord_y del inmueble
  codProvincia?: number;
  provincia?: string;
  codDepartamento?: number;
  departamento?: string;
  codLocalidad?: number;
  localidad?: string;
  // Identidad externa (idempotencia de la ingesta)
  codigoExternoInmueble?: string; // inm_id del sistema externo
  // Bag para el resto de campos externos no modelados (fidelidad sin bloat)
  datosExternos?: Record<string, any>;
  // Estado
  estado?: "Activa" | "Baja";
  fechaBaja?: string | null;
  // Tenancy
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  division?: Division;
  // Virtuals
  puntosMedicion?: IPuntoMedicion[]; // las conexiones de la cuenta
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "puntosMedicion"
  | "unidadNegocio"
  | "centroOperativo";
export interface ICreateCuentaCliente
  extends Omit<Partial<ICuentaCliente>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "puntosMedicion"
  | "unidadNegocio"
  | "centroOperativo";
export interface IUpdateCuentaCliente
  extends Omit<Partial<ICuentaCliente>, OmitirUpdate> {}
