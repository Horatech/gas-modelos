export interface ICreateRegistro {
  timestamp?: number;
  corrected?: number;
  uncorrected?: number;
  presion?: number;
  temperatura?: number;
  contador?: number;
  bateria?: number;
  // Valores firmware nuevo
  correctedTotalizado?: number;
  uncorrectedTotalizado?: number;
  correctedParcializado?: number;
  uncorrectedParcializado?: number;
  caudalCorregido?: number;
  caudalNoCorregido?: number;
  //
  numeroSerieCorrectora?: number;
  deveui?: string;
  deviceName?: string;
  modelo?: string;
  //
  idCliente: string;
  idUnidadNegocio?: string;
}
