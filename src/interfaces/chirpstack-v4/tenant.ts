export interface ITenantV4 {
  id: string;
  name: string;
  description?: string;
  canHaveGateways?: boolean;
  maxGatewayCount?: number;
  maxDeviceCount?: number;
  privateGatewaysUp?: boolean;
  privateGatewaysDown?: boolean;
}

export interface IListTenantsV4Response {
  totalCount?: number;
  result?: ITenantV4[];
}
