import { z } from "zod";
import { LoraServerSchema } from "./lora-server.model";

export const CreateLoraServerSchema = LoraServerSchema.omit({
  _id: true,
}).required({
  nombre: true,
  url: true,
  tipo: true,
});
export type ICreateLoraServer = z.infer<typeof CreateLoraServerSchema>;

export const UpdateLoraServerSchema = LoraServerSchema.omit({ _id: true });
export type IUpdateLoraServer = z.infer<typeof UpdateLoraServerSchema>;
