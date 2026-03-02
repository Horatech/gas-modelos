export interface IReporteHyzim188b {
  timestamp?: string;

  // HyZim-188B
  flujoPositivo?: number;
  flujoNegativo?: number;
  voltajeBateria?: number;
  unidad?: string; // 1L

  // Campos inferidos
  flujoPositivoParcial?: number; // Flujo positivo desde el último reporte
  flujoNegativoParcial?: number; // Flujo negativo desde el último reporte
}

export type IReporteMedidorAgua = IReporteHyzim188b;
