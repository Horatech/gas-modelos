/**
 * Valores de reporte del medidor de agua ultrasónico NB-IoT "UWM-NB".
 *
 * Origen: medidor NB-IoT/LTE-M de la licitación OSE Evoluciona (UY, Lic. 26973).
 * El equipo transmite 1 frame binario/día (trama 374 B estilo DL/T-645, big-endian,
 * campos ASCII/HEX/BCD) por UDP crudo. Spec de payload validada byte a byte contra
 * trama real. Detalle en gas/PLAN-UWM-NB-INTEGRACION.md §3.
 *
 * NOTA (zona horaria): por ahora se asume que el RTC del device reporta en HORA LOCAL
 * (UY, UTC-3), no UTC. Los `timestamp` ISO se construyen con ese supuesto en el decoder
 * (gas-api-uwm-nb). Confirmar con el proveedor; ver R1 del plan.
 *
 * Volumen = odómetro TOTAL (siempre creciente), en m³ (BCD 8 díg / 1000). También las
 * lecturas horarias son volumen total, no incremento (pese al label "increment" del
 * fabricante); el delta por hora lo calcula el backend (`consumoParcial`).
 */

import { z } from "zod";
import { TipoAlertaSchema } from "../alerta";

/** Lectura puntual (realtime o congelada diaria) — 11 B BCD del frame. */
export const LecturaUWMNBSchema = z.object({
  timestamp: z.string(), // ISO — RTC del device (Year/Month/Day/Hour/Minute BCD)
  volumenM3: z.number(), // odómetro TOTAL, m³ (BCD 8 díg / 1000)
  alarmas: z.array(TipoAlertaSchema), // mapeadas desde el bitmask de 8 bits (ver plan §3.3)
  alarmBitsRaw: z.number().optional(), // BYTE2 crudo del campo Alarm (BYTE1 REVERSE se ignora)
});
export type ILecturaUWMNB = z.infer<typeof LecturaUWMNBSchema>;

/** Muestra horaria del buffer (72 registros) — volumen TOTAL, no incremento. */
export const LecturaHorariaUWMNBSchema = z.object({
  timestamp: z.string(), // ISO, anclado a la hora en punto
  volumenM3: z.number(), // odómetro TOTAL, m³
  consumoParcial: z.number().optional(), // delta vs. hora previa (lo calcula el backend)
});
export type ILecturaHorariaUWMNB = z.infer<typeof LecturaHorariaUWMNBSchema>;

export const ReporteUWMNBSchema = z.object({
  // --- Identidad / radio (crudos del frame) ---
  meterId: z.string(), // METER_ID, 12 díg ASCII
  ip: z.string().optional(), // Local_IP del device
  imsi: z.string().optional(), // IMSI de la SIM (payload V1 plano; ausente en V4)
  imei: z.string().optional(), // IMEI del módulo (payload V4 cifrado: en claro, reemplaza al IMSI)
  ciclosTx: z.number().optional(), // CYCLES_TX (transmisiones totales)
  ciclosTxBad: z.number().optional(), // CYCLES_TX_BAD (transmisiones fallidas)
  rssi: z.number().optional(), // RSSI_SNR[0] (unidad sin confirmar; ver R4 del plan)
  snr: z.number().optional(), // RSSI_SNR[1]
  valveStatusRaw: z.number().optional(), // VALVE_STATUS (reservado; se persiste crudo)

  // --- Batería / firmware ---
  vbatMedicionMv: z.number().optional(), // uint16 mV (batería de medición)
  vbatComunicacionMv: z.number().optional(), // uint16 mV (batería de comunicación)
  bateria: z.number().optional(), // % estimado desde vbatMedicion
  fwVersion: z.number().optional(), // BCD (el CRC de programa se descarta)

  // --- Lecturas ---
  lecturaTiempoReal: LecturaUWMNBSchema.optional(), // REALTIME_DATA
  lecturaCongeladaDiaria: LecturaUWMNBSchema.optional(), // FROZEN_DATA_DAILY
  lecturasHorarias: z.array(LecturaHorariaUWMNBSchema).optional(), // 0..72 (usar LENGTH, no asumir 72)

  // --- Convención común de reportes (espejo WRC/SML) ---
  timestamp: z.string().optional(), // = lecturaTiempoReal.timestamp; lo usa el write-path
  consumo: z.number().optional(), // = lecturaTiempoReal.volumenM3 (odómetro total)
  consumoCorregido: z.number().optional(), // consumo ± offset (consumoInicial cargado en plataforma)
  consumoParcial: z.number().optional(), // consumo - consumo del último reporte

  frameLen: z.number().optional(), // LENGTH declarado en la trama (detecta frames degradados)
  crcOk: z.boolean().optional(), // resultado de la validación de checksum (suma mod 256)
});
export type IReporteUWMNB = z.infer<typeof ReporteUWMNBSchema>;
