import { z } from "zod";
import { CentroOperativoSchema } from "../../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../../gas/unidadNegocio/schema";
import { NivelSchema } from "./permiso";

export enum ICodigoNotificacion {
  "Correctora sin Reportar" = 0,
  "Error de Comunicación con la Correctora" = 1,
  "Cromatografía Próxima a Vencer" = 2,
}

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
