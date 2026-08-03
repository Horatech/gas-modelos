import { z } from "zod";
import { TipoDispositivoSchema } from "../auxiliares/tipoDispositivo";
import { LoraServerConfigPorAppSchema } from "./tipo-dispositivo.dto";

// Nombrado "...ModelSchema" (no "TipoDispositivoSchema") para no chocar con el
// schema del type TipoDispositivo (union de auxiliares/tipoDispositivo.ts).
export const TipoDispositivoModelSchema = z.object({
  _id: z.string().optional(),
  nombre: TipoDispositivoSchema.optional(),
  integrationUrl: z.string().optional(),
  loraServers: z.array(LoraServerConfigPorAppSchema).optional(),
});
export type ITipoDispositivo = z.infer<typeof TipoDispositivoModelSchema>;
