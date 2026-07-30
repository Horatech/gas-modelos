/**
 * Configuracion del dispositivo NME (medidor electrico LoRaWAN, ESP32-S3 + HEXING HXE34K-S).
 * Ver INTEGRACION_LORAWAN_NUBE.md. Alta OTAA con JoinEUI = DevEUI, AU915, Clase C.
 */
export interface IDispositivoNme {
  // Alta LoRaWAN (OTAA)
  joinEui?: string; // IGUAL al DevEUI
  appkey?: string;

  // Datos del medidor HEXING (fPort 104)
  serial?: string;
  identificacion?: string;

  // Config del device (fPort 100 / SET_CONFIG)
  tz?: number; // Zona horaria en horas (i8, Argentina = -3)
  /**
   * @deprecated El firmware dejó de reportar este campo en junio 2026. Se
   * mantiene declarado por compatibilidad; el decoder ya no lo escribe, así que
   * los valores guardados quedan como estaban.
   */
  intervaloRegistroMin?: number;
  horaReporteDiario?: number; // Hora local del reporte diario (0-23)
  versionFw?: number;
  resetReason?: number; // enum esp_reset_reason_t

  // byte_estado (fPort 100)
  energiaExterna?: boolean; // hay 220 VAC presente
  medidorOk?: boolean; // ultima lectura OK
  modoBajoConsumo?: boolean; // light sleep activo
  modoEmergencia?: boolean; // SPIFFS en fallo

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
  reporteMask?: number;

  /**
   * OBIS que el medidor lista realmente en su readout (`disponible_mask` del
   * fPort 100). Mismos bits que reporteMask. Es OBSERVACIÓN, read-only.
   * `0` = el equipo todavía no leyó el medidor (no "el medidor no entrega nada").
   *
   * El equipo emite un fPort 100 espontáneo (máx. 1/hora) cuando este mask
   * cambia — p.ej. al reconfigurar el medidor para exponer el 2.6.0.
   */
  disponibleMask?: number;
}
