import { ILoraServerConfigPorApp } from "./tipo-dispositivo.dto";

export type TipoDispositivo = "NUC" | "SML";

export interface ITipoDispositivo {
  _id: string;
  nombre: TipoDispositivo;
  integrationUrl?: string;
  loraServers?: ILoraServerConfigPorApp[];
}
