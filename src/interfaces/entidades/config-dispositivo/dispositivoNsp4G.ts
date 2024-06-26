export interface IDispositivoNsp4G {
  firmwareNsp?: string;
  apiVersion?: string;
  horaInicio?: number;
  modoOperacion?:
    | "REG1_DIARIO"
    | "REG24_DIARIO"
    | "REG1_1HORA"
    | "REG2_2HORAS"
    | "REG3_3HORAS"
    | "REG4_4HORAS"
    | "REG6_6HORAS"
    | "REG8_8HORAS"
    | "REG12_12HORAS";
  modoEnv?: "PROD" | "TEST";
  limiteMin?: number;
  limiteMax?: number;
  medicionInstantanea?: number;
  voltajeBateria?: number;
  telefono1?: string;
  telefono2?: string;
  telefono3?: string;
  lugar?: string;
}
