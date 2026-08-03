import { z } from "zod";

export const ReporteVeriboxSchema = z.object({
  timestamp: z.string().optional(),
  presion: z.number().optional(),
  unidad: z.string().optional(),
  bateria: z.number().optional(),
  gsmq: z.number().optional(),
});
export type IReporteVeribox = z.infer<typeof ReporteVeriboxSchema>;
