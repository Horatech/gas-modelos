import { IEnvioSms } from "./schema";

type Omitir =
  | "_id"
  | "unidadNegocio"
  | "centroOperativo"
  | "grupo"
  | "agrupacion2"
  | "usuarios";

export interface ICreateEnvioSms extends Omit<Partial<IEnvioSms>, Omitir> {}
