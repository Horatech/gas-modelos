import { z } from "zod";

export const ResumenReporteVeriboxSchema = z.object({
  timestamp: z.string().optional(),
  presionMin: z.number().optional(),
  presionMax: z.number().optional(),
  presionProm: z.number().optional(),
  unidad: z.string(),
  bateriaProm: z.number().optional(),
});
export type IResumenReporteVeribox = z.infer<
  typeof ResumenReporteVeriboxSchema
>;
