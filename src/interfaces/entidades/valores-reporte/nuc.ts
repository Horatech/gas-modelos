import { z } from "zod";

export const ReporteNUCSchema = z.object({
  timestamp: z.string().optional(),
  corrected: z.number().optional(),
  uncorrected: z.number().optional(),
  presion: z.number().optional(),
  temperatura: z.number().optional(),
  bateria: z.number().optional(),
  // Valores firmware nuevo
  correctedTotalizado: z.number().optional(),
  uncorrectedTotalizado: z.number().optional(),
  correctedParcializado: z.number().optional(),
  uncorrectedParcializado: z.number().optional(),
  caudalPico: z.number().optional(),
  caudalPromedio: z.number().optional(),
  fpv: z.number().optional(), // Factor de compresibilidad
});
export type IReporteNUC = z.infer<typeof ReporteNUCSchema>;
