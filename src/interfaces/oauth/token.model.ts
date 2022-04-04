import { IClient } from "./client.model";
import { IUsuario } from "../usuario.model";

export interface IToken {
  accessToken: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  scope?: string | string[];
  client: IClient;
  user: IUsuario;
}
