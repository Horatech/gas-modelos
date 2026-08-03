/**
 * Configuracion del dispositivo NME (medidor electrico LoRaWAN, ESP32-S3 + HEXING HXE34K-S).
 * Ver INTEGRACION_LORAWAN_NUBE.md. Alta OTAA con JoinEUI = DevEUI, AU915, Clase C.
 */

import { z } from "zod";

export const DispositivoNmeSchema = z.object({
  // Alta LoRaWAN (OTAA)
  joinEui: z.string().optional(), // IGUAL al DevEUI
  appkey: z.string().optional(),

  // Datos del medidor HEXING (fPort 104)
  serial: z.string().optional(),
  identificacion: z.string().optional(),

  // Config del device (fPort 100 / SET_CONFIG)
  tz: z.number().optional(), // Zona horaria en horas (i8, Argentina = -3)
  /**
   * @deprecated El firmware dejó de reportar este campo en junio 2026. Se
   * mantiene declarado por compatibilidad; el decoder ya no lo escribe, así que
   * los valores guardados quedan como estaban.
   */
  intervaloRegistroMin: z.number().optional(),
  horaReporteDiario: z.number().optional(), // Hora local del reporte diario (0-23)
  versionFw: z.number().optional(),
  resetReason: z.number().optional(), // enum esp_reset_reason_t

  // byte_estado (fPort 100)
  energiaExterna: z.boolean().optional(), // hay 220 VAC presente
  medidorOk: z.boolean().optional(), // ultima lectura OK
  modoBajoConsumo: z.boolean().optional(), // light sleep activo
  modoEmergencia: z.boolean().optional(), // SPIFFS en fallo

  /**
   * Métricas que el equipo reporta por LoRaWAN (`reporte_mask` del fPort 100).
   * `bit = métrica_base + 8×tarifa`; el reporte diario de cada métrica viaja por
   * el fPort `110 + bit`. Es CONFIGURACIÓN: lo fija SET_CONFIG (o BLE).
   *
   * NO indica disponibilidad: una métrica puede estar habilitada y no
   * disponible (el puerto viaja "sin dato"), o disponible y no habilitada (el
   * equipo la registra pero no la reporta). Para disponibilidad, disponibleMask.
   *
   * Solo lo mandan los equipos con el fPort 100 de 11 bytes.
   */
  reporteMask: z.number().optional(),

  /**
   * OBIS que el medidor lista realmente en su readout (`disponible_mask` del
   * fPort 100). Mismos bits que reporteMask. Es OBSERVACIÓN, read-only.
   * `0` = el equipo todavía no leyó el medidor (no "el medidor no entrega nada").
   *
   * El equipo emite un fPort 100 espontáneo (máx. 1/hora) cuando este mask
   * cambia — p.ej. al reconfigurar el medidor para exponer el 2.6.0.
   */
  disponibleMask: z.number().optional(),
});
export type IDispositivoNme = z.infer<typeof DispositivoNmeSchema>;
