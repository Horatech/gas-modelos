import { TipoDispositivo } from "./tipo-dispositivo.model";

export interface ICreateTipoDispositivo {
  nombre: TipoDispositivo;
  deviceProfileID?: string;
  integrationUrl?: string;
}

export interface IUpdateTipoDispositivo {
  nombre?: TipoDispositivo;
  deviceProfileID?: string;
  integrationUrl?: string;
}
