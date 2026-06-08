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
  intervaloRegistroMin?: number; // Minutos entre registros (default 60)
  horaReporteDiario?: number; // Hora local del reporte diario (0-23)
  versionFw?: number;
  resetReason?: number; // enum esp_reset_reason_t

  // byte_estado (fPort 100)
  energiaExterna?: boolean; // hay 220 VAC presente
  medidorOk?: boolean; // ultima lectura OK
  modoBajoConsumo?: boolean; // light sleep activo
  modoEmergencia?: boolean; // SPIFFS en fallo
}
