export type TipoLoraServer = "ChirpStack";

export interface ILoraServer {
  _id: string;
  nombre: string;
  url: string;
  tipo: TipoLoraServer;
  token?: string;
  organizationID?: string;
  serviceProfileID?: string;
  integrationUrl?: string;
}
