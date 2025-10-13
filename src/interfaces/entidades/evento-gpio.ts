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
  testigo_1?: number; // 0 o 1 según firmware
  testigo_2?: number; // 0 o 1 según firmware

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
