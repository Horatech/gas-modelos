import { INivel } from "./schema";

export interface ICreateRol {
  nombre?: string;
  variante?: string;
  nivel?: INivel;
  idsPerfiles?: string[];
}
