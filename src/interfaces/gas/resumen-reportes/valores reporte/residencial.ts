import { z } from "zod";

export const ResumenReporteResidencialSchema = z.object({
  timestamp: z.string().optional(),
  consumoMin: z.number().optional(),
  consumoMax: z.number().optional(),
  consumoProm: z.number().optional(),
  unidad: z.string(),
  bateriaMin: z.number().optional(),
  bateriaMax: z.number().optional(),
  bateriaProm: z.number().optional(),
});
export type IResumenReporteResidencial = z.infer<
  typeof ResumenReporteResidencialSchema
>;
