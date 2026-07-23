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

import { ITipoAlerta } from "../alerta";

/** Lectura puntual (realtime o congelada diaria) — 11 B BCD del frame. */
export interface ILecturaUWMNB {
  timestamp: string; // ISO — RTC del device (Year/Month/Day/Hour/Minute BCD)
  volumenM3: number; // odómetro TOTAL, m³ (BCD 8 díg / 1000)
  alarmas: ITipoAlerta[]; // mapeadas desde el bitmask de 8 bits (ver plan §3.3)
  alarmBitsRaw?: number; // BYTE2 crudo del campo Alarm (BYTE1 REVERSE se ignora)
}

/** Muestra horaria del buffer (72 registros) — volumen TOTAL, no incremento. */
export interface ILecturaHorariaUWMNB {
  timestamp: string; // ISO, anclado a la hora en punto
  volumenM3: number; // odómetro TOTAL, m³
  consumoParcial?: number; // delta vs. hora previa (lo calcula el backend)
}

export interface IReporteUWMNB {
  // --- Identidad / radio (crudos del frame) ---
  meterId: string; // METER_ID, 12 díg ASCII
  ip?: string; // Local_IP del device
  imsi?: string; // IMSI de la SIM
  ciclosTx?: number; // CYCLES_TX (transmisiones totales)
  ciclosTxBad?: number; // CYCLES_TX_BAD (transmisiones fallidas)
  rssi?: number; // RSSI_SNR[0] (unidad sin confirmar; ver R4 del plan)
  snr?: number; // RSSI_SNR[1]
  valveStatusRaw?: number; // VALVE_STATUS (reservado; se persiste crudo)

  // --- Batería / firmware ---
  vbatMedicionMv?: number; // uint16 mV (batería de medición)
  vbatComunicacionMv?: number; // uint16 mV (batería de comunicación)
  bateria?: number; // % estimado desde vbatMedicion
  fwVersion?: number; // BCD (el CRC de programa se descarta)

  // --- Lecturas ---
  lecturaTiempoReal?: ILecturaUWMNB; // REALTIME_DATA
  lecturaCongeladaDiaria?: ILecturaUWMNB; // FROZEN_DATA_DAILY
  lecturasHorarias?: ILecturaHorariaUWMNB[]; // 0..72 (usar LENGTH, no asumir 72)

  // --- Convención común de reportes (espejo WRC/SML) ---
  timestamp?: string; // = lecturaTiempoReal.timestamp; lo usa el write-path
  consumo?: number; // = lecturaTiempoReal.volumenM3 (odómetro total)
  consumoCorregido?: number; // consumo ± offset (consumoInicial cargado en plataforma)
  consumoParcial?: number; // consumo - consumo del último reporte

  frameLen?: number; // LENGTH declarado en la trama (detecta frames degradados)
  crcOk?: boolean; // resultado de la validación de checksum (suma mod 256)
}
