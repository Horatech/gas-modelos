import {
  IEstadosEUW300,
  UnidadFlujoAcumulado,
  UnidadFlujoInstantaneo,
} from "../configs-dispositivo";

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
