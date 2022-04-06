export interface IClient {
  id: string;
  clientId: string;
  clientSecret: string;
  grants: string[];
  redirectUris: string[];
  accessTokenLifetime: number;
  refreshTokenLifetime: number;
}
