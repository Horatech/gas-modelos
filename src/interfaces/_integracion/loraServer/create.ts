import { TipoLoraServer } from "./tipoLoraServer";

export interface ICreateLoraServer {
  nombre: string;
  url: string;
  tipo: TipoLoraServer;
  /**
   * URL donde el Lora Server reenviara los mensajes de los dispositivos
   */
  integrationUrl?: string;
  // Configuraciones por tipo de Lora Server
  chirpstack?: {
    token: string;
    organizationID: string;
    serviceProfileID: string;
  };
  orbiwise?: {
    user: string;
    pass: string;
    serviceProfileUUID: string;
  };
}
