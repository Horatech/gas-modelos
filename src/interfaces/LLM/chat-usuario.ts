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

  /**
   * Metadata del modelo de LLM que generó la respuesta
   */
  metadataModelo?: IChatUsuarioModeloMetadata;

  // Definir conversación como entidad?
  // Este historial no debería ser infinito, analizar vectorizar los mensajes "viejos"
}

/**
 * Metadata del modelo de LLM, esto lo genera LangChain
 */
export interface IChatUsuarioModeloMetadata {
  model: string;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
  input_tokens: number;
  output_tokens: number;
  done_reason: string;
  done: boolean;
}

export type ITipoMensaje = "Usuario" | "Asistente";

export type IFuenteMensaje = "App" | "Web" | "Whatsapp";
