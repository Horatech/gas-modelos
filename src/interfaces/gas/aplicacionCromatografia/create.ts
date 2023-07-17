export interface ICreateAplicacionCromatografia {
  aplicada: boolean;
  idCromatografia: string;
  numeroSerieCorrectora: string | null;
  //
  idCliente?: string;
  idUnidadNegocio?: string;
  idCuenca?: string;
}
