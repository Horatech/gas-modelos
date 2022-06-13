export interface ICreateCentroOperativo {
  nombre: string;
  idUnidadNegocio: string;
  idCliente?: string;
}

export interface IUpdateCentroOperativo {
  nombre?: string;
  idUnidadNegocio?: string;
}
