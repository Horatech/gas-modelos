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

import { z } from "zod";
import { ReporteUWMNBSchema } from "../valores-reporte/uwm-nb";

export const DispositivoUwmNbSchema = z.object({
  // --- Identidad ---
  meterId: z.string().optional(), // METER_ID, 12 díg (equiv. deviceMeterNumber; string, no number)
  deviceMeterNumber: z.string().optional(), // alias/compatibilidad con el resto de medidores de agua
  imsi: z.string().optional(), // IMSI de la SIM (15 díg; string para no perder ceros)
  // IMEI del módulo (15 díg). En payload V4 (cifrado) viaja EN CLARO antes del
  // METER_ID y es la clave de lookup para resolver `claveAes` antes de descifrar.
  // OJO: el ejemplo del vendor trae un valor con formato IMSI (748...); confirmar
  // si el campo es realmente IMEI (86.../35...) — no cambia el modelo, sí la carga.
  imei: z.string().optional(),
  iccid: z.string().optional(), // ICCID de la SIM (opcional; string, 19-20 díg)

  // --- Comunicación NB-IoT/LTE-M ---
  ip: z.string().optional(), // IP del device (Local_IP reportada)
  puerto: z.number().optional(), // puerto UDP al que reporta (plano vs AES)
  operadora: z.string().optional(), // operadora móvil (Antel, etc.)
  versionFw: z.union([z.number(), z.string()]).optional(), // versión de firmware (BCD en el frame)

  // --- Cifrado (fase 2; ver plan §4) ---
  modoTransmision: z.enum(["plano", "aes-128"]).optional(), // seleccionado por puerto
  claveAes: z.string().optional(), // clave AES-128 por device (16 B, hex 32 chars). Secreto en reposo.

  // --- Configuración de reporte ---
  intervaloComunicacion: z.number().optional(), // minutos/horas entre reportes (informativo; 1 tx/día)
  horaReporteDiario: z.string().optional(), // hora del reporte diario (HH:mm), si se conoce

  // --- Último reporte / estado ---
  ultimoReporte: ReporteUWMNBSchema.optional(),
  estadoGeneral: z.enum(["normal", "alerta", "error"]).optional(),

  // --- Flags de alerta (paridad con EUW300) ---
  alertaBateriaActivada: z.boolean().optional(),
  alertaFlujoInversoActivada: z.boolean().optional(),
  alertaSobreflujoActivada: z.boolean().optional(),
  alertaGoteoActivada: z.boolean().optional(),
  alertaTuboVacioActivada: z.boolean().optional(),
});
export type IDispositivoUwmNb = z.infer<typeof DispositivoUwmNbSchema>;
