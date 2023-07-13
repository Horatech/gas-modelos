export interface IDispositivoNsp4G {
  firmwareNsp: string;
  apiVersion: string;
  horaInicio: number;
  modoOperacion: "REG24_DIARIO";
  modoEnv: "PROD" | "TEST";
  limiteMin: number;
  limitaMax: number;
}
