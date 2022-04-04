export interface IImagenesCliente {
  icono?: string;
  logo?: string;
  [key: string]: string;
}

export interface ICreateCliente {
  nombre: string;
  admin?: boolean;
  imagenes: IImagenesCliente;
}

export interface IUpdateCliente {
  activo?: boolean;
  nombre?: string;
  admin?: boolean;
  imagenes: IImagenesCliente;
}
