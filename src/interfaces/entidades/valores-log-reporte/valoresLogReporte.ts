import { z } from "zod";
import { LogReporteVeriboxSchema } from "./veribox";

export const ValoresLogReporteSchema = LogReporteVeriboxSchema;
export type IValoresLogReporte = z.infer<typeof ValoresLogReporteSchema>;
