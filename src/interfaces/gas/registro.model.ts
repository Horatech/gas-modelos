export interface IRegistro {
  _id: string;
  timestamp: number;
  corrected: number;
  uncorrected: number;
  presion: number;
  temperatura: number;
  contador: number;
  //
  numeroSerieCorrectora: number;
  deveui: string;
  //
  idCliente: string;
  //
  fechaCreacion: string;
}
