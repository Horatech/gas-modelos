import { ICuenca, IUnidadNegocio } from "../gas";
import { ICliente } from "./cliente.model";
import { TipoConectividad, TipoDispositivo } from "./dispositivo.dto";
import { ILoteDispositivo } from "./loteDispositivo.model";

export interface IDispositivo {
  _id: string;
  fechaCreacion: string;
  idCliente: string;
  deveui: string;
  deviceName: string;
  appkey: string;
  idLote: string;
  tipoDispositivo: TipoDispositivo;
  conectividad: TipoConectividad;
  // Datos que carga el cliente
  idUnidadNegocio?: string;
  idCuenca?: string;
  // Virtuals
  cliente?: ICliente;
  lote?: ILoteDispositivo;
  unidadNegocio?: IUnidadNegocio;
  cuenca?: ICuenca;
}
