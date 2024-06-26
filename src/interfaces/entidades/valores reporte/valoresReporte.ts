import { IReporteWRC } from '../../gas';
import { IReporteNSP } from './nsp';
import { IReporteNUC } from './nuc';
import { IReporteVeribox } from './veribox';

export type IValoresReporte =
  | IReporteNUC
  | IReporteNSP
  | IReporteVeribox
  | IReporteWRC;
