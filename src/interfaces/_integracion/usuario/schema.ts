export interface IDatosPersonales {
  nombre?: string;
  email?: string;
  [key: string]: string | undefined;
}

export interface IUsuario {
  _id: string;
  activo: boolean;
  fechaCreacion: string;
  username: string;
  hash?: string;
  datosPersonales?: IDatosPersonales;
}
