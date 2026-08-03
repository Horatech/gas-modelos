import { z } from "zod";
import { TipoDispositivoSchema } from "../auxiliares/tipoDispositivo";
import { LoraServerSchema } from "./lora-server.model";

export const LoraServerConfigPorAppSchema = z.object({
  idLoraServer: z.string(),
  deviceProfileID: z.string().optional(),
  //
  loraServer: LoraServerSchema.optional(),
});
export type ILoraServerConfigPorApp = z.infer<
  typeof LoraServerConfigPorAppSchema
>;

export const CreateTipoDispositivoSchema = z.object({
  nombre: TipoDispositivoSchema,
  integrationUrl: z.string().optional(),
  loraServers: z.array(LoraServerConfigPorAppSchema).optional(),
});
export type ICreateTipoDispositivo = z.infer<
  typeof CreateTipoDispositivoSchema
>;

export const UpdateTipoDispositivoSchema = z.object({
  nombre: TipoDispositivoSchema.optional(),
  integrationUrl: z.string().optional(),
  loraServers: z.array(LoraServerConfigPorAppSchema).optional(),
});
export type IUpdateTipoDispositivo = z.infer<
  typeof UpdateTipoDispositivoSchema
>;
