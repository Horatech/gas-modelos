import { TipoLoraServer } from "./lora-server.model";

export interface ICreateLoraServer {
  nombre: string;
  url: string;
  tipo: TipoLoraServer;
  // ChirpStack
  token?: string;
  organizationID?: string;
  serviceProfileID?: string;
  integrationUrl?: string;
  // Orbiwise
  user?: string;
  pass?: string;
  serviceProfileUUID?: string;
}

export interface IUpdateLoraServer {
  nombre?: string;
  url?: string;
  tipo?: TipoLoraServer;
  // ChirpStack
  token?: string;
  organizationID?: string;
  serviceProfileID?: string;
  integrationUrl?: string;
  // Orbiwise
  user?: string;
  pass?: string;
  serviceProfileUUID?: string;
}
