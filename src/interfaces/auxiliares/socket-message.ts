import { z } from "zod";

export const SocketMessageSchema = z.object({
  /**
   * Las entidades modificadas (clientes, usuarios, etc)
   */
  paths: z.array(z.string()).optional(),
  /**
   * Metodo HTTP ejecutado (post, put, delete)
   */
  method: z.string().optional(),
  /**
   * El id del usuario que ejecutó la accion
   */
  idUser: z.string().optional(),
  /**
   * El body que se devolvio al usuario de la entidad creada/modificada/eliminada
   */
  body: z.record(z.string(), z.any()).optional(),
  /**
   * Porque el usuario recibio el mensaje (para debug mas que nada)
   */
  motivo: z.string().optional(),
  /**
   * Porque me place
   */
  idCliente: z.string().optional(),
});
export type ISocketMessage = z.infer<typeof SocketMessageSchema>;
