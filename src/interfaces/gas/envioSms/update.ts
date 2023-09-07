import { Agrupacion, TipoAlerta } from "./schema";

export interface IUpdateEnvioSms {
  idCliente?: string;
  tiposAlerta?: TipoAlerta[];
  agrupacion?: Agrupacion;

  idUnidadNegocio?: string | null;
  idCentroOperativo?: string | null;
  idsGrupos?: string[] | null;

  idsUsuarios?: string[];
}
