import { IUsuario } from "../tenant";
import { ICreateClient } from "./client.dto";

export interface ICreateToken {
  accessToken: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  scope?: string | string[];
  client: ICreateClient;
  user: IUsuario;
}
