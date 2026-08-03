import { z } from "zod";
import type { IDeviceInfo } from "../../auxiliares/deviceInfo";
import type { ITenantInfo } from "../../auxiliares/tenentInfo";
import { ValoresResumenReporteSchema } from "./valores reporte/valoresReporte";

export const ResumenReporteSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  // Tentant
  tenant: z.custom<ITenantInfo>().optional(),
  // Datos del dispositivo
  device: z.custom<IDeviceInfo>().optional(),
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados: z.array(z.string()).optional(),
  // Datos especificos de acuerdo al tipo de dispositivo
  valores: ValoresResumenReporteSchema.optional(),
});
export type IResumenReporte = z.infer<typeof ResumenReporteSchema>;
