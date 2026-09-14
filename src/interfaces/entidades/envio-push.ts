import { z } from "zod";
import { TipoAlertaEnvioSchema } from "./envio-sms";

// Contrato de POST gas-notificaciones/notificaciones. El despachador manda datos;
// gas-notificaciones arma título y cuerpo, escribe la campanita y manda FCM.
export const AlertaPushSchema = z.object({
  tipoAlerta: TipoAlertaEnvioSchema,
  // Ausente en alertas de parque (equipos fuera de línea) o de infraestructura.
  idPuntoMedicion: z.string().optional(),
  nombrePunto: z.string().optional(),
  valor: z.number().optional(),
  unidad: z.string().optional(),
  limite: z.number().optional(),
  // Texto libre cuando no hay valor/límite (mensaje de la alerta, porcentaje del parque).
  detalle: z.string().optional(),
  idAlerta: z.string().optional(),
});
export type IAlertaPush = z.infer<typeof AlertaPushSchema>;

export const AvisoPushSchema = z.object({
  titulo: z.string(),
  mensaje: z.string(),
  idPuntoMedicion: z.string().optional(),
});
export type IAvisoPush = z.infer<typeof AvisoPushSchema>;

export const EnvioPushSchema = z
  .object({
    idsUsuarios: z.array(z.string()).min(1),
    idCliente: z.string(),
    tipo: z.enum(["alerta", "aviso"]),
    alerta: AlertaPushSchema.optional(),
    aviso: AvisoPushSchema.optional(),
    data: z.record(z.string(), z.string()).optional(),
  })
  .refine((e) => (e.tipo === "alerta" ? !!e.alerta : !!e.aviso), {
    message: "tipo 'alerta' requiere `alerta`; tipo 'aviso' requiere `aviso`",
  });
export type IEnvioPush = z.infer<typeof EnvioPushSchema>;
