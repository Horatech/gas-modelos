import { z } from "zod";
import { FuenteMensajeSchema, TipoMensajeSchema } from "./chat-tipos";
import { MetadataModeloSchema } from "./metadata-modelo";
import { ClienteSchema } from "../tenant/cliente.model";
import { UsuarioSchema } from "../tenant/usuario/schema";

/**
 * Interfaz para el historial de mensajes de un usuario. Esto representa sólo los mensajes de interacción directa entre el usuario y el LLM
 */
export const ChatSchema = z.object({
  _id: z.string().optional(),

  /**
   * Fecha de creación del mensaje
   */
  fechaCreacion: z.string().optional(),

  /**
   * Tipo de mensaje: Usuario o Asistente (si lo escribió el usuario o si es una respuesta del LLM)
   */
  tipoMensaje: TipoMensajeSchema.optional(),

  /**
   * Contenido del mensaje traducido al inglés
   */
  texto: z.string().optional(),

  /**
   * Contenido del mensaje en el idioma original
   */
  textoOriginal: z.string().optional(),

  /**
   * Si es una respuesta de DeepSeek se puede incluir o mostrar el proceso de razonamiento del LLM
   */
  razonamiento: z.string().optional(),

  /**
   * ID del usuario
   */
  idUsuario: z.string().optional(),

  /**
   * ID del cliente
   */
  idCliente: z.string().optional(),

  /**
   * Origen del mensaje (en caso del usuario, puede venir de la App, Web, Whatsapp, etc)
   */
  fuenteMensaje: FuenteMensajeSchema.optional(),

  /**
   * Metadata del modelo de LLM que generó la respuesta
   */
  metadataModelo: MetadataModeloSchema.optional(),

  // Definir conversación como entidad?
  // Este historial no debería ser infinito, analizar vectorizar los mensajes "viejos"

  //Virtuals:
  usuario: UsuarioSchema.optional(),
  cliente: ClienteSchema.optional(),
});
export type IChat = z.infer<typeof ChatSchema>;
