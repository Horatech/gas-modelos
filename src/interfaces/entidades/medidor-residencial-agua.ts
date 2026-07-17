import { ICoordenadas } from '../auxiliares';
import { ICentroOperativo, IUnidadNegocio } from '../gas';
import { IEstado } from './correctora';
import { ICuenca } from './cuenca';
import { IDispositivo } from './dispositivo';
import { IGrupo } from './grupo';
import { ILocalidad } from './localidad';
import { IReporte } from './reporte';

export interface ITitularMedidorResidencialAgua {
  nombre?: string;
  tipo: 'persona' | 'empresa';
  documento?: string; // DNI o CUIT
  tipoDocumento?: 'DNI' | 'CUIT';
  telefono?: string;
  email?: string;
  // Estado
  activo?: boolean;
}

export interface IMedidorResidencialAgua {
  _id?: string;
  //
  deviceMeterNumber?: string;
  deveui?: string;
  deviceName?: string;
  fechaCreacion?: string;
  //
  ultimoReporte?: IReporte;
  estadoActual?: IEstado;
  //
  consumoInicial?: number;
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  nombre?: string;
  descripcion?: string;
  titular?: ITitularMedidorResidencialAgua;
  corregido?: boolean;
  modelo?: string; /// Accell, Actaris, Itron, Gallus, Elster + lo que escriba el usuario.
  // Metadatos / identidad externa (integración de facturación, p. ej. Manantial).
  // La UK externa del medidor es serie+letra; `serieAlfa` aloja la serie
  // alfanumérica externa cuando difiere del `deviceMeterNumber`.
  letra?: string; // MED_LETRA (parte de la UK externa serie+letra)
  serieAlfa?: string; // serie alfanumérica externa (si difiere de deviceMeterNumber)
  medIdExterno?: string; // MED_ID del sistema externo (idempotencia)
  diametro?: number;
  caudalMaximo?: number;
  claseMetrologica?: string;
  // Inicio de la asignación vigente medidor↔dispositivo (puntero abierto; el
  // vínculo de facto es `deveui`). Sin fecha de fin: la atribución histórica de
  // cada lectura la da el reporte (device.deveui + idsAsignados, inmutable).
  fechaAsignacionDispositivo?: string | null;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  localidad?: ILocalidad;
  cuenca?: ICuenca;
  grupos?: IGrupo[];
  dispositivo?: IDispositivo;
}

////// CREATE
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
