/**
 * Interfaz para el historial de mensajes de un usuario. Esto representa sólo los mensajes de interacción directa entre el usuario y el LLM
 */
export interface IChatUsuario {
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
   * Origen del mensaje (en caso del usuario, puede venir de la App, Web, Whatsapp, etc)
   */
  fuenteMensaje?: IFuenteMensaje;

  // Definir conversación como entidad?
  // Este historial no debería ser infinito, analizar vectorizar los mensajes "viejos"
}

export type ITipoMensaje = "Usuario" | "Asistente";

export type IFuenteMensaje = "App" | "Web" | "Whatsapp";
