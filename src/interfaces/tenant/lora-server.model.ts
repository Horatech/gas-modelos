export type TipoLoraServer =
  | "ChirpStack"
  | "ChirpStackV4"
  | "Orbiwise"
  | "Actility"
  | "WMC";

export interface ILoraServer {
  _id?: string;
  nombre?: string;
  url?: string;
  tipo?: TipoLoraServer;
  // ChirpStack v3
  token?: string;
  organizationID?: string;
  serviceProfileID?: string;
  integrationUrl?: string;
  // ChirpStack v4 (NS externo: triple tenant/app/DP preexistente)
  apiToken?: string;
  tenantId?: string;
  applicationId?: string;
  deviceProfileId?: string;
  // Apikey que el operador cargó en la integración HTTP del NS externo.
  // Sólo informativo: la apikey que valida la ingesta vive en env del servicio.
  integrationApikey?: string;
  // Orbiwise
  user?: string;
  pass?: string;
  serviceProfileUUID?: string;
}
