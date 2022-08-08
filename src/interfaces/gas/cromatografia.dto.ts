export interface IElementos {
  oxigeno?: number;
  densidad?: number;
  dioxidoCarbono?: number;
  nitrogeno?: number;
  metano?: number;
  etano?: number;
  propano?: number;
  isoButano?: number;
  nButano?: number;
  isoPentano?: number;
  nPentano?: number;
  nHexano?: number;
  nHeptano?: number;
  nOctano?: number;
}

export interface ICreateCromatografia {
  idCuenca: string;
  idUsuario?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  fechaAplicacion: string;
  fechaVencimiento: string;
  elementos: IElementos;
}

export interface IUpdateCromatografia {
  idCuenca?: string;
  idCliente?: string;
  idUnidadNegocio?: string;
  fechaAplicacion?: string;
  fechaVencimiento?: string;
  elementos?: IElementos;
}
