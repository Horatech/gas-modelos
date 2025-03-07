/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'Estado de presión {{1}} en el punto de medición {{2}} con un valor de {{3}}. Horatech.'
 * @param estado Estado de la presión {{1}}
 * @param punto Punto de medición {{2}}
 * @param valor Valor de la presión {{3}}
 * @param sid HXfb4194701ce4baf115447c6b0baad06c
 */
export interface ITwilioPresionTemplate {
  1: string;
  2: string;
  3: string;
  sid: string;
}

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'Punto de medición {{1}} pasado a estado En Mantenimiento. Horatech.'
 * @param punto Punto de medición {{1}}
 * @param sid HX36663f2a4ef4b29455df5cc6c6eb00a8
 */
export interface ITwilioMantenimientoTemplate {
  1: string;
  sid: string;
}

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'Sensor deconectado en el punto de medición {{1}}. Horatech.'
 * @param punto Punto de medición {{1}}
 * @param sid HXa73924c271c567499fc61c8e3c629909
 */
export interface ITwilioSensorDesconectadoTemplate {
  1: string;
  sid: string;
}

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'Error de comunicación de alarma. Estado de presión {{1}} en el punto de medición {{2}} con un valor de {{3}} con fecha {{4}}. Horatech.'
 * @param estado Estado de la presión {{1}}
 * @param punto Punto de medición {{2}}
 * @param valor Valor de la presión {{3}}
 * @param fecha Fecha del error {{4}}
 * @param sid HX30c8f98ac067a102c2ec970482b393ba
 */
export interface ITwilioErrorComunicacionAlarmaTemplate {
  1: string;
  2: string;
  3: string;
  4: string;
  sid: string;
}

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'Se ha restablecido el valor en el punto {{1}}. Horatech.'
 * @param punto Punto de medición {{1}}
 * @param sid HX79264e34254ed1f65121644a3f4d8979
 */
export interface ITwilioScadaBooleanoReestablecidoTemplate {
  1: string;
  sid: string;
}

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'El valor {{1}} ha vuelto a estar dentro los niveles normales en el punto {{2}}. Horatech.'
 * @param valor Valor {{1}}
 * @param punto Punto de medición {{2}}
 * @param sid HX9bb2b5180e4d9a25b67423bc2e5eb43f
 */
export interface ITwilioScadaValorReestablecidoTemplate {
  1: string;
  2: string;
  sid: string;
}

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'El límite {{1}} del punto {{2}} ha sido cambiado a {{3}}. Horatech.'
 * @param limite Límite {{1}}
 * @param punto Punto de medición {{2}}
 * @param valor Valor {{3}}
 * @param sid HX062696564a7a45eb649751fb6bb98220
 */
export interface ITwilioScadaCambioLimiteTemplate {
  1: string;
  2: string;
  3: string;
  sid: string;
}

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'El punto {{1}} ha reportado el valor {{2}}. El valor de alarma es {{3}}. Horatech.'
 * @param punto Punto de medición {{1}}
 * @param valor Valor {{2}}
 * @param alarma Valor de alarma {{3}}
 * @param sid HXe87e6d98251d55a6a6ddf000c3146b75
 */
export interface ITwilioScadaBooleanoAlertaTemplate {
  1: string;
  2: string;
  3: string;
  sid: string;
}

/**
 * Los templates de mensajes de Twilio son mensajes predefinidos que se pueden
 * enviar a través de la API de Twilio. Estos mensajes pueden ser personalizados
 * con variables que se reemplazan por valores específicos al momento de enviar
 * el mensaje.
 * @example 'El valor {{1}} ha sobrepasado el nivel {{2}} en el punto {{3}}. Horatech.'
 * @param valor Valor {{1}}
 * @param nivel Nivel {{2}}
 * @param punto Punto de medición {{3}}
 * @param sid HX77a6e9216b71d1ab0a0f7ecb479956c4
 */
export interface ITwilioFueraDeLimiteTemplate {
  1: string;
  2: string;
  3: string;
  sid: string;
}

export interface IMensajeTwilio {
  datos?:
    | ITwilioErrorComunicacionAlarmaTemplate
    | ITwilioMantenimientoTemplate
    | ITwilioPresionTemplate
    | ITwilioScadaBooleanoAlertaTemplate
    | ITwilioScadaBooleanoReestablecidoTemplate
    | ITwilioScadaCambioLimiteTemplate
    | ITwilioScadaValorReestablecidoTemplate
    | ITwilioSensorDesconectadoTemplate
    | ITwilioFueraDeLimiteTemplate;
  pais?: string;
  telefono?: string;
  idCliente?: string;
  usuario?: string;
}

export interface ILlamadaTwilio {
  telefono?: string;
  mensaje?: string;
  idCliente?: string;
  usuario?: string;
}
