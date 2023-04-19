export type ITenantInfo = ITenantInfoAgro | ITenantInfoGas;

export interface ITenantInfoAgro {
  idCliente?: string;
  idEstablecimiento?: string;
}

export interface ITenantInfoGas {
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
}
