import { TipoDispositivo } from "./tipo-dispositivo.model";

export interface ICreateTipoDispositivo {
  nombre: TipoDispositivo;
  integrationUrl?: string;
  // ChirpStack
  deviceProfileID?: string;
  // Orbiwise
  deviceProfileUUID?: string;
}

export interface IUpdateTipoDispositivo {
  nombre?: TipoDispositivo;
  integrationUrl?: string;
  // ChirpStack
  deviceProfileID?: string;
  // Orbiwise
  deviceProfileUUID?: string;
}
