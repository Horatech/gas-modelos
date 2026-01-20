import { IReporteDiarioEUW300, IReporteHorarioEUW300 } from "./euw300";
import { IReporteTotalizadorBove, IReporteLogsHorariosBove } from "./bove";
import { IReporteNSP } from "./nsp";
import { IReporteNUC } from "./nuc";
import { IInputsRegistrosNUCV2 } from "./nucv2-inputs-registros";
import { ITestigoNUCV2 } from "./nucv2-testigo";
import { IReporteScada } from "./scada";
import { IReporteSML } from "./sml";
import { IReporteVeribox } from "./veribox";
import { IReporteWRC } from "./wrc";

export type IValoresReporte =
  | IReporteNUC
  | IInputsRegistrosNUCV2
  | ITestigoNUCV2
  | IReporteNSP
  | IReporteVeribox
  | IReporteWRC
  | IReporteSML
  | IReporteScada
  | IReporteDiarioEUW300
  | IReporteHorarioEUW300
  | IReporteTotalizadorBove
  | IReporteLogsHorariosBove;
