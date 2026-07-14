import { GeoJSON, ICoordenadas } from "../auxiliares";
import { Division, ICliente } from "../tenant";
import { IAgrupacion } from "../gas/agrupacion";
import { ICentroOperativo } from "../gas/centroOperativo";
import { IUnidadNegocio } from "../gas/unidadNegocio";
import { ICorrectora, IEstado } from "./correctora";
import { ITipoAlerta } from "./alerta";
import { IUnidadPresion } from "./unidad-presion";
import { ILocalidad } from "./localidad";
import { IGrupo } from "./grupo";
import { ISubzonaTarifaria } from "./subzona-tarifaria";
import { IMedidorResidencial } from "./medidor-residencial";
import { IMedidorResidencialAgua } from "./medidor-residencial-agua";
import { IMedidorElectrico } from "./medidor-electrico";
import { IScada } from "./scada";
import { ICuenca } from "./cuenca";
import { ICuentaCliente } from "./cuenta-cliente";
import { IDispositivoEUW300 } from "./configs-dispositivo";
import { IDispositivoExternoNuc } from "./dispositivo-externo-nuc";

export interface ILimitesNotificacion {
  sms?: number;
  whatsapp?: number;
  llamada?: number;
  email?: number;
  push?: number;
}

// Estado del Factor de Carga: "Parcial" si el punto tiene menos de 365 días de
// reportes; "Completo" si tiene 365 días o más.
export type FactorCargaEstado = "Parcial" | "Completo";

export interface IPuntoMedicion {
  _id?: string;
  // GPS
  geojson?: GeoJSON;
  ubicacion?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  // Detalles
  nombre?: string;
  descripcion?: string;
  codigoSimec?: string; // Para exportacion de datos a Simec
  numeroSuministro?: string; // Identificador Numero de Suministro para facturacion
  // Cuenta / agrupador de facturación (integración externa, p. ej. Manantial).
  // Opcional: solo lo usan clientes con la integración activa. El PM equivale a
  // una "conexión"; la cuenta agrupa varias conexiones (ver ICuentaCliente).
  idCuenta?: string | null;
  codigoExternoConexion?: string; // con_id del sistema externo
  codigoExternoInmueble?: string; // inm_id (parte de la PK compuesta externa)
  diametroConexion?: number;
  materialConexion?: string;
  facturable?: boolean;
  // La "ruta" del sistema externo (nivel conexión) se modela como IAgrupacion y
  // se vincula vía `idsAgrupaciones` (más abajo); la ingesta hace find-or-create
  // de la agrupación por nombre. No se guarda como string suelto.
  // Dispositivo externo NUC
  idsDipositivosExternosNuc?: string[] | null;
  fechaAsignacionDispositivoExternoNuc?: string | null;
  // Correctora
  idCorrectora?: string | null;
  fechaAsignacionCorrectora?: string | null;
  desfaseHorario?: number | null;
  // Unidad de Presion
  idUnidadPresion?: string | null;
  fechaAsignacionUnidadPresion?: string | null;
  // Medidor Residencial
  idMedidorResidencial?: string | null;
  fechaAsignacionMedidorResidencial?: string | null;
  // Medidor Residencial Agua
  idMedidorResidencialAgua?: string | null;
  fechaAsignacionMedidorResidencialAgua?: string | null;
  // Cierre de ventana de asignación vigente (modelo temporal mínimo viable):
  // al reasignar/desasignar, se setea el fin antes de pisar el puntero.
  fechaFinAsignacionMedidorResidencialAgua?: string | null;
  // Medidor Electrico
  idMedidorElectrico?: string | null;
  fechaAsignacionMedidorElectrico?: string | null;
  // SCADA
  idsScada?: string[] | null;
  fechaAsignacionScada?: string | null;
  posicion?: number; // Orden en el listado
  // Calculado por el backend
  estado?: IEstado;
  timestampUltimoReporte?: string | null;
  // Tipos de alerta activos (denormalizado para subfiltrar el listado por tipo
  // de alerta cuando estado === "Alerta"). Espeja la señal de estado en los
  // write-paths de cada división; SCADA lo recomputa desde alertas activas.
  tiposAlertaActivos?: ITipoAlerta[];
  // Factor de Carga (FC) — solo división Residencial. Denormalizado por el cron
  // de gas-cron (recalcularFactorCargaResidencial en gas-datos) a partir de la
  // serie de consumos diarios del punto (sus reportes, vía idsAsignados).
  // FC = (Σ consumos diarios / días con consumo) / consumo diario máximo. ≤ 1.
  factorCarga?: number | null;
  factorCargaEstado?: FactorCargaEstado | null;
  fechaConsumoMaximo?: string | null; // fecha del día de mayor consumo del período
  fechaCalculoFactorCarga?: string | null; // última vez que se computó
  // Tenancy
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idSubzonaTarifaria?: string; // solo división Residencial
  idsGrupos?: string[];
  idsAgrupaciones?: string[];
  idCuenca?: string;
  division?: Division;
  // Notificaciones
  limitesNotificacion?: ILimitesNotificacion;
  // Virtuals
  correctora?: ICorrectora;
  unidadPresion?: IUnidadPresion;
  medidorResidencial?: IMedidorResidencial;
  medidorResidencialAgua?: IMedidorResidencialAgua;
  medidorElectrico?: IMedidorElectrico;
  scadas?: IScada[];
  dispositivosExternosNuc?: IDispositivoExternoNuc[];
  cliente?: ICliente;
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad2?: ILocalidad;
  subzonaTarifaria?: ISubzonaTarifaria;
  grupos?: IGrupo[];
  agrupaciones?: IAgrupacion[];
  cuenca?: ICuenca;
  cuenta?: ICuentaCliente;
}

////// CREATE/UPDATE
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
  | "cuenta";
export interface ICreatePuntoMedicion extends Omit<
  Partial<IPuntoMedicion>,
  Omitir
> {}

export interface IUpdatePuntoMedicion extends Omit<
  Partial<IPuntoMedicion>,
  Omitir
> {}
