import { z } from "zod";

export const DispositivoSmlSchema = z.object({
  // Comunicacion
  serialNumber: z.string().optional(),
  imei: z.string().optional(),
  ip: z.string().optional(), // IP desde la cual se comunica el dispositivo
  port: z.number().optional(),

  // Info de la sim
  iccid: z.number().optional(),
  operadora: z.string().optional(),
  telefono: z.string().optional(),

  valorAlarmaBateria: z.number().optional(),

  // Configuracion del SML
  // valveControl?: boolean;
  calibrationDeviceNodeReading: z.number().optional(),
  reportingCycleInterval: z.number().optional(), // Segundos
  timezone: z.string().optional(), // UTC+2 | UTC-3 | etc.
  ipReporte: z.string().optional(), // La IP de a donde va a reportar -> 47.92.222.233 :1822
  pn: z.number().optional(), // Pulse number
  maximunMeterReading: z.number().optional(), // Valor maximo del medidor
  reportingRange: z.number().optional(), // 321: 0321 3--3+21/2 ,Means to report randomly in the range of 3-13:30
});
export type IDispositivoSml = z.infer<typeof DispositivoSmlSchema>;
