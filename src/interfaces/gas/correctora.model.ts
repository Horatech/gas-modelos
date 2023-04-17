import { ICoordenadas } from "../auxiliares";
import { IDispositivo } from "../tenant";
import { IAlerta } from "./alerta";
import { ICentroOperativo } from "./centroOperativo.model";
import { ICromatografia } from "./cromatografia.model";
import { ICuenca } from "./cuenca.model";
import { IGrupo } from "./grupo.model";
import { IRegistro } from "./registro.model";
import { IUnidadNegocio } from "./unidadNegocio.model";

export interface ICorrectora {
  _id: string;
  //
  firmware: string;
  numeroSerie: number;
  deveui: string;
  deviceName?: string;
  modelo: string;
  fechaCreacion: string;
  bateria?: number;
  //
  ultimoRegistro?: IRegistro;
  ultimaAlerta?: IAlerta;
  ultimaCromatografia?: ICromatografia;
  fechaUltimaCromatografia?: string;
  //
  ubicacionGps?: ICoordenadas;
  direccion?: string;
  localidad?: string;
  nombre?: string;
  descripcion?: string;
  codigoSimec?: string;
  //
  idCliente: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idCuenca?: string;
  idsGrupos?: string[];
  // Populate
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  cuenca?: ICuenca;
  grupos?: IGrupo[];
  dispositivo?: IDispositivo;
}
