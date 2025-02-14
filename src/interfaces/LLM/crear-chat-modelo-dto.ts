import { IMetadataModelo } from "./metadata-modelo";

/**
 * DTO para creat un mensaje de respuesta del modelo LLM
 */
export interface ICrearChatModeloDto {
  /**
   * ID del usuario
   */
  idUsuario?: string;

  /**
   * ID del cliente
   */
  idCliente?: string;

  /**
   * Contenido del mensaje
   */
  texto?: string;

  /**
   * Razonamiento de la respuesta
   */
  razonamiento?: string;

  /**
   * Metadata del modelo de LLM que generó la respuesta
   */
  metadataModelo?: IMetadataModelo;
}