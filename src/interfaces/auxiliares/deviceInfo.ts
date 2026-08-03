import { z } from "zod";
import { DispositivoSchema } from "../entidades/dispositivo";
import { ScadaSchema } from "../entidades/scada";
import { TipoDispositivoSchema } from "./tipoDispositivo";

export const DeviceInfoSchema = z.object({
  name: z.string().optional(),
  deveui: z.string().optional(),
  tag: z.string().optional(), // Solo SCADA
  tipo: TipoDispositivoSchema.optional(),
  // Virtual
  dispositivo: DispositivoSchema.optional(),
  scada: ScadaSchema.optional(),
});
export type IDeviceInfo = z.infer<typeof DeviceInfoSchema>;
