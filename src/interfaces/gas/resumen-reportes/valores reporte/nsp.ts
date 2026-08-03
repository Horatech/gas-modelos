import { z } from "zod";

export const ResumenReporteNSPSchema = z.object({
  timestamp: z.string().optional(),
  temperaturaMin: z.number().optional(),
  temperaturaMax: z.number().optional(),
  temperaturaProm: z.number().optional(),
  presionMin: z.number().optional(),
  presionMax: z.number().optional(),
  presionProm: z.number().optional(),
  unidad: z.string(),
  bateriaProm: z.number().optional(),
});
export type IResumenReporteNSP = z.infer<typeof ResumenReporteNSPSchema>;
