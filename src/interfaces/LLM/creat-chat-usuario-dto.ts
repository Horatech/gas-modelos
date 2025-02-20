import { IFuenteMensaje, ITipoMensaje } from "./chat-tipos";

/**
 * DTO para crear un mensaje de char de un usuario
 */
export interface ICrearChatUsuarioDto {
  /**
   * ID del usuario
   */
  idUsuario?: string;

  /**
   * ID del cliente
   */
  idCliente?: string;

  /**
   * Contenido del mensaje en inglés
   */
  texto?: string;

  /**
   * Contenido del mensaje en el idioma original o de destino
   */
  textoOriginal?: string;

  /**
   * Origen del mensaje (en caso del usuario, puede venir de la App, Web, Whatsapp, etc)
   */
  fuenteMensaje?: IFuenteMensaje;

  /**
   * Tipo de mensaje
   */
  tipoMensaje?: ITipoMensaje;
}
