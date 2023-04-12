import { IDispositivo } from "../dispositivo.model";

export interface IConfigDispositivoNUC4G {
  horaInicio: number;
  modoOperacion: "REG1_DIARIO" | "REG24_DIARIO" | "REG8_8HORAS";
  modoEnv: "TEST" | "PROD";
  claveMercury: string;
  modoRegistros: "REG_TOTALIZADOS" | "REG_PARCIALES";
}

export interface IConfigDispositivo {
  // Info autogenerada
  _id: string;
  idCliente: string;
  // Info de carga
  deveui: string;
  config: Record<string, any>;
  // Virtuals
  dispositivo?: IDispositivo;
}
