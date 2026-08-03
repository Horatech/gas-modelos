import { z } from "zod";
import { TipoScadaSchema } from "../scada";

/**
 * @property limiteHH - Limite superior alto es null cuando no existe
 * @property limiteH - Limite superior es null cuando no existe
 * @property limiteLL - Limite inferior bajo es null cuando no existe
 * @property limiteL - Limite inferior es null cuando no existe
 */
export const ReporteScadaSchema = z.object({
  tipo: TipoScadaSchema.optional(),
  timestamp: z.string().optional(),
  valorActual: z.union([z.number(), z.boolean()]).optional(),
  limiteHH: z.number().nullable().optional(),
  limiteH: z.number().nullable().optional(),
  limiteLL: z.number().nullable().optional(),
  limiteL: z.number().nullable().optional(),
});
export type IReporteScada = z.infer<typeof ReporteScadaSchema>;
