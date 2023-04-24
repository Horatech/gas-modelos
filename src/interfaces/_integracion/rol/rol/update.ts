import { INivel } from "./schema";

export interface IUpdateRol {
  nombre?: string;
  variante?: string;
  nivel?: INivel;
  idsPerfiles?: string[];
}
