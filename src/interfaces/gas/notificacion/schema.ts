export interface INotificacion {
  _id?: string;
  idUsuario: string;
  fechaCreacion: string;
  titulo: string;
  mensaje: string;
  leido: boolean;
  fechaLeido?: string;
  //
}
