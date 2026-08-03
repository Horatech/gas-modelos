import { z } from "zod";
import { TipoLoraServerSchema } from "../tenant/lora-server.model";

export const TipoEventoLoraSchema = z.enum([
  "up",
  "join",
  "ack",
  "status",
  "log",
  "txack",
]);
export type TipoEventoLora = z.infer<typeof TipoEventoLoraSchema>;

export const LogLoraSchema = z.object({
  _id: z.string().optional(),
  deveui: z.string().optional(),
  deviceName: z.string().optional(),
  fuente: TipoLoraServerSchema.optional(),
  tipoEvento: TipoEventoLoraSchema.optional(),
  body: z.record(z.string(), z.any()).optional(),
  fecha: z.string().optional(),
  dispositivoEncontrado: z.boolean().optional(),
  tipoDispositivo: z.string().optional(),
  reenviado: z.boolean().optional(),
  descartado: z.boolean().optional(),
  motivoDescarte: z.string().optional(),
  codigoRespuesta: z.number().optional(),
  tiempoRespuesta: z.number().optional(),
  respuesta: z.record(z.string(), z.any()).optional(),
});
export type ILogLora = z.infer<typeof LogLoraSchema>;

////// CREATE
export const CreateLogLoraSchema = LogLoraSchema.omit({ _id: true });
export type ICreateLogLora = z.infer<typeof CreateLogLoraSchema>;

////// UPDATE
export const UpdateLogLoraSchema = LogLoraSchema.omit({ _id: true });
export type IUpdateLogLora = z.infer<typeof UpdateLogLoraSchema>;
