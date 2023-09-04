import { TipoAlerta } from "./schema";

export interface ICreateEnvioSms {
  idCliente?: string;
  tiposAlerta?: TipoAlerta[];

  idUnidadNegocio?: string | null;
  idCentroOperativo?: string | null;
  idsGrupos?: string[] | null;

  telefonosUnidadNegocio?: string[] | null;
  telefonosCentroOperativo?: string[] | null;
  telefonosGrupos?: string[] | null;
}
