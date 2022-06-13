export interface ICreateGrupo {
  nombre: string;
  idUnidadNegocio: string;
  idCliente?: string;
}

export interface IUpdateGrupo {
  nombre?: string;
  idUnidadNegocio?: string;
}
