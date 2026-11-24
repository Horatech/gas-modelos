import { z } from "zod";
import { RecorridoVistoSchema } from "../../entidades/recorrido-asistente";
import { ClienteSchema } from "../cliente.model";
import { DatosPersonalesSchema } from "./create";
import { ModulosUsuarioSchema } from "./modulos";
import { NotificacionesSchema } from "./notificacion";
import { PermisoSchema } from "./permiso";
import { TokenPushSchema } from "./token-push";

export const UsuarioSchema = z.object({
  _id: z.string().optional(),
  username: z.string().optional(),
  hash: z.string().optional(),
  idCliente: z.string().optional(),
  activo: z.boolean().optional(),
  /** Usa el asistente de ayuda. Hace falta además `config.usaLlm` del cliente. */
  usaLlm: z.boolean().optional(),
  /** Intervalo mínimo de sus tareas `consulta`, en minutos; reemplaza al del cliente (`config.asistente`). */
  intervaloConsultaMin: z.number().int().min(1).optional(),
  /** Ve, pausa y cancela las tareas programadas de todos los usuarios de su cliente. */
  verTareasCliente: z.boolean().optional(),
  /** Cuándo vio el recorrido del asistente, por canal. Sin el campo, no lo vio. */
  recorridoAsistente: RecorridoVistoSchema.optional(),
  /** Módulos habilitados para el usuario, además del flag del cliente. */
  modulos: ModulosUsuarioSchema.optional(),
  fechaCreacion: z.string().optional(),
  permisos: z.array(PermisoSchema).optional(),
  datosPersonales: DatosPersonalesSchema.optional(),
  notificaciones: z.array(NotificacionesSchema).optional(),
  tokensPush: z.array(TokenPushSchema).optional(),
  /** Token único legado (web vieja). Se lee siempre junto a `tokensPush`; no se migra. */
  tokenPush: z.string().optional(),
  fecha_activacion_whatsapp: z.string().optional(),
  // Virtuals
  cliente: ClienteSchema.optional(),
});
export type IUsuario = z.infer<typeof UsuarioSchema>;
