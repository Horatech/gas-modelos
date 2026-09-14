import { z } from "zod";

export const PlataformaPushSchema = z.enum(["web", "android", "ios"]);
export type PlataformaPush = z.infer<typeof PlataformaPushSchema>;

// Un token FCM por dispositivo. `idDispositivo` es estable por instalación
// (UUID persistido por el cliente); si el token rota en el mismo aparato se
// reemplaza en vez de acumularse.
export const TokenPushSchema = z.object({
  idDispositivo: z.string(),
  token: z.string(),
  plataforma: PlataformaPushSchema,
  nombre: z.string().optional(),
  fechaAlta: z.string(),
});
export type ITokenPush = z.infer<typeof TokenPushSchema>;
