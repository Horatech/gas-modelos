import { Agrupacion, TipoAlerta } from "./schema";

export interface ICreateEnvioSms {
  idCliente?: string;
  tiposAlerta?: TipoAlerta[];
  agrupacion?: Agrupacion;

  idUnidadNegocio?: string | null;
  idCentroOperativo?: string | null;
  idGrupo?: string | null;

  idsUsuarios?: string[];
}
