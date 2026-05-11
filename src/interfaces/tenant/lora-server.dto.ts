import { TipoLoraServer } from "./lora-server.model";

export interface ICreateLoraServer {
  nombre: string;
  url: string;
  tipo: TipoLoraServer;
  // ChirpStack v3
  token?: string;
  organizationID?: string;
  serviceProfileID?: string;
  integrationUrl?: string;
  // ChirpStack v4 (NS externo)
  apiToken?: string;
  tenantId?: string;
  applicationId?: string;
  deviceProfileId?: string;
  integrationApikey?: string;
  // Orbiwise
  user?: string;
  pass?: string;
  serviceProfileUUID?: string;
}

export interface IUpdateLoraServer {
  nombre?: string;
  url?: string;
  tipo?: TipoLoraServer;
  // ChirpStack v3
  token?: string;
  organizationID?: string;
  serviceProfileID?: string;
  integrationUrl?: string;
  // ChirpStack v4 (NS externo)
  apiToken?: string;
  tenantId?: string;
  applicationId?: string;
  deviceProfileId?: string;
  integrationApikey?: string;
  // Orbiwise
  user?: string;
  pass?: string;
  serviceProfileUUID?: string;
}
