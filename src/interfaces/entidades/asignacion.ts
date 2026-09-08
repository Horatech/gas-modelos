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
import { EstadoBaselineDispositivoSchema } from "./baseline-dispositivo";
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

  // ==========================================================================
  // Anclas del acumulado del tramo (sólo vínculo dispositivo -> medidor
  // residencial de gas o de agua)
  // ==========================================================================
  //
  // El acumulado del MEDIDOR se calcula
  // `dialInicial + (odómetro - lecturaInicialDispositivo)`, y las dos anclas son
  // propiedad del TRAMO, no del medidor: un medidor sobrevive al recambio de
  // equipo, y guardarlas en el medidor destruye las del tramo anterior en cada
  // recambio. Eso ya está documentado como agujero sin salida en
  // `gas-datos/.../medidorResidencials.service.ts` ("el baseline viejo no está
  // guardado en ninguna parte: no hay forma de recalcularlos"), y es lo que hace
  // que `recalcularConsumoCorregido` hoy sólo pueda cubrir el vínculo vigente.
  //
  // El medidor conserva una copia denormalizada de las anclas del tramo VIGENTE
  // (`consumoInicial`, `lecturaInicialDispositivo`), que es lo que lee la ingesta
  // en el camino rápido. Estos campos son la fuente de verdad y la única forma de
  // reconstruir los tramos cerrados.

  /**
   * Lectura del dial del medidor mecánico declarada en este evento, en m³.
   *
   * En `asignar` es la lectura al instalar; en `desasignar`, la del retiro (sirve
   * para cerrar el tramo y para medir el hueco sin medición que sigue); en
   * `cambio-lectura`, la corrección.
   *
   * **Es una lectura física, no un cálculo.** Por eso cierra el caso del equipo
   * retirado: mientras no hubo equipo el medidor siguió contando y nadie lo midió,
   * así que el único dato posible del arranque del tramo nuevo es que alguien lo
   * lea. Un arrastre calculado desde lo que midió el equipo anterior daría el
   * hueco en cero, en silencio y para siempre.
   */
  dialLectura: z.number().optional(),
  /**
   * Cuándo se tomó `dialLectura`. Puede ser POSTERIOR a `fechaVigencia`: el
   * operador carga el dial días después de instalar.
   *
   * Guardarlo es lo que hace recuperable el ancla, porque el equipo midió el tramo
   * intermedio: `dialInicial = dialLectura - (odómetro(fecha) - lecturaInicialDispositivo)`.
   * Sin esta fecha la lectura no se puede proyectar al instante de instalación y el
   * offset queda para siempre sin verificar — es exactamente el estado de los 1514
   * medidores de gas que hoy tienen `consumoInicial` cargado en un instante
   * desconocido (medido en prod, 7-sep-2026).
   */
  dialLecturaFecha: z.string().optional(),
  /**
   * Ancla del tramo: el dial ya proyectado a `fechaVigencia`. Igual a `dialLectura`
   * cuando la lectura se tomó en el instante de la instalación.
   */
  dialInicial: z.number().optional(),
  /**
   * Nadie leyó el dial en este vínculo. Es el caso del medidor **creado
   * automáticamente por la ingesta** (`origen: 'SISTEMA'`), que hoy son 100 de los
   * 153 eventos residenciales de producción.
   *
   * El acumulado se sigue emitiendo con ancla 0 —o sea "lo que midió el equipo
   * desde que lo vemos", que es el comportamiento actual—, pero marcado: alimenta
   * la cola de dial pendiente y permite que las vistas lo rotulen como acumulado
   * relativo en vez de hacerlo pasar por la lectura del medidor físico.
   *
   * Distinto de `dialInicial: 0`, que afirma que el dial ERA 0.
   */
  dialPendiente: z.boolean().optional(),
  /** Odómetro del dispositivo en `fechaVigencia`. Ver `IMedidorResidencial`. */
  lecturaInicialDispositivo: z.number().optional(),
  /** Ver `EstadoBaselineDispositivoSchema`. Ausente = `confirmado`. */
  lecturaInicialDispositivoEstado: EstadoBaselineDispositivoSchema.optional(),

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
