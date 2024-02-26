export interface IResumenReporteNSP {
  timestamp?: string;
  temperaturaMin?: number;
  temperaturaMax?: number;
  temperaturaProm?: number;
  presionMin?: number;
  presionMax?: number;
  presionProm?: number;
  unidad: string;
  bateriaProm?: number;
}
