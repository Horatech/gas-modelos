/**
 * Interfaz que define la estructura de los templates de mensajes de Twilio
 * para enviar mensajes de alarma de presión por WhatsApp
 * @example 'Estado de presión {{1}} en el punto de medición {{2}} con un valor de {{3}}. Horatech.'
 * @param estado Estado de la presión {{1}}
 * @param punto Punto de medición {{2}}
 * @param valor Valor de la presión {{3}}
 */
export interface ITwilioLimitePresionWA {
  estado: string;
  punto: string;
  valor: string;
}

/**
 * Interfaz que define la estructura de los templates de mensajes de Twilio
 * para enviar mensajes de alarma de presión por WhatsApp
 * @example 'Estado de presión {{1}} en el punto de medición {{2}} con un valor de {{3}} con fecha {{4}}. Horatech.'
 * @param estado Estado de la presión {{1}}
 * @param punto Punto de medición {{2}}
 * @param valor Valor de la presión {{3}}
 * @param fecha Fecha de la alarma {{4}}
 */
export interface ITwilioErrorComunicacionAlarmaWA {
  estado: string;
  punto: string;
  valor: string;
  fecha: string;
}

/**
 * Interfaz que define la estructura de los templates de mensajes de Twilio
 * para enviar mensajes de alarma de presión por SMS
 * @example 'Estado de presión {{1}} en el punto de medición {{2}} con un valor de {{3}}. Horatech.'
 * @param estado Estado de la presión {{1}}
 * @param punto Punto de medición {{2}}
 * @param valor Valor de la presión {{3}}
 */
export interface ITwilioLimitePresionSMS {
  estado: string;
  punto: string;
  valor: string;
}

/**
 * Interfaz que define la estructura de los templates de mensajes de Twilio
 * para enviar mensajes de alarma de presión por SMS
 * @example 'Estado de presión {{1}} en el punto de medición {{2}} con un valor de {{3}} con fecha {{4}}. Horatech.'
 * @param estado Estado de la presión {{1}}
 * @param punto Punto de medición {{2}}
 * @param valor Valor de la presión {{3}}
 * @param fecha Fecha de la alarma {{4}}
 */
export interface ITwilioErrorComunicacionAlarmaSMS {
  estado: string;
  punto: string;
  valor: string;
  fecha: string;
}

/**
 * Interfaz que define la estructura de los templates de mensajes de Twilio
 * para enviar mensajes de alarma de presión por SMS
 * @example 'Punto de medición {{1}} pasado a estado En Mantenimiento. Horatech.'
 * @param punto Punto de medición {{1}}
 */

export interface ITwilioMantenimientoWA {
  punto: string;
}

/**
 * Interfaz que define la estructura de los templates de mensajes de Twilio
 * para enviar mensajes de alarma de presión por SMS
 * @example 'Punto de medición {{1}} pasado a estado En Mantenimiento. Horatech.'
 * @param punto Punto de medición {{1}}
 */

export interface ITwilioMantenimientoSMS {
  punto: string;
}