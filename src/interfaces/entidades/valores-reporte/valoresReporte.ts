import { IReporteDiarioEUW300, IReporteHorarioEUW300 } from "./euw300";
import { IReporteTotalizadorBove, IReporteLogsHorariosBove } from "./bove";
import { IReporteNSP } from "./nsp";
import { IReporteNUC } from "./nuc";
import { IReporteScada } from "./scada";
import { IReporteSML } from "./sml";
import { IReporteVeribox } from "./veribox";
import { IReporteWRC } from "./wrc";
import { IReporteInputsNuc } from "./reporte-inputs-nuc";

export type IValoresReporte =
  | IReporteNUC
  | IReporteNSP
  | IReporteVeribox
  | IReporteWRC
  | IReporteSML
  | IReporteScada
  | IReporteDiarioEUW300
  | IReporteHorarioEUW300
  | IReporteTotalizadorBove
  | IReporteLogsHorariosBove
  | IReporteInputsNuc;
