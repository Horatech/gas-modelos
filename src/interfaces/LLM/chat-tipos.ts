import { z } from "zod";

export const TipoMensajeSchema = z.enum(["Usuario", "Asistente"]);
export type ITipoMensaje = z.infer<typeof TipoMensajeSchema>;

export const FuenteMensajeSchema = z.enum(["App", "Web", "Whatsapp"]);
export type IFuenteMensaje = z.infer<typeof FuenteMensajeSchema>;
