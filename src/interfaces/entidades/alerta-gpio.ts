export interface IAlertaGpio {
  _id?: string;
  deveui?: string;
  idCliente?: string;
  idDispositivo?: string;
  idPuntoMedicion?: string;

  // Campos organizativos para permisos (copiados desde punto de medición)
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idsAgrupaciones?: string[];

  // Datos de la alerta
  fecha?: string;
  input?: 1 | 2; // Número de entrada que generó la alerta

  // Metadata
  firmwareNuc?: string;
  apiVersion?: string;

  // Estado del SMS
  smsEnviado?: boolean;
  fechaEnvioSms?: string;
  errorSms?: string;
}

////// CREATE
type OmitirCreate = "_id";
export interface ICreateAlertaGpio
  extends Omit<Partial<IAlertaGpio>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = "_id";
export interface IUpdateAlertaGpio
  extends Omit<Partial<IAlertaGpio>, OmitirUpdate> {}
