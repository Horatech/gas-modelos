import { z } from "zod";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { LocalidadSchema } from "./localidad";
import { EstadoCorrectoraSchema } from "./estado";
import type { IEstado } from "./estado";
import { ClienteSchema } from "../tenant/cliente.model";
import type { IAlerta } from "./alerta";
import type { IConfigDispositivoScada } from "./config-dispositivo";
import type { IReporte } from "./reporte";

export const TipoScadaSchema = z.enum([
  "Presión en bar",
  "Presión en mbar",
  "Temperatura en C",
  "Porcentaje",
  "Booleano",
  "mg sobre m3",
  "Voltaje en V",
  "Corriente en A",
  "Caudal en m3/h",
  "Potencial en mV",
]);
export type TipoScada = z.infer<typeof TipoScadaSchema>;

export const DivisionScadaSchema = z.enum(["Unifilar", "Medición"]);
export type DivisionScada = z.infer<typeof DivisionScadaSchema>;

// Populates intra-SCC (IReporte, IAlerta, IConfigDispositivoScada — este
// último vive en config-dispositivo.ts, parte del mismo SCC) como z.custom:
// ver CLAUDE.md, "De solo tipos a schemas Zod".
export const ScadaSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  nombre: z.string().optional(),
  tag: z.string().optional(),
  tipo: TipoScadaSchema.optional(),
  division: DivisionScadaSchema.optional(),
  unidad: z.string().optional(),
  booleano: z.boolean().optional(),
  booleanoValorAlarma: z.boolean().optional(),
  ultimoRegistro: z.custom<IReporte>().optional(),
  ultimaAlerta: z.custom<IAlerta>().optional(),
  habilitado: z.boolean().optional(),
  /**
   * La variable se evalúa contra límites (HH/H/L/LL). Ausente = `true` (las variables anteriores a este campo se
   * comportan como siempre); el alta desde el ABM la crea en `false`. `false`: no hay fuera de rango ni se adoptan
   * límites de iFix. No afecta a las booleanas (alarman por `booleanoValorAlarma`).
   */
  conLimites: z.boolean().optional(),
  /**
   * Los límites de la variable se escriben en iFix (y la plataforma reconcilia si iFix cambia). Ausente = `true`
   * (como siempre); el alta desde el ABM la crea en `false`. `false`: los límites quedan sólo en INSIDEht. Como
   * mucho una variable por tag con réplica (iFix tiene un solo juego de límites por tag).
   */
  replicarEnIfix: z.boolean().optional(),
  estadoActual: EstadoCorrectoraSchema.optional(),
  config: z.custom<IConfigDispositivoScada>().optional(),
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
});

/**
 * Interface hand-written (mismo shape que el schema): parte del SCC de
 * IDispositivo, no usa z.infer.
 */
export interface IScada {
  _id?: string;
  fechaCreacion?: string;
  nombre?: string;
  tag?: string;
  tipo?: TipoScada;
  division?: DivisionScada;
  unidad?: string;
  booleano?: boolean;
  booleanoValorAlarma?: boolean;
  ultimoRegistro?: IReporte;
  ultimaAlerta?: IAlerta;
  habilitado?: boolean;
  /** Ver `ScadaSchema.conLimites`. Ausente = `true`. */
  conLimites?: boolean;
  /** Ver `ScadaSchema.replicarEnIfix`. Ausente = `true`. */
  replicarEnIfix?: boolean;
  estadoActual?: IEstado;
  config?: IConfigDispositivoScada;
  idCliente?: string;
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  cliente?: import("../tenant/cliente.model").ICliente;
  unidadNegocio?: import("../gas/unidadNegocio/schema").IUnidadNegocio;
  centroOperativo?: import("../gas/centroOperativo/schema").ICentroOperativo;
  localidad?: import("./localidad").ILocalidad;
}

export const CreateScadaSchema = ScadaSchema.omit({
  _id: true,
  centroOperativo: true,
  localidad: true,
  cliente: true,
});
export const UpdateScadaSchema = CreateScadaSchema;
type Omitir =
  | "_id"
  | "unidadDeNegocio"
  | "centroOperativo"
  | "localidad"
  | "cliente";

export interface ICreateScada extends Omit<Partial<IScada>, Omitir> {}

export interface IUpdateScada extends Omit<Partial<IScada>, Omitir> {}

/** `conLimites` efectivo: ausente = `true` (comportamiento anterior al campo). */
export const usaLimites = (s: Pick<IScada, "conLimites">): boolean => s.conLimites !== false;

/** `replicarEnIfix` efectivo: ausente = `true`. Sin límites no hay nada que replicar. */
export const replicaEnIfix = (s: Pick<IScada, "conLimites" | "replicarEnIfix">): boolean =>
  usaLimites(s) && s.replicarEnIfix !== false;
