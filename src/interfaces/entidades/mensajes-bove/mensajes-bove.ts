import { z } from "zod";

/**
 * Respuesta a comando downlink
 * Confirmación de configuración o lectura
 */
export const RespuestaComandoBoveSchema = z.object({
  comandoRespondido: z.string().optional(), // Tipo de comando (e.g., "SET_INTERVAL")
  valorConfirmado: z.any().optional(), // Valor confirmado (e.g., intervalo en minutos)
  exito: z.boolean().optional(), // Si el comando fue exitoso

  tipoReporte: z.literal("respuesta-comando").optional(),
  timestamp: z.string().optional(), // Timestamp de recepción
  deviceMeterNumber: z.string().optional(), // Número de serie
  modoTransmision: z.literal("lora-confirmed").optional(), // Generalmente confirmed
});
export type IRespuestaComandoBove = z.infer<typeof RespuestaComandoBoveSchema>;
