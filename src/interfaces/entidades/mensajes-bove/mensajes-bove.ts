/**
 * Respuesta a comando downlink
 * Confirmación de configuración o lectura
 */
export interface IRespuestaComandoBove {
  comandoRespondido?: string; // Tipo de comando (e.g., "SET_INTERVAL")
  valorConfirmado?: any; // Valor confirmado (e.g., intervalo en minutos)
  exito?: boolean; // Si el comando fue exitoso

  tipoReporte?: "respuesta-comando";
  timestamp?: string; // Timestamp de recepción
  deviceMeterNumber?: string; // Número de serie
  modoTransmision?: "lora-confirmed"; // Generalmente confirmed
}
