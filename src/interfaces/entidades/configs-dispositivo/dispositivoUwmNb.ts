/**
 * Configuración específica del medidor de agua ultrasónico NB-IoT "UWM-NB".
 *
 * Device de la licitación OSE Evoluciona (UY). Transporte: UDP crudo (NB-IoT/LTE-M),
 * 1 tx/día, buffer 72 h. Identidad = `meterId` (dentro del frame; no hay api-key).
 * Fase 1 = payload plano; fase 2 = payload cifrado AES-128 (clave por device).
 *
 * Fabricante aún no seleccionado (nombre de tipo genérico a propósito). Campos de
 * comunicación tomados del patrón IDispositivoSml (ip/port) + IDispositivoNme (versionFw).
 */

import { IReporteUWMNB } from "../valores-reporte";

export interface IDispositivoUwmNb {
  // --- Identidad ---
  meterId?: string; // METER_ID, 12 díg (equiv. deviceMeterNumber; string, no number)
  deviceMeterNumber?: string; // alias/compatibilidad con el resto de medidores de agua
  imsi?: string; // IMSI de la SIM (15 díg; string para no perder ceros)
  iccid?: string; // ICCID de la SIM (opcional; string, 19-20 díg)

  // --- Comunicación NB-IoT/LTE-M ---
  ip?: string; // IP del device (Local_IP reportada)
  puerto?: number; // puerto UDP al que reporta (plano vs AES)
  operadora?: string; // operadora móvil (Antel, etc.)
  versionFw?: number | string; // versión de firmware (BCD en el frame)

  // --- Cifrado (fase 2; ver plan §4) ---
  modoTransmision?: "plano" | "aes-128"; // seleccionado por puerto
  claveAes?: string; // clave AES-128 por device (16 B, hex 32 chars). Secreto en reposo.

  // --- Configuración de reporte ---
  intervaloComunicacion?: number; // minutos/horas entre reportes (informativo; 1 tx/día)
  horaReporteDiario?: string; // hora del reporte diario (HH:mm), si se conoce

  // --- Último reporte / estado ---
  ultimoReporte?: IReporteUWMNB;
  estadoGeneral?: "normal" | "alerta" | "error";

  // --- Flags de alerta (paridad con EUW300) ---
  alertaBateriaActivada?: boolean;
  alertaFlujoInversoActivada?: boolean;
  alertaSobreflujoActivada?: boolean;
  alertaGoteoActivada?: boolean;
  alertaTuboVacioActivada?: boolean;
}
