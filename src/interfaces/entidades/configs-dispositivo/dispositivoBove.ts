/**
 * Configuración específica para medidor ultrasónico LoRaWAN Bove
 * Basado en el protocolo propietario Bove para medidores de agua ultrasónicos.
 * Fabricante: Bove (modelos como BECO, B91, B97, B39, DN ≥ 50).
 */

import {
  IReporteTotalizadorBove,
  IReporteLogsHorariosBove,
} from "../valores-reporte";

export type UnidadConsumoBove =
  | "0.001 m³"
  | "0.01 m³"
  | "0.1 m³"
  | "1 m³"
  | "0.0001 m³";

export type ModoTemporalidad = "INTERVAL" | "TIMEPOINT" | "OFF";

/**
 * Perfil de capacidades del medidor Bove
 * Define las características físicas y funcionales del dispositivo
 * para interpretar correctamente los bits de estado y reportes.
 */
export interface IBoveCapabilities {
  hasValve?: boolean; // Si el medidor tiene válvula integrada
  hasPressureSensor?: boolean; // Si mide presión
  hasTemperatureSensor?: boolean; // Si mide temperatura
  isDn50OrGreater?: boolean; // Si DN ≥ 50 (afecta bits de estado)
}

/**
 * Estados detallados del medidor Bove (ST1 y ST2, 2 bytes)
 * Los bits se interpretan según el perfil de capacidades del dispositivo.
 */
export interface IEstadosBove {
  bateriaBaja?: boolean;
  flujoInverso?: boolean;
  tuberiaVacia?: boolean;
  fuga?: boolean;
  rotura?: boolean;
  manipulacion?: boolean;
  errorSensores?: boolean;
  // Bits adicionales interpretados según capabilities (válvula, presión, etc.)
  valvulaAbierta?: boolean; // Solo si hasValve
  presionAlta?: boolean; // Solo si hasPressureSensor
  temperaturaAlta?: boolean; // Solo si hasTemperatureSensor
  congelamiento?: boolean; // solo si hasTemperatureSensor
}

/**
 * Configuración del dispositivo Bove
 */
export interface IDispositivoBove {
  // Configuración básica
  numeroSerie?: string; // Número de serie del medidor

  // Perfil de capacidades (clave para interpretar bits)
  capabilities?: IBoveCapabilities;

  modoConfirmacion?: "confirmed" | "unconfirmed"; // AT+ULCONFIRMED
  timeSyncInterval?: number; // Días entre sincronización horaria (default 7)

  // Configuración de temporalidad (guardar como fuente de verdad)
  modoTemporalidad?: ModoTemporalidad;
  intervaloMinutos?: number; // Para INTERVAL
  horarioFijo?: string; // Para TIMEPOINT, formato "HH:MM"

  // Configuración de unidades por defecto
  unidadConsumoDefault?: UnidadConsumoBove;

  // Datos del último reporte totalizador
  ultimoReporteTotalizador?: IReporteTotalizadorBove;

  // Datos del último reporte de logs horarios
  ultimoReporteLogsHorarios?: IReporteLogsHorariosBove;
}
