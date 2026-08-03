import { z } from "zod";

// ImagenesClienteSchema es un valor real que importa `cliente.model.ts`
// (`ClienteSchema.imagenes`). Para no cerrar un ciclo de `require()` en
// runtime, este archivo NO importa ningún valor de `cliente.model.ts` — ver
// CLAUDE.md, "De solo tipos a schemas Zod". `ICreateCliente`/`IUpdateCliente`
// viven en `cliente.model.ts` (donde sí está disponible `ClienteSchema` real)
// y acá solo se re-exportan como tipos.
export const ImagenesClienteSchema = z
  .object({
    icono: z.string().optional(),
    logo: z.string().optional(),
  })
  .catchall(z.string().optional());
export type IImagenesCliente = z.infer<typeof ImagenesClienteSchema>;

export type { ICreateCliente, IUpdateCliente } from "./cliente.model";
