import { ICentroOperativo } from "../centroOperativo";
import { IGrupo } from "../grupo";
import { IUnidadNegocio } from "../unidadNegocio";

export type TipoAlerta = "Unidades Presión - Fuera de límite ";

export interface IEnvioSms {
  _id?: string;
  idCliente?: string;
  tiposAlerta?: TipoAlerta[];

  idUnidadNegocio?: string | null;
  idCentroOperativo?: string | null;
  idsGrupos?: string[] | null;

  telefonosUnidadNegocio?: string[] | null;
  telefonosCentroOperativo?: string[] | null;
  telefonosGrupos?: string[] | null;

  // Virtual
  unidadNegocio?: IUnidadNegocio;
  centroOperativo?: ICentroOperativo;
  grupos?: IGrupo[];
}
