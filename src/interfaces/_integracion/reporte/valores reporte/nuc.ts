export interface IReporteNUC {
  timestamp?: string;
  corrected?: number;
  uncorrected?: number;
  presion?: number;
  temperatura?: number;
  bateria?: number;
  // Valores firmware nuevo
  correctedTotalizado?: number;
  uncorrectedTotalizado?: number;
  correctedParcializado?: number;
  uncorrectedParcializado?: number;
  caudalCorregido?: number;
  caudalNoCorregido?: number;
}
