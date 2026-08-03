import { z } from "zod";

export const ReporteML107GHSchema = z.object({
  timestamp: z.string().optional(),

  // ML107GH
  flujoPositivo: z.number().optional(),
  flujoNegativo: z.number().optional(),
  voltajeBateria: z.number().optional(),
  unidad: z.string().optional(), // 1L

  // Campos inferidos
  flujoPositivoParcial: z.number().optional(), // Flujo positivo desde el último reporte
  flujoNegativoParcial: z.number().optional(), // Flujo negativo desde el último reporte
});
export type IReporteML107GH = z.infer<typeof ReporteML107GHSchema>;

export const ReporteMedidorAguaSchema = ReporteML107GHSchema;
export type IReporteMedidorAgua = IReporteML107GH;
