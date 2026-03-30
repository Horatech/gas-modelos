import { TipoInput } from "../dispositivo-externo-nuc";

export interface IReporteInputsNuc {
  timestamp?: string;
  // Input 1
  tipoInput1?: TipoInput;
  valorInput1?: number;
  consumoInput1?: number; // Aplica cuando el tipo es "Contador" | Consumo real calculado para input 1 * factor de correccion + valor inicial in 1
  factorAplicadoInput1?: number; // Factor de corrección aplicado a input 1 (multiplicador para convertir pulsos en consumo o valor real, aplica cuando el tipo es "Contador")
  valorInicialAplicadoInput1?: number; // Valor inicial aplicado a input 1 (ej: lectura del contador al momento de asignar el dispositivo, aplica cuando el tipo es "Contador")
  consumoParcialInput1?: number; // Consumo parcial calculado para input 1 desde el ultimo reporte (consumo real calculado para input 1 en este reporte - consumo real calculado para input 1 en el ultimo reporte)
  // Input 2
  tipoInput2?: TipoInput;
  valorInput2?: number;
  consumoInput2?: number; // Aplica cuando el tipo es "Contador" | Consumo real calculado para input 2 * factor de correccion + valor inicial in 2
  factorAplicadoInput2?: number; // Factor de corrección aplicado a input 2 (multiplicador para convertir pulsos en consumo o valor real, aplica cuando el tipo es "Contador")
  valorInicialAplicadoInput2?: number; // Valor inicial aplicado a input 2 (ej: lectura del contador al momento de asignar el dispositivo, aplica cuando el tipo es "Contador")
  consumoParcialInput2?: number; // Consumo parcial calculado para input 2 desde el ultimo reporte (consumo real calculado para input 2 en este reporte - consumo real calculado para input 2 en el ultimo reporte)
}
