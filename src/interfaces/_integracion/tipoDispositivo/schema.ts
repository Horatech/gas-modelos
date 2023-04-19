import { TipoDispositivo } from "../auxiliares";
import { IConfigLora } from "./configLora";

export interface ITipoDispositivo {
  _id: string;
  nombre: TipoDispositivo;
  integrationUrl?: string;
  loraServers?: IConfigLora[];
}
