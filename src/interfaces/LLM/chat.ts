import { IFuenteMensaje, ITipoMensaje } from "./chat-tipos";
import { IMetadataModelo } from "./metadata-modelo";

/**
 * Interfaz para el historial de mensajes de un usuario. Esto representa sólo los mensajes de interacción directa entre el usuario y el LLM
 */
export interface IChat {
  _id?: string;

  /**
   * Fecha de creación del mensaje
   */
  fechaCreacion?: string;

  /**
   * Tipo de mensaje: Usuario o Asistente (si lo escribió el usuario o si es una respuesta del LLM)
   */
  tipoMensaje?: ITipoMensaje;

  /**
   * Contenido del mensaje
   */
  texto?: string;

  /**
   * Si es una respuesta de DeepSeek se puede incluir o mostrar el proceso de razonamiento del LLM
   */
  razonamiento?: string;

  /**
   * ID del usuario
   */
  idUsuario?: string;

  /**
   * ID del cliente
   */
  idCliente?: string;

  /**
   * Origen del mensaje (en caso del usuario, puede venir de la App, Web, Whatsapp, etc)
   */
  fuenteMensaje?: IFuenteMensaje;

  /**
   * Metadata del modelo de LLM que generó la respuesta
   */
  metadataModelo?: IMetadataModelo;

  // Definir conversación como entidad?
  // Este historial no debería ser infinito, analizar vectorizar los mensajes "viejos"
}
