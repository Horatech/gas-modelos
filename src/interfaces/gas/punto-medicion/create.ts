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

export interface ICreatePuntoMedicion
  extends Omit<Partial<IPuntoMedicion>, Omitir> {}
