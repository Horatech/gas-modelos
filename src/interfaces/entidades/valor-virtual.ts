/**
 * Valor que el proveedor calcula de un PM virtual (colección `valoresVirtuales`).
 * Una fila por punto, señal y instante; gas-datos la upsertea al sincronizar.
 */

import { z } from "zod";

export const ValorVirtualSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string(),
  idPuntoMedicion: z.string(),
  senal: z.enum(["P_ENTRADA", "P_SALIDA"]),
  ts: z.string(),
  valor: z.number().nullable().optional(),
  calidad: z.string().nullable().optional(),
});
export type IValorVirtual = z.infer<typeof ValorVirtualSchema>;

export const CreateValorVirtualSchema = ValorVirtualSchema.omit({ _id: true });
export type ICreateValorVirtual = z.infer<typeof CreateValorVirtualSchema>;
