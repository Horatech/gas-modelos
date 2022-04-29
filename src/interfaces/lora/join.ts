import { IMetadatos } from "./metadatos";

export interface IJoin {
  deveui: string;
  deviceName?: string;
  metadatos?: IMetadatos[];
  adr?: boolean;
  dr?: number;
  tags?: { [key: string]: string };
}
