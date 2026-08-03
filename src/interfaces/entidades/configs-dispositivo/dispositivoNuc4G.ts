import { z } from "zod";
import {
  TipoEdgeDeteccionSchema,
  TipoEntradaDigitalSchema,
} from "../config-dispositivo";
import { VersionHardwareSchema } from "../firmware";

export const DispositivoNuc4GSchema = z.object({
  // Lo que viene en set configuracion
  deveui: z.string().optional(),
  appkey: z.string().optional(),
  firmwareNuc: z.string().optional(),
  apiVersion: z.string().optional(),
  horaInicio: z.number().optional(),
  modoOperacion: z
    .enum(["REG1_DIARIO", "REG24_DIARIO", "REG8_8HORAS"])
    .optional(),
  modoEnv: z.enum(["TEST", "PROD"]).optional(),
  claveMercury: z.string().optional(),
  modoRegistros: z.enum(["REG_TOTALIZADOS", "REG_PARCIALES"]).optional(),
  iccid: z.number().optional(),
  operadora: z.string().optional(),
  telefono: z.string().optional(),
  nsa: z.number().optional(),
  voltajeBateria: z.number().optional(),
  versionHardware: z.string().optional(),
  /**
   * Este campo viene a partir una version de FW especifica y deja de venir el campo versionHardware
   */
  hardwareVersion: VersionHardwareSchema.optional(),
  //
  frecuenciaComunicacion: z.number().optional(),
  redPreferida: z.string().optional(),
  desfaceHorario: z.number().optional(), // Min

  // Si es true, gas-nuc4g responde 404 a registros/get (no se recuperan registros)
  deshabilitarRecuperacionRegistros: z.boolean().optional(),

  deviceMode: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(), // 0: Solo Correctora, 1: Solo I/O, 2: Ambos

  // Configuración GPIO (NUC v2.0)
  in1Type: TipoEntradaDigitalSchema.optional(),
  in1EdgeType: TipoEdgeDeteccionSchema.optional(), // Tipo de detección de flanco para IN1
  in2Type: TipoEntradaDigitalSchema.optional(),
  in2EdgeType: TipoEdgeDeteccionSchema.optional(), // Tipo de detección de flanco para IN2
  outputActivo: z.boolean().optional(),
  timestampActivacion: z.number().optional(), // Segundos desde 00:00:00 del día
  tiempoActivacion: z.number().optional(), // Segundos que debe estar activada

  // Teléfonos para alertas SMS (NUC v2.0)
  telefono1: z.string().optional(), // Formato: 13 caracteres sin + (ej: 5491112345678)
  telefono2: z.string().optional(),
  telefono3: z.string().optional(),
});
export type IDispositivoNuc4G = z.infer<typeof DispositivoNuc4GSchema>;
