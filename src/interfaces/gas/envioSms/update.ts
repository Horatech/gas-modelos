import { IEnvioSms } from "./schema";

type Omitir =
  | "_id"
  | "unidadNegocio"
  | "centroOperativo"
  | "grupo"
  | "agrupacion2"
  | "usuarios";

export interface IUpdateEnvioSms extends Omit<Partial<IEnvioSms>, Omitir> {}
