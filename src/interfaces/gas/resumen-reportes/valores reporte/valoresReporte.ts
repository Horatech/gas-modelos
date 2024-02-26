import { IResumenReporteNSP } from "./nsp";
import { IResumenReporteVeribox } from "./veribox";

export type IValoresResumenReporte =
  | IResumenReporteNSP
  | IResumenReporteVeribox;
