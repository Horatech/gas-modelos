import { ILoraServer } from "./lora-server.model";
import { TipoDispositivo } from "./tipo-dispositivo.model";

export interface ILoraServerConfigPorApp {
  idLoraServer: string;
  deviceProfileID?: string;
  //
  loraServer?: ILoraServer;
}

export interface ICreateTipoDispositivo {
  nombre: TipoDispositivo;
  integrationUrl?: string;
  loraServers?: ILoraServerConfigPorApp[];
}

export interface IUpdateTipoDispositivo {
  nombre?: TipoDispositivo;
  integrationUrl?: string;
  loraServers?: ILoraServerConfigPorApp[];
}
