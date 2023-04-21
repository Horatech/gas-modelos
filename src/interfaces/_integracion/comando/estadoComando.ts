export interface IEstadoComando {
  fechaActualizacion?: string;
  fCnt?: string;
  estado?: "Pendiente" | "Ejecutado" | "Error";
  fallos?: number;
}
