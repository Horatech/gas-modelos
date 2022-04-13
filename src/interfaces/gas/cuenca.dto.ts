export interface ICreateCuenca {
  nombre: string;
  idUnidadNegocio: string;
  idCliente?: string;
}

export interface IUpdateCuenca {
  nombre?: string;
  idUnidadNegocio?: string;
}
