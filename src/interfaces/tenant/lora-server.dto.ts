export interface ICreateLoraServer {
  url: string;
  token?: string;
  organizationID?: string;
  serviceProfileID?: string;
  integrationUrl?: string;
}

export interface IUpdateLoraServer {
  url?: string;
  token?: string;
  organizationID?: string;
  serviceProfileID?: string;
  integrationUrl?: string;
}
