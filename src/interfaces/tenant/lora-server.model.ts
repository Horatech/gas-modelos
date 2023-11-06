export type TipoLoraServer = "ChirpStack" | "Orbiwise" | "Actility" | "WMC";

export interface ILoraServer {
  _id?: string;
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
