import { ICaslAction } from "../caslAction";
import { ICaslSubject } from "../caslSubject";

export interface IUpdatePermiso {
  nombre?: string;
  accion?: ICaslAction;
  entidad?: ICaslSubject;
  campos?: string[];
  condiciones?: object;
}
