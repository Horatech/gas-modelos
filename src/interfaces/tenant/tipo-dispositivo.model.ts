export type TipoDispositivo = "NUC" | "SML";

export interface ITipoDispositivo {
  nombre: TipoDispositivo;
  deviceProfileID?: string;
  integrationUrl?: string;
}
