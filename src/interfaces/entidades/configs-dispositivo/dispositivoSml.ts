export interface IDispositivoSml {
  // Comunicacion
  ip?: string;
  port?: number;

  // Info de la sim
  iccid?: number;
  operadora?: string;
  telefono?: string;

  // Configuracion del SML
  frecuenciaReporte?: number; // Minutos
}
