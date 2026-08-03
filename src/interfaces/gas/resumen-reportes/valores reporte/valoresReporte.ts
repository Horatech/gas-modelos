import { z } from "zod";
import { ResumenReporteNSPSchema } from "./nsp";
import { ResumenReporteVeriboxSchema } from "./veribox";
import { ResumenReporteResidencialSchema } from "./residencial";

export const ValoresResumenReporteSchema = z.union([
  ResumenReporteNSPSchema,
  ResumenReporteVeriboxSchema,
  ResumenReporteResidencialSchema,
]);
export type IValoresResumenReporte = z.infer<
  typeof ValoresResumenReporteSchema
>;
