import { z } from "zod";
import {
  ACCIONES_ASIGNACION,
  MOTIVOS_ASIGNACION,
  ORIGENES_ASIGNACION,
} from "./metadata-vinculacion";
import type {
  IAccionAsignacion,
  IMotivoAsignacion,
  IOrigenAsignacion,
} from "./metadata-vinculacion";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { DivisionSchema } from "../tenant/usuario/permiso";
import { UsuarioSchema } from "../tenant/usuario/schema";
import { CorrectoraSchema } from "./correctora";
import { DispositivoSchema } from "./dispositivo";
import { DispositivoExternoNucSchema } from "./dispositivo-externo-nuc";
import { LocalidadSchema } from "./localidad";
import { MedidorElectricoSchema } from "./medidor-electrico";
import { MedidorResidencialSchema } from "./medidor-residencial";
import { MedidorResidencialAguaSchema } from "./medidor-residencial-agua";
import { PuntoMedicionSchema } from "./punto-medicion";
import { ScadaSchema } from "./scada";
import { UnidadPresionSchema } from "./unidad-presion";

export const EntidadesSchema = z.enum([
  "Dispositivo",
  "Correctora",
  "Unidad de Presión",
  "Scada",
  "Medidor Residencial",
  "Unidad de Negocio",
  "Centro Operativo",
  "Localidad",
  // Sumados con la formalización del proceso de asignación (ago 2026)
  "Medidor Residencial Agua",
  "Medidor Eléctrico",
  "Dispositivo Externo NUC",
  "Punto de Medición",
]);
export type IEntidades = z.infer<typeof EntidadesSchema>;

/**
 * Los tres enums se construyen a partir de las listas de `metadata-vinculacion.ts`,
 * que es un archivo hoja sin Zod: así el frontend puede leer el catálogo sin
 * arrastrar zod ni el resto de los schemas al bundle. Los tipos (`IAccionAsignacion`,
 * `IOrigenAsignacion`, `IMotivoAsignacion`) también se exportan desde ahí; acá sólo
 * viven los `*Schema`.
 *
 * Qué clase de movimiento describe el documento:
 * - `asignar`: el vínculo no existía y se creó.
 * - `desasignar`: el vínculo existía y se dio de baja (no hay entidad asignada).
 * - `reemplazar`: había un vínculo y se cambió por otro (`idEntidadAsignadaAnterior`).
 * - `cambio-fecha`: mismo vínculo, se corrigió la fecha de vigencia. Mueve histórico.
 */
export const AccionAsignacionSchema = z.enum(ACCIONES_ASIGNACION);

/**
 * Quién originó el movimiento. `USUARIO` es el único con `idUsuario`; el resto son
 * los caminos que asignan sin pasar por un formulario:
 * - `SISTEMA`: autocreación del medidor en el ingest (gas-sml, gas-api-mra-beta-ml107a).
 * - `MOVIL`: alta compuesta medidor+punto de la app (`/puntosDeMedicion/residencial-agua-con-medidor`).
 * - `IMPORT`: importador masivo de puntos / bulkCreate.
 */
export const OrigenAsignacionSchema = z.enum(ORIGENES_ASIGNACION);

/** Catálogo cerrado para que el historial se pueda filtrar y contar por causa. */
export const MotivoAsignacionSchema = z.enum(MOTIVOS_ASIGNACION);

export const AsignacionSchema = z.object({
  _id: z.string().optional(),
  //
  idCliente: z.string().optional(),
  fechaCreacion: z.string().optional(),
  idUsuario: z.string().optional(),
  // Qué movimiento fue
  accion: AccionAsignacionSchema.optional(),
  origen: OrigenAsignacionSchema.optional(),
  motivo: MotivoAsignacionSchema.optional(),
  observaciones: z.string().optional(),
  // Fecha REAL de instalación / retiro declarada por quien opera. Distinta de
  // `fechaCreacion` (cuándo se cargó) y es la que gobierna la re-vinculación del
  // histórico: los reportes/registros/alertas posteriores a ella cambian de dueño.
  fechaVigencia: z.string().nullable().optional(),
  // División a la que pertenece el movimiento, para filtrar el historial global.
  division: DivisionSchema.optional(),
  // Entidad Modificada
  tipoEntidadModificada: EntidadesSchema.optional(),
  idEntidadModificada: z.string().optional(),
  nombreEntidadModificada: z.string().optional(),
  // Entidad que se le asigna. Ausente cuando `accion === 'desasignar'`.
  tipoEntidadAsignada: EntidadesSchema.optional(),
  idEntidadAsignada: z.string().nullable().optional(),
  nombreEntidadAsignada: z.string().optional(),
  // Lo que estaba antes. Se guarda denormalizado (no hay populate) porque la
  // entidad anterior puede haberse borrado y el historial tiene que seguir legible.
  idEntidadAsignadaAnterior: z.string().nullable().optional(),
  nombreEntidadAsignadaAnterior: z.string().optional(),

  // Populate
  dispositivoAsignado: DispositivoSchema.optional(),
  correctoraAsignada: CorrectoraSchema.optional(),
  unidadPresionAsignada: UnidadPresionSchema.optional(),
  scadaAsignado: ScadaSchema.optional(),
  medidorResidencialAsignado: MedidorResidencialSchema.optional(),
  medidorResidencialAguaAsignado: MedidorResidencialAguaSchema.optional(),
  medidorElectricoAsignado: MedidorElectricoSchema.optional(),
  dispositivoExternoNucAsignado: DispositivoExternoNucSchema.optional(),
  puntoMedicionAsignado: PuntoMedicionSchema.optional(),
  unidadNegocioAsignado: UnidadNegocioSchema.optional(),
  centroOperativoAsignado: CentroOperativoSchema.optional(),
  localidadAsignada: LocalidadSchema.optional(),
  usuario: UsuarioSchema.optional(),
});
export type IAsignacion = z.infer<typeof AsignacionSchema>;

////// CREATE / UPDATE (mismo set de campos omitidos)
const omitir = {
  _id: true,
  dispositivoAsignado: true,
  correctoraAsignada: true,
  unidadPresionAsignada: true,
  scadaAsignado: true,
  medidorResidencialAsignado: true,
  medidorResidencialAguaAsignado: true,
  medidorElectricoAsignado: true,
  dispositivoExternoNucAsignado: true,
  puntoMedicionAsignado: true,
  unidadNegocioAsignado: true,
  centroOperativoAsignado: true,
  localidadAsignada: true,
  usuario: true,
} as const;

export const CreateAsignacionSchema = AsignacionSchema.omit(omitir);
export type ICreateAsignacion = z.infer<typeof CreateAsignacionSchema>;

export const UpdateAsignacionSchema = AsignacionSchema.omit(omitir);
export type IUpdateAsignacion = z.infer<typeof UpdateAsignacionSchema>;
