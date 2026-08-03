import { z } from "zod";
import { AgrupacionSchema } from "../gas/agrupacion/schema";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { ClienteSchema } from "../tenant/cliente.model";
import { UsuarioSchema } from "../tenant/usuario/schema";
import { TipoAlertaEnvioSchema, TipoEnvioSchema } from "./envio-sms";
import { GrupoSchema } from "./grupo";
import { LocalidadSchema } from "./localidad";
import { PuntoMedicionSchema } from "./punto-medicion";
import { ScadaSchema } from "./scada";

export const ConfigNotificacionSchema = z.object({
  _id: z.string().optional(),
  //
  fechaCreacion: z.string().optional(),
  tipoEnvio: TipoEnvioSchema.optional(),
  tipoAlerta: TipoAlertaEnvioSchema.optional(),
  idsUsuarios: z.array(z.string()).optional(),
  tag: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idGrupo: z.string().optional(),
  idAgrupacion: z.string().optional(),
  idLocalidad: z.string().optional(),
  idScada: z.string().optional(),
  idPuntoMedicion: z.string().optional(),
  // Virtuals
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  grupo: GrupoSchema.optional(),
  agrupacion: AgrupacionSchema.optional(),
  localidad: LocalidadSchema.optional(),
  scada: ScadaSchema.optional(),
  puntoMedicion: PuntoMedicionSchema.optional(),
  usuarios: z.array(UsuarioSchema).optional(),
});
export type IConfigNotificacion = z.infer<typeof ConfigNotificacionSchema>;

////// CREATE/UPDATE
const omitir = { _id: true, cliente: true, scada: true, usuarios: true } as const;

export const CreateConfigNotificacionSchema = ConfigNotificacionSchema.omit(omitir);
export type ICreateConfigNotificacion = z.infer<typeof CreateConfigNotificacionSchema>;

export const UpdateConfigNotificacionSchema = ConfigNotificacionSchema.omit(omitir);
export type IUpdateConfigNotificacion = z.infer<typeof UpdateConfigNotificacionSchema>;
