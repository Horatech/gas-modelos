export interface IInputsRegistrosNUCV2 {
  timestamp?: string;
  contador_1?: number; // valor del contador de la entrada digital 1 pulsos
  contador_2?: number; // valor del contador de la entrada digital 2 pulsos
  consumo_1?: number; // consumo real calculado para la entrada digital 1 * factor de correccion + valor inicial in 1
  consumo_2?: number; // consumo real calculado para la entrada digital 2 * factor de correccion + valor inicial in 2
  factor_1Aplicado?: number; // factor de correccion aplicado a la entrada digital 1
  factor_2Aplicado?: number; // factor de correccion aplicado a la entrada digital 2
  inicial_1Aplicado?: number; // valor inicial aplicado a la entrada digital 1
  inicial_2Aplicado?: number; // valor inicial aplicado a la entrada digital 2
}
