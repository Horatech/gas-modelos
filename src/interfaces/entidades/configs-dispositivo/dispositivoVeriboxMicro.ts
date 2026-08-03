import { z } from "zod";

export const DispositivoVeriboxMicroSchema = z.object({
  // Config Reportada por las auditorias
  frecuenciaComunicacion: z.number().optional(),
  limiteMin: z.number().optional(),
  limiteMax: z.number().optional(),
  apn: z.string().optional(),
  usuario: z.string().optional(),
  clave: z.string().optional(),
  // Migracion
  telefono: z.string().optional(),
  operadora: z.string().optional(),
  migrar: z.boolean().optional(),
  fechaMigrar: z.string().optional(),
});
export type IDispositivoVeriboxMicro = z.infer<
  typeof DispositivoVeriboxMicroSchema
>;
