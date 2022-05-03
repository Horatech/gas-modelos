export type TipoDispositivo = "NUC" | "SML";

export interface ITipoDispositivo {
  _id: string;
  nombre: TipoDispositivo;
  integrationUrl?: string;
  // ChirpStack
  deviceProfileID?: string;
  // Orbiwise
  deviceProfileUUID?: string;
}
