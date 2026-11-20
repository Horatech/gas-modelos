/**
 * Tareas programadas del asistente: lo que el usuario le pide a Horacito que haga solo durante un rato —avisar si una
 * variable cruza un umbral, mandar su valor cada tanto o correr una consulta a horario—.
 *
 * Plan: gas-insideht-doc `docs/superpowers/plans/2026-11-02-tareas-programadas.md`.
 *
 * - `umbral` y `reporte` los evalúa gas-cron leyendo el último valor de la variable; el LLM sólo arma la propuesta.
 * - `consulta` corre el agente en cada ejecución, a nombre del usuario dueño.
 * - Toda tarea vence: como mucho `MAX_VIGENCIA_TAREA_ASISTENTE_HORAS` después de creada.
 * - El texto que ve el usuario (`descripcion`) lo arma `describirTareaAsistente`, nunca el LLM.
 *
 * No hay estado "propuesta": la propuesta vive en la charla hasta que el usuario la confirma.
 */

import { z } from "zod";
import { CanalAsistenteSchema } from "./consulta-asistente";

/** Tope de tareas por usuario; cuentan las `activa` y las `pausada`. */
export const MAX_TAREAS_ASISTENTE_POR_USUARIO = 10;
/** Vigencia máxima de una tarea, de `desde` a `hasta`. */
export const MAX_VIGENCIA_TAREA_ASISTENTE_HORAS = 48;
/** Intervalo mínimo de una `consulta` cuando ni el usuario ni el cliente tienen uno propio. */
export const INTERVALO_CONSULTA_ASISTENTE_DEFECTO_MIN = 60;
/** Largo máximo de la pregunta de una `consulta`. */
export const MAX_PREGUNTA_TAREA_ASISTENTE = 500;

export const TipoTareaAsistenteSchema = z.enum(["umbral", "reporte", "consulta"]);
export type TipoTareaAsistente = z.infer<typeof TipoTareaAsistenteSchema>;

export const EstadoTareaAsistenteSchema = z.enum(["activa", "pausada", "cumplida", "vencida", "cancelada", "error"]);
export type EstadoTareaAsistente = z.infer<typeof EstadoTareaAsistenteSchema>;
/** Los estados que cuentan para el tope y que todavía pueden volver a correr. */
export const ESTADOS_TAREA_ASISTENTE_VIGENTE: readonly EstadoTareaAsistente[] = ["activa", "pausada"];

/**
 * De dónde sale el último valor. Cada fuente se lee distinto (cache de gas-cache-api):
 * - `scada`: `scadas:_id:<id>` → `ultimoRegistro.valores.{valorActual, timestamp}`.
 * - `unidadPresion`: `unidadpresions:_id:<id>` → `ultimoRegistro.valores.{presion, unidad, timestamp}`.
 * - `correctora`: `correctoras:_id:<id>` → `ultimoRegistro.<campo>` (plano, con `timestamp`).
 */
export const FuenteVariableTareaAsistenteSchema = z.enum(["scada", "unidadPresion", "correctora"]);
export type FuenteVariableTareaAsistente = z.infer<typeof FuenteVariableTareaAsistenteSchema>;

/**
 * Campos de la correctora que se pueden seguir, con su nombre y unidad (los del perfil `NUC` de `perfil-lectura.ts`).
 * La presión de la correctora es ABSOLUTA: no se compara con una presión relativa de SCADA o NSP.
 */
export const CAMPOS_CORRECTORA_TAREA_ASISTENTE: Record<string, { nombre: string; unidad: string }> = {
  presion: { nombre: "Presión absoluta", unidad: "bar" },
  temperatura: { nombre: "Temperatura", unidad: "°C" },
  caudalPromedio: { nombre: "Caudal promedio", unidad: "m³/h" },
  caudalPico: { nombre: "Caudal pico", unidad: "m³/h" },
};

/** Lo que manda quien crea la tarea para elegir la variable. */
export const PedidoVariableTareaAsistenteSchema = z.object({
  fuente: FuenteVariableTareaAsistenteSchema,
  /** `_id` del SCADA, de la unidad de presión o de la correctora. */
  id: z.string().min(1),
  /** Sólo correctora: qué campo de `ultimoRegistro` (p. ej. `presion`). */
  campo: z.string().min(1).optional(),
});
export type IPedidoVariableTareaAsistente = z.infer<typeof PedidoVariableTareaAsistenteSchema>;

/** La variable como queda guardada: gas-api-cliente completa nombre, unidad y punto al crear. */
export const VariableTareaAsistenteSchema = PedidoVariableTareaAsistenteSchema.extend({
  idPuntoMedicion: z.string().optional(),
  /** Cómo se la nombra en los avisos (p. ej. "ERP Tandil · Presión de salida"). */
  nombre: z.string().min(1),
  unidad: z.string().optional(),
});
export type IVariableTareaAsistente = z.infer<typeof VariableTareaAsistenteSchema>;

/**
 * - `mayor` / `menor`: la condición se cumple con el valor por encima / por debajo de `valor`.
 * - `fueraDe`: se cumple con el valor fuera de la banda `[valor, valor2]`.
 *
 * `histeresis` (en la unidad de la variable): para dejar de cumplirse, el valor tiene que volver esa distancia más
 * adentro; evita un aviso por cada vaivén alrededor del umbral. `enfriamientoMin`: tiempo mínimo entre dos avisos
 * de cruce (sólo con `cadaCruce`).
 */
export const UmbralTareaAsistenteSchema = z.object({
  operador: z.enum(["mayor", "menor", "fueraDe"]),
  valor: z.number(),
  valor2: z.number().optional(),
  histeresis: z.number().nonnegative().optional(),
  /** `unaVez`: la tarea queda `cumplida` al primer cruce. `cadaCruce`: avisa cada vez que entra en la condición. */
  repetir: z.enum(["unaVez", "cadaCruce"]),
  enfriamientoMin: z.number().int().nonnegative().optional(),
});
export type IUmbralTareaAsistente = z.infer<typeof UmbralTareaAsistenteSchema>;

export const ReporteTareaAsistenteSchema = z.object({
  cadaMin: z.number().int().min(1),
});
export type IReporteTareaAsistente = z.infer<typeof ReporteTareaAsistenteSchema>;

/** `"HH:mm"`, hora de Argentina. */
export const HoraTareaAsistenteSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "hora HH:mm");

/** Se programa de una de dos formas, exactamente una: cada `cadaMin` minutos o a `horas` fijas. */
export const ConsultaTareaAsistenteSchema = z.object({
  pregunta: z.string().trim().min(3).max(MAX_PREGUNTA_TAREA_ASISTENTE),
  cadaMin: z.number().int().min(1).optional(),
  horas: z.array(HoraTareaAsistenteSchema).min(1).max(24).optional(),
});
export type IConsultaTareaAsistente = z.infer<typeof ConsultaTareaAsistenteSchema>;

export const OrigenTareaAsistenteSchema = z.object({
  canal: CanalAsistenteSchema,
  /** La consulta de la charla en la que se propuso; ausente si se creó desde "Mis tareas". */
  idConsultaAsistente: z.string().optional(),
});
export type IOrigenTareaAsistente = z.infer<typeof OrigenTareaAsistenteSchema>;

/** Lo último que miró el evaluador, haya avisado o no. */
export const EvaluacionTareaAsistenteSchema = z.object({
  fecha: z.string(),
  /** Ausente si la variable no tenía valor. */
  valor: z.number().optional(),
  /** La hora del dato, que no es la de la evaluación. */
  fechaDato: z.string().optional(),
  /** Sólo `umbral`: si la condición se cumple con ese valor (ya con la histéresis). */
  cumple: z.boolean().optional(),
});
export type IEvaluacionTareaAsistente = z.infer<typeof EvaluacionTareaAsistenteSchema>;

/** Sin refine: zod 4 no deja hacer `.omit` sobre un schema refinado. Las reglas por tipo están en `problemasTareaAsistente`. */
export const TareaAsistenteSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string(),
  /** El dueño: a su nombre corre y a él le llegan los avisos. */
  idUsuario: z.string(),
  tipo: TipoTareaAsistenteSchema,
  estado: EstadoTareaAsistenteSchema,
  /** Por qué pasó a `error` (o a `cancelada` por otro motivo que el usuario). */
  motivoEstado: z.string().optional(),
  /** La arma `describirTareaAsistente`, nunca el LLM. */
  descripcion: z.string(),
  desde: z.string(),
  hasta: z.string(),
  variable: VariableTareaAsistenteSchema.optional(),
  umbral: UmbralTareaAsistenteSchema.optional(),
  reporte: ReporteTareaAsistenteSchema.optional(),
  consulta: ConsultaTareaAsistenteSchema.optional(),
  /** La charla donde caen sus avisos. */
  idConversacion: z.string(),
  origen: OrigenTareaAsistenteSchema,
  // Del evaluador:
  /** `reporte` y `consulta`: cuándo toca la próxima. `umbral` se mira en cada vuelta. */
  proximaEjecucion: z.string().optional(),
  /** `umbral`: si la condición se cumplía en la última evaluación; para la histéresis y para avisar sólo al entrar. */
  umbralCumplido: z.boolean().optional(),
  /** El último aviso de cruce; para el enfriamiento. */
  ultimoDisparo: z.string().optional(),
  ultimaEvaluacion: EvaluacionTareaAsistenteSchema.optional(),
  // Auditoría:
  pausadaPor: z.string().optional(),
  canceladaPor: z.string().optional(),
  fechaCreacion: z.string().optional(),
  fechaActualizacion: z.string().optional(),
});
export type ITareaAsistente = z.infer<typeof TareaAsistenteSchema>;

export const CreateTareaAsistenteSchema = TareaAsistenteSchema.omit({ _id: true, fechaCreacion: true, fechaActualizacion: true });
export type ICreateTareaAsistente = z.infer<typeof CreateTareaAsistenteSchema>;

/** Lo que cambia después del alta: el estado y lo del evaluador. La regla no se edita. */
export const UpdateTareaAsistenteSchema = TareaAsistenteSchema.pick({
  estado: true,
  motivoEstado: true,
  descripcion: true,
  proximaEjecucion: true,
  umbralCumplido: true,
  ultimoDisparo: true,
  ultimaEvaluacion: true,
  pausadaPor: true,
  canceladaPor: true,
}).partial();
export type IUpdateTareaAsistente = z.infer<typeof UpdateTareaAsistenteSchema>;

type ReglaTarea = {
  tipo: TipoTareaAsistente;
  variable?: unknown;
  umbral?: IUmbralTareaAsistente;
  reporte?: IReporteTareaAsistente;
  consulta?: IConsultaTareaAsistente;
};

/** Las reglas por tipo que zod no expresa sin refine. Vacío = válida. */
export function problemasTareaAsistente(t: ReglaTarea): string[] {
  const p: string[] = [];
  const debe = (campo: keyof ReglaTarea, si: boolean) => {
    if (si && t[campo] === undefined) p.push(`${t.tipo} requiere ${campo}`);
    if (!si && t[campo] !== undefined) p.push(`${t.tipo} no lleva ${campo}`);
  };
  debe("variable", t.tipo !== "consulta");
  debe("umbral", t.tipo === "umbral");
  debe("reporte", t.tipo === "reporte");
  debe("consulta", t.tipo === "consulta");
  const v = t.variable as { fuente?: string; campo?: string } | undefined;
  if (v?.fuente === "correctora" && !(v.campo && v.campo in CAMPOS_CORRECTORA_TAREA_ASISTENTE)) {
    p.push(`correctora requiere campo: ${Object.keys(CAMPOS_CORRECTORA_TAREA_ASISTENTE).join(", ")}`);
  }
  if (v && v.fuente !== "correctora" && v.campo !== undefined) p.push(`${v.fuente} no lleva campo`);
  const u = t.umbral;
  if (u) {
    if (u.operador === "fueraDe" && !(u.valor2 !== undefined && u.valor2 > u.valor)) {
      p.push("fueraDe requiere valor2 mayor que valor");
    }
    if (u.operador !== "fueraDe" && u.valor2 !== undefined) p.push(`${u.operador} no lleva valor2`);
    if (u.repetir === "unaVez" && u.enfriamientoMin !== undefined) p.push("unaVez no lleva enfriamientoMin");
  }
  const c = t.consulta;
  if (c && (c.cadaMin === undefined) === (c.horas === undefined)) {
    p.push("consulta va con cadaMin o con horas, una de las dos");
  }
  if (c?.horas && new Set(c.horas).size !== c.horas.length) p.push("horas repetidas");
  return p;
}

/** Lo que manda el front (o la tarjeta de la charla) al crear. El resto lo completa gas-api-cliente. */
export const PedidoTareaAsistenteSchema = z
  .object({
    tipo: TipoTareaAsistenteSchema,
    variable: PedidoVariableTareaAsistenteSchema.optional(),
    umbral: UmbralTareaAsistenteSchema.optional(),
    reporte: ReporteTareaAsistenteSchema.optional(),
    consulta: ConsultaTareaAsistenteSchema.optional(),
    /** ISO. Empieza al crearla; gas-api-cliente controla la vigencia máxima. */
    hasta: z.iso.datetime({ offset: true }),
    /** La charla donde se propuso; ausente desde "Mis tareas" (se genera una). */
    idConversacion: z.string().min(1).optional(),
    origen: OrigenTareaAsistenteSchema,
  })
  .superRefine((t, ctx) => {
    for (const message of problemasTareaAsistente(t)) ctx.addIssue({ code: "custom", message });
  });
export type IPedidoTareaAsistente = z.input<typeof PedidoTareaAsistenteSchema>;

/** `hasta` posterior a `desde` y dentro de la vigencia máxima. */
export function vigenciaTareaAsistenteValida(desde: string, hasta: string): boolean {
  const d = Date.parse(desde);
  const h = Date.parse(hasta);
  return Number.isFinite(d) && Number.isFinite(h) && h > d && h - d <= MAX_VIGENCIA_TAREA_ASISTENTE_HORAS * 3_600_000;
}

const minutosDelDia = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

/** La menor separación, en minutos, entre dos horas consecutivas, contando el paso de medianoche. */
export function menorSeparacionHorasMin(horas: string[]): number {
  const m = [...new Set(horas)].map(minutosDelDia).sort((a, b) => a - b);
  if (m.length < 2) return 24 * 60;
  return Math.min(...m.map((v, i) => (i === m.length - 1 ? m[0] + 24 * 60 : m[i + 1]) - v));
}

/** Intervalo mínimo de `consulta` para un usuario: el suyo, si no el del cliente, si no el de defecto. */
export function intervaloConsultaEfectivoMin(
  usuario?: { intervaloConsultaMin?: number | null },
  cliente?: { config?: { asistente?: { intervaloConsultaMin?: number | null } | null } | null },
): number {
  return (
    usuario?.intervaloConsultaMin ??
    cliente?.config?.asistente?.intervaloConsultaMin ??
    INTERVALO_CONSULTA_ASISTENTE_DEFECTO_MIN
  );
}

/** Si la programación de una `consulta` respeta el intervalo mínimo. */
export function consultaRespetaIntervalo(c: IConsultaTareaAsistente, minimoMin: number): boolean {
  if (c.cadaMin !== undefined) return c.cadaMin >= minimoMin;
  return !!c.horas && menorSeparacionHorasMin(c.horas) >= minimoMin;
}

const ZONA_AR = "America/Argentina/Buenos_Aires";

/** "21/11 18:00", hora de Argentina. */
export function fechaCortaTareaAsistente(iso: string): string {
  const f = new Intl.DateTimeFormat("es-AR", {
    timeZone: ZONA_AR,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const v = (t: string) => f.find((p) => p.type === t)?.value ?? "";
  return `${v("day")}/${v("month")} ${v("hour")}:${v("minute")}`;
}

/** "1,2 bar": coma decimal, sin ceros de más. */
export function valorTareaAsistente(valor: number, unidad?: string): string {
  const n = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 3 }).format(valor);
  return unidad ? `${n} ${unidad}` : n;
}

const listaHoras = (horas: string[]) => {
  const h = [...horas].sort();
  return h.length === 1 ? h[0] : `${h.slice(0, -1).join(", ")} y ${h[h.length - 1]}`;
};

/**
 * El texto de la tarea que ve el usuario en la tarjeta de confirmación, en "Mis tareas" y en los avisos. Lo arma el
 * código para que lo que se confirma sea exactamente lo que se ejecuta.
 */
export function describirTareaAsistente(
  t: Pick<ITareaAsistente, "tipo" | "hasta" | "umbral" | "reporte" | "consulta"> & {
    variable?: Pick<IVariableTareaAsistente, "nombre" | "unidad">;
  },
): string {
  const hasta = `hasta el ${fechaCortaTareaAsistente(t.hasta)}`;
  const nombre = t.variable ? `«${t.variable.nombre}»` : "";
  const v = (x: number) => valorTareaAsistente(x, t.variable?.unidad);
  if (t.tipo === "umbral" && t.umbral) {
    const u = t.umbral;
    const condicion =
      u.operador === "mayor"
        ? `supera ${v(u.valor)}`
        : u.operador === "menor"
          ? `baja de ${v(u.valor)}`
          : `sale de ${v(u.valor)} a ${v(u.valor2 ?? u.valor)}`;
    const veces = u.repetir === "unaVez" ? "una vez" : "cada vez que pase";
    return `Avisar si ${nombre} ${condicion} (${veces}), ${hasta}`;
  }
  if (t.tipo === "reporte" && t.reporte) {
    return `Mandar ${nombre} cada ${t.reporte.cadaMin} min, ${hasta}`;
  }
  if (t.tipo === "consulta" && t.consulta) {
    const c = t.consulta;
    const cuando = c.cadaMin !== undefined ? `cada ${c.cadaMin} min` : `a las ${listaHoras(c.horas ?? [])}`;
    return `Responder «${c.pregunta}» ${cuando}, ${hasta}`;
  }
  return `Tarea ${t.tipo}, ${hasta}`;
}

/** El último valor de una variable, con la hora del dato. */
export interface IValorVariableTareaAsistente {
  valor: number;
  /** ISO. */
  fechaDato: string;
  unidad?: string;
}

const aNumero = (v: unknown): number | undefined => {
  const n = typeof v === "string" && v.trim() !== "" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : undefined;
};

/** El Mongo tiene timestamps como fecha, string ISO o milisegundos. */
const aIso = (t: unknown): string | undefined => {
  const d = t instanceof Date ? t : typeof t === "number" || typeof t === "string" ? new Date(t) : undefined;
  return d && Number.isFinite(d.getTime()) ? d.toISOString() : undefined;
};

/**
 * Lee el último valor del documento de la fuente (el de gas-cache-api en Redis o el de gas-datos, con la misma forma):
 * - `scada`: `ultimoRegistro.valores.{valorActual, timestamp}`, unidad la del SCADA.
 * - `unidadPresion`: `ultimoRegistro.valores.{presion, unidad, timestamp}`.
 * - `correctora`: `ultimoRegistro.{<campo>, timestamp}`, unidad la del catálogo.
 *
 * `undefined` si no hay valor numérico con hora: la tarea no inventa un dato.
 */
export function ultimoValorTareaAsistente(
  variable: Pick<IVariableTareaAsistente, "fuente" | "campo">,
  doc: unknown,
): IValorVariableTareaAsistente | undefined {
  const d = (doc ?? {}) as { unidad?: unknown; ultimoRegistro?: Record<string, unknown> };
  const ur = d.ultimoRegistro;
  if (!ur || typeof ur !== "object") return undefined;
  const valores = (ur.valores ?? {}) as Record<string, unknown>;
  let valor: number | undefined;
  let ts: unknown;
  let unidad: string | undefined;
  if (variable.fuente === "scada") {
    valor = aNumero(valores.valorActual);
    ts = valores.timestamp ?? ur.timestamp;
    unidad = typeof d.unidad === "string" && d.unidad ? d.unidad : undefined;
  } else if (variable.fuente === "unidadPresion") {
    valor = aNumero(valores.presion);
    ts = valores.timestamp ?? ur.timestamp;
    unidad = typeof valores.unidad === "string" && valores.unidad ? valores.unidad : undefined;
  } else {
    const campo = variable.campo ?? "";
    if (!(campo in CAMPOS_CORRECTORA_TAREA_ASISTENTE)) return undefined;
    valor = aNumero(ur[campo]);
    ts = ur.timestamp;
    unidad = CAMPOS_CORRECTORA_TAREA_ASISTENTE[campo].unidad;
  }
  const fechaDato = aIso(ts);
  if (valor === undefined || !fechaDato) return undefined;
  return { valor, fechaDato, ...(unidad && { unidad }) };
}
