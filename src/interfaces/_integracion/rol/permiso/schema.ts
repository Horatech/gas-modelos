import { ICaslAction } from "../caslAction";
import { ICaslSubject } from "../caslSubject";

export interface IPermiso {
  _id?: string;
  nombre?: string;
  accion?: ICaslAction;
  entidad?: ICaslSubject;
  campos?: string[];
  condiciones?: object;
}
