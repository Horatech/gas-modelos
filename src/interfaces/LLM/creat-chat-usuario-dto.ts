import { z } from "zod";
import { FuenteMensajeSchema, TipoMensajeSchema } from "./chat-tipos";

/**
 * DTO para crear un mensaje de char de un usuario
 */
export const CrearChatUsuarioDtoSchema = z.object({
  /**
   * ID del usuario
   */
  idUsuario: z.string().optional(),

  /**
   * ID del cliente
   */
  idCliente: z.string().optional(),

  /**
   * Contenido del mensaje en inglés
   */
  texto: z.string().optional(),

  /**
   * Contenido del mensaje en el idioma original o de destino
   */
  textoOriginal: z.string().optional(),

  /**
   * Origen del mensaje (en caso del usuario, puede venir de la App, Web, Whatsapp, etc)
   */
  fuenteMensaje: FuenteMensajeSchema.optional(),

  /**
   * Tipo de mensaje
   */
  tipoMensaje: TipoMensajeSchema.optional(),
});
export type ICrearChatUsuarioDto = z.infer<typeof CrearChatUsuarioDtoSchema>;
