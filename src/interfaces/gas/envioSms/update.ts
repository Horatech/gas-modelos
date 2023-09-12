import { Agrupacion, TipoAlerta } from "./schema";

export interface IUpdateEnvioSms {
  idCliente?: string;
  tiposAlerta?: TipoAlerta[];
  agrupacion?: Agrupacion;

  idUnidadNegocio?: string | null;
  idCentroOperativo?: string | null;
  idGrupo?: string | null;

  idsUsuarios?: string[];
}
