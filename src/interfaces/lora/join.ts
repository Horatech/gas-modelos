import { IMetadatos } from "./metadatos";

export interface IJoin {
  aplicacion: string;
  idCliente: string;
  red?: string;
  idLoraServer?: string;
  deveui: string;
  deviceName?: string;
  metadatos?: IMetadatos[];
  adr?: boolean;
  dr?: number;
  tags?: { [key: string]: string };
}
