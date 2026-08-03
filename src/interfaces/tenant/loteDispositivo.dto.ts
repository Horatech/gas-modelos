import { z } from "zod";
import { LoteDispositivoSchema } from "./loteDispositivo.model";

export const CreateLoteDispositivoSchema = LoteDispositivoSchema.omit({
  _id: true,
}).required();
export type ICreateLoteDispositivo = z.infer<typeof CreateLoteDispositivoSchema>;

export const UpdateLoteDispositivoSchema = LoteDispositivoSchema.omit({
  _id: true,
});
export type IUpdateLoteDispositivo = z.infer<typeof UpdateLoteDispositivoSchema>;
