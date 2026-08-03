import { z } from "zod";
import { TipoMensajeSchema } from "./chat-tipos";
import { MetadataModeloSchema } from "./metadata-modelo";

/**
 * DTO para creat un mensaje de respuesta del modelo LLM
 */
export const CrearChatModeloDtoSchema = z.object({
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
   * Contenido del mensaje en el idioma original
   */
  textoOriginal: z.string().optional(),

  /**
   * Razonamiento de la respuesta
   */
  razonamiento: z.string().optional(),

  /**
   * Metadata del modelo de LLM que generó la respuesta
   */
  metadataModelo: MetadataModeloSchema.optional(),

  /**
   * Tipo de mensaje
   */
  tipoMensaje: TipoMensajeSchema.optional(),
});
export type ICrearChatModeloDto = z.infer<typeof CrearChatModeloDtoSchema>;
