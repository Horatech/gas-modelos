import { z } from "zod";

export const LogReporteVeriboxSchema = z.object({
  cantidadReportes: z.number().optional(),
  alerta: z.boolean().optional(),
});
export type ILogReporteVeribox = z.infer<typeof LogReporteVeriboxSchema>;
