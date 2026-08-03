import { z } from "zod";
import { ReporteDiarioEUW300Schema, ReporteHorarioEUW300Schema } from "./euw300";
import { ReporteTotalizadorBoveSchema, ReporteLogsHorariosBoveSchema } from "./bove";
import { ReporteNSPSchema } from "./nsp";
import { ReporteNUCSchema } from "./nuc";
import { ReporteScadaSchema } from "./scada";
import { ReporteSMLSchema } from "./sml";
import { ReporteVeriboxSchema } from "./veribox";
import { ReporteWRCSchema } from "./wrc";
import { ReporteInputsNucSchema } from "./reporte-inputs-nuc";
import { ReporteOCRSchema } from "./ocr";
import { ReporteUWMNBSchema } from "./uwm-nb";

// Unión heterogénea sin discriminante limpio -> z.union simple (no
// z.discriminatedUnion). Parte del SCC de IDispositivo vía
// reporte-inputs-nuc.ts (ver CLAUDE.md, "De solo tipos a schemas Zod").
export const ValoresReporteSchema = z.union([
  ReporteNUCSchema,
  ReporteNSPSchema,
  ReporteVeriboxSchema,
  ReporteWRCSchema,
  ReporteSMLSchema,
  ReporteScadaSchema,
  ReporteDiarioEUW300Schema,
  ReporteHorarioEUW300Schema,
  ReporteTotalizadorBoveSchema,
  ReporteLogsHorariosBoveSchema,
  ReporteInputsNucSchema,
  ReporteOCRSchema,
  ReporteUWMNBSchema,
]);
export type IValoresReporte = z.infer<typeof ValoresReporteSchema>;
