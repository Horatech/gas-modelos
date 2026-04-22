export interface IReporteML107GH {
  timestamp?: string;

  // ML107GH
  flujoPositivo?: number;
  flujoNegativo?: number;
  voltajeBateria?: number;
  unidad?: string; // 1L

  // Campos inferidos
  flujoPositivoParcial?: number; // Flujo positivo desde el último reporte
  flujoNegativoParcial?: number; // Flujo negativo desde el último reporte
}

export type IReporteMedidorAgua = IReporteML107GH;
