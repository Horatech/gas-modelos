import { Agrupacion, TipoAlerta } from "./schema";

export interface ICreateEnvioSms {
  idCliente?: string;
  tiposAlerta?: TipoAlerta[];
  agrupacion?: Agrupacion;

  idUnidadNegocio?: string | null;
  idCentroOperativo?: string | null;
  idsGrupos?: string[] | null;

  idsUsuarios?: string[];
}
