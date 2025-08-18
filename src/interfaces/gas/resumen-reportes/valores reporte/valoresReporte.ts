import { IResumenReporteNSP } from "./nsp";
import { IResumenReporteVeribox } from "./veribox";
import { IResumenReporteResidencial } from "./residencial";

export type IValoresResumenReporte =
  | IResumenReporteNSP
  | IResumenReporteVeribox
  | IResumenReporteResidencial;
