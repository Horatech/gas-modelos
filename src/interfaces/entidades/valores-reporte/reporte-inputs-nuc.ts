import { z } from "zod";
import type { TipoInputDispositivoExterno } from "../dispositivo-externo-nuc";

// tipoInput1/tipoInput2 como z.custom: dispositivo-externo-nuc.ts es parte
// del SCC de IDispositivo (a través de reporte.ts -> valoresReporte.ts ->
// este archivo -> dispositivo-externo-nuc.ts). Ver CLAUDE.md, "De solo tipos
// a schemas Zod".
export const ReporteInputsNucSchema = z.object({
  timestamp: z.string().optional(),
  // Input 1
  tipoInput1: z.custom<TipoInputDispositivoExterno>().optional(),
  valorInput1: z.number().optional(),
  valorActualInput1: z.number().optional(),
  consumoInput1: z.number().optional(),
  factorAplicadoInput1: z.number().optional(),
  valorInicialAplicadoInput1: z.number().optional(),
  consumoParcialInput1: z.number().optional(),
  // Input 2
  tipoInput2: z.custom<TipoInputDispositivoExterno>().optional(),
  valorInput2: z.number().optional(),
  valorActualInput2: z.number().optional(),
  consumoInput2: z.number().optional(),
  factorAplicadoInput2: z.number().optional(),
  valorInicialAplicadoInput2: z.number().optional(),
  consumoParcialInput2: z.number().optional(),
});
export interface IReporteInputsNuc {
  timestamp?: string;
  tipoInput1?: TipoInputDispositivoExterno;
  valorInput1?: number;
  valorActualInput1?: number;
  consumoInput1?: number;
  factorAplicadoInput1?: number;
  valorInicialAplicadoInput1?: number;
  consumoParcialInput1?: number;
  tipoInput2?: TipoInputDispositivoExterno;
  valorInput2?: number;
  valorActualInput2?: number;
  consumoInput2?: number;
  factorAplicadoInput2?: number;
  valorInicialAplicadoInput2?: number;
  consumoParcialInput2?: number;
}
