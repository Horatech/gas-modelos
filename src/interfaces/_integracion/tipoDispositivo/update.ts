import { IConfigLora } from "./configLora";
import { TipoDispositivo } from "./tipoDispositivo";

export interface IUpdateTipoDispositivo {
  nombre?: TipoDispositivo;
  integrationUrl?: string;
  loraServers?: IConfigLora[];
}
