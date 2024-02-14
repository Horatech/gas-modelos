import { IPuntoMedicion } from "./schema";

type Omitir =
  | "_id"
  | "correctora"
  | "unidadPresion"
  | "cliente"
  | "unidadNegocio"
  | "centroOperativo"
  | "grupos"
  | "agrupaciones"
  | "cuenca";

export interface IUpdatePuntoMedicion
  extends Omit<Partial<IPuntoMedicion>, Omitir> {}
