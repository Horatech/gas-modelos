import { TipoDispositivo } from "../auxiliares";
import { ILoraServerConfigPorApp } from "./tipo-dispositivo.dto";

export interface ITipoDispositivo {
  _id: string;
  nombre: TipoDispositivo;
  integrationUrl?: string;
  loraServers?: ILoraServerConfigPorApp[];
}
