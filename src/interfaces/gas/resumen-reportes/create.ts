import { z } from "zod";
import { ResumenReporteSchema } from "./schema";

export const CreateResumenReporteSchema = ResumenReporteSchema.omit({
  _id: true,
});
export type ICreateResumenReporte = z.infer<typeof CreateResumenReporteSchema>;
