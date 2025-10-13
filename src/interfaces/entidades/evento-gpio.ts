export interface IEventoGpio {
  _id?: string;
  deveui?: string;
  idCliente?: string;
  idDispositivo?: string;
  idPuntoMedicion?: string;

  // Timestamp del evento
  fecha?: string;

  // Datos del reporte
  contador_1?: number;
  contador_2?: number;
  flag_1?: boolean;
  flag_2?: boolean;

  // Metadata
  firmwareNuc?: string;
  apiVersion?: string;
}

////// CREATE
type OmitirCreate = "_id";
export interface ICreateEventoGpio
  extends Omit<Partial<IEventoGpio>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = "_id";
export interface IUpdateEventoGpio
  extends Omit<Partial<IEventoGpio>, OmitirUpdate> {}
