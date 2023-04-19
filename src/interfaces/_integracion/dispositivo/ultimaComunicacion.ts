export interface IUltimaComunicacion {
  fecha?: string;
  estado?: "ok" | "alerta";
  snr?: number;
  rssi?: number;
  adr?: boolean;
  dr?: number;
}
