import { z } from "zod";

export const ReporteNSPSchema = z.object({
  timestamp: z.string().optional(),
  temperatura: z.number().optional(),
  presion: z.number().optional(),
  unidad: z.string().optional(),
  bateria: z.number().optional(),
  sensor: z.number().optional(),
});
export type IReporteNSP = z.infer<typeof ReporteNSPSchema>;
