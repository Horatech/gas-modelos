export interface IClient {
  clientId: string;
  clientSecret: string;
  grants: string[];
  redirectUris: string[];
  accessTokenLifetime: number;
  refreshTokenLifetime: number;
}
