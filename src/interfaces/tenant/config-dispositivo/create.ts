export interface ICreateConfigDispositivo {
  idCliente?: string;
  // Info de carga
  deveui?: string;
  config?: Record<string, any>;
}
