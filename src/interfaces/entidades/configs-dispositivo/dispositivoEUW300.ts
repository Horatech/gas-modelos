/**
 * Configuración específica para medidor ultrasónico de agua EUW300
 * Basado en el protocolo de comunicación v1.0 (2025-10-20)
 * Fabricante: Qingdao Comcore Technologies Co., Ltd.
 */

export type UnidadFlujoAcumulado =
  | "L"
  | "L×10"
  | "L×100"
  | "m³"
  | "m³×10"
  | "m³×100";
export type UnidadFlujoInstantaneo =
  | "L/h"
  | "L/h×10"
  | "L/h×100"
  | "m³/h"
  | "m³/h×10"
  | "m³/h×100";
export type EstadoValvula = "abierta" | "cerrada" | "semi-cerrada";

/**
 * Estados detallados del medidor EUW300 (16 bits de estado)
 */
export interface IEstadosEUW300 {
  valvula?: boolean; // D0: true = cerrada, false = abierta
  estadoValvula?: boolean; // D1: true = anormal, false = normal
  bateria?: boolean; // D2: true = bajo voltaje, false = normal
  almacenamiento?: boolean; // D3: true = anormal, false = normal
  sistema?: boolean; // D4: true = verificación, false = usuario
  medicion?: boolean; // D5: true = falla, false = normal
  goteo?: boolean; // D6: true = goteando, false = normal
  sobreflujo?: boolean; // D7: true = anormal, false = normal
  tuboVacio?: boolean; // D8: true = vacío, false = normal
  burbujas?: boolean; // D9: true = burbuja, false = normal
  cuentaAbierta?: boolean; // D10: true = abierta, false = no
  morosidad?: boolean; // D11: true = deuda, false = normal
  flujoInverso?: boolean; // D12: true = inverso, false = normal
  saldoBajo?: boolean; // D13: true = bajo, false = normal
  estadoGP30?: boolean; // D14: true = anormal, false = normal
  valvulaSemiCerrada?: boolean; // D15: true = semi-cerrada, false = abierta
}

/**
 * Datos de reporte diario congelado (0x7028)
 */
export interface IReporteDiarioEUW300 {
  flujoAcumuladoActual?: number; // BCD, 4 bytes
  unidadFlujoAcumulado?: UnidadFlujoAcumulado;
  caudalMinimoDia?: number; // BCD, 4 bytes con 4 decimales
  unidadCaudalMinimo?: UnidadFlujoInstantaneo;
  caudalMaximoDia?: number; // BCD, 4 bytes con 4 decimales
  unidadCaudalMaximo?: UnidadFlujoInstantaneo;
  temperaturaAgua?: number; // °C con 2 decimales
  temperaturaAmbiente?: number; // °C entero con signo (-128 a +127)
  contadorRevoluciones?: number; // 1 byte HEX (Cumulative revolution count)
  tiempoTotalTrabajo?: number; // horas, BCD 3 bytes
  fechaHora?: string; // ISO string de la fecha/hora real
  estados?: IEstadosEUW300; // 2 bytes HEX convertidos a objeto
  intensidadSenal?: number; // 1 byte HEX

  tipoReporte?: "diario" | "evento"; // Diferencia entre 0x7028 y 0x7029
  motivoEvento?: string; // Si es evento o alarma, motivo del mismo
  timestamp?: string; // Timestamp de recepción (fechaCreacion del reporte)
  deviceAddress?: string; // Dirección del dispositivo (14 dígitos BCD)
  modoTransmision?: "texto-plano" | "cifrado"; // Modo de transmisión

  consumo?: number; // Alias de flujoAcumuladoActual para compatibilidad
  nivelBateria?: number; // Porcentaje estimado de batería
  serialNumber?: string; // Número de serie del medidor
}

/**
 * Datos de reporte horario congelado (0x8409)
 * Contiene datos acumulados de 12 horas
 */
export interface IReporteHorarioEUW300 {
  horaInicio?: string; // Formato: MMDDhhmm convertido a string
  intervaloHoras?: number; // Fijo en 1 hora
  unidadFlujoAcumulado?: UnidadFlujoAcumulado;
  flujoAcumuladoInicial?: number; // HEX, 4 bytes
  incrementosHorarios?: number[]; // Array de 12 elementos (incrementos por hora)

  tipoReporte?: "horario" | "evento"; // Puede ser disparado por evento
  motivoEvento?: string; // Si fue disparado por alarma/evento
  timestamp?: string; // ✅ Se genera al recibir
  deviceAddress?: string; // ✅ Viene en header de trama
  modoTransmision?: "texto-plano" | "cifrado"; // ✅ Control code

  // Campos calculados útiles
  consumoTotal?: number; // Suma total de incrementos
  consumoPromedioPorHora?: number; // Promedio por hora
}

/**
 * Configuración del dispositivo EUW300
 */
export interface IDispositivoEUW300 {
  // Configuración básica
  meterType?: number; // Siempre 10H para water meter
  address?: string; // 7 bytes BCD (14 dígitos)

  // Configuración de comunicación
  modoTransmision?: "texto-plano" | "cifrado"; // D3 del control code
  intervaloComunicacion?: number; // Minutos entre reportes
  horaReporteDiario?: string; // Hora del reporte diario (formato HH:mm)

  // Configuración de unidades por defecto
  unidadFlujoAcumuladoDefault?: UnidadFlujoAcumulado;
  unidadFlujoInstantaneoDefault?: UnidadFlujoInstantaneo;

  // Datos del último reporte diario
  ultimoReporteDiario?: IReporteDiarioEUW300;

  // Datos del último reporte horario
  ultimoReporteHorario?: IReporteHorarioEUW300;

  // Estado actual simplificado
  estadoValvula?: EstadoValvula;
  estadoGeneral?: "normal" | "alerta" | "error";

  // Configuración de alertas
  alertaBateriaActivada?: boolean;
  alertaGoteoActivada?: boolean;
  alertaSobreflujoActivada?: boolean;
  alertaTuboVacioActivada?: boolean;
  alertaBurbujasActivada?: boolean;
  alertaFlujoInversoActivada?: boolean;

  // Límites de alerta
  limiteCaudalMaximo?: number;
  limiteCaudalMinimo?: number;
  limiteTemperaturaMaxima?: number;
  limiteTemperaturaMinima?: number;
}
