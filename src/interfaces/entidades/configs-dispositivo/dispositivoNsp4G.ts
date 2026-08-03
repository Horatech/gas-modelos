import { z } from "zod";

export const DispositivoNsp4GSchema = z.object({
  firmwareNsp: z.string().optional(),
  apiVersion: z.string().optional(),
  horaInicio: z.number().optional(),
  modoOperacion: z
    .enum([
      "REG1_DIARIO",
      "REG24_DIARIO",
      "REG1_1HORA",
      "REG2_2HORAS",
      "REG3_3HORAS",
      "REG4_4HORAS",
      "REG6_6HORAS",
      "REG8_8HORAS",
      "REG12_12HORAS",
    ])
    .optional(),
  modoEnv: z.enum(["PROD", "TEST"]).optional(),
  limiteMin: z.number().optional(),
  limiteMax: z.number().optional(),
  medicionInstantanea: z.number().optional(),
  voltajeBateria: z.number().optional(),
  telefono1: z.string().optional(),
  telefono2: z.string().optional(),
  telefono3: z.string().optional(),
  lugar: z.string().optional(),
  iccid: z.string().optional(),
  apn: z.string().optional(),
  user: z.string().optional(),
  pass: z.string().optional(),
  estadoAPN: z.boolean().optional(),
  operadora: z.string().optional(),
  telefono: z.string().optional(),
});
export type IDispositivoNsp4G = z.infer<typeof DispositivoNsp4GSchema>;
