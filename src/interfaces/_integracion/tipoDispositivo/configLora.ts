import { ILoraServer } from "../loraServer";

export interface IConfigLora {
  idLoraServer: string;
  deviceProfileID?: string[];
  //
  loraServer?: ILoraServer;
}
