import { z } from "zod";
import { ResumenReporteSchema } from "./schema";

export const UpdateResumenReporteSchema = ResumenReporteSchema.omit({
  _id: true,
});
export type IUpdateResumenReporte = z.infer<typeof UpdateResumenReporteSchema>;
