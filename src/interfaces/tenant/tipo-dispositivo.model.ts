export type TipoDispositivo = "NUC" | "SML";

export interface ITipoDispositivo {
  _id: string;
  nombre: TipoDispositivo;
  deviceProfileID?: string;
  integrationUrl?: string;
}
