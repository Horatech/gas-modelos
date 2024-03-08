import { IEstadoAlerta } from "./schema";

export interface IUpdateAlerta {
  estado?: IEstadoAlerta;
  fechaCierre?: string;
  timestamp?: string;
}
