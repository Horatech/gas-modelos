import { z } from "zod";
import { CentroOperativoSchema } from "../../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../../gas/unidadNegocio/schema";
import { NivelSchema } from "./permiso";

/**
 * Perfiles de la campanita por nivel (`usuario.notificaciones`). Son dato de prod
 * y canal de alarma de los clientes: NO se migran ni se reemplazan por `IEnvioSms`.
 * gas-cron los lee tal cual; las configuraciones de alerta con canal push son un
 * camino aditivo aparte. Los códigos 3 y 4 los define el front (`constantes.ts`).
 */
export enum ICodigoNotificacion {
  "Correctora sin Reportar" = 0,
  "Error de Comunicación con la Correctora" = 1,
  "Cromatografía Próxima a Vencer" = 2,
}

/** Nombre de cada código del perfil (0-4), incluidos los dos que define el front. */
export const NOMBRES_AVISO_PERFIL: Record<number, string> = {
  0: "Correctora sin Reportar",
  1: "Error de Comunicación con la Correctora",
  2: "Cromatografía Próxima a Vencer",
  3: "Fallo en Aplicación de Cromatografía",
  4: "Medidores Residenciales - Sensor desconectado",
};

/** Ver la nota de `ICodigoNotificacion`: dato de prod, no se migra. */
export const NotificacionesSchema = z.object({
  nivel: NivelSchema,
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  habilitados: z.array(z.custom<ICodigoNotificacion>()).optional(),

  // Populate
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
});
export type INotificaciones = z.infer<typeof NotificacionesSchema>;
