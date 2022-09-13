import { ICorrectora } from "./correctora.model";

export interface IRegistro {
  _id: string;
  timestamp: string;
  corrected: number;
  uncorrected: number;
  presion: number;
  temperatura: number;
  contador: number;
  //
  numeroSerieCorrectora: number;
  deveui: string;
  deviceName?: string;
  //
  idCliente: string;
  idUnidadNegocio?: string;
  //
  fechaCreacion: string;
  //
  correctora?: ICorrectora;
}
