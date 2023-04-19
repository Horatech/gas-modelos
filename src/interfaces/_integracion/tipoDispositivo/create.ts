import { IConfigLora } from "./configLora";
import { TipoDispositivo } from "./tipoDispositivo";

export interface ICreateTipoDispositivo {
  nombre: TipoDispositivo;
  /**
   * URL donde llegan los mensajes de los dispositivos
   */
  integrationUrl?: string;
  loraServers?: IConfigLora[];
}
