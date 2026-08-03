import { z } from "zod";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { LocalidadSchema } from "./localidad";
import { EstadoCorrectoraSchema, IEstado } from "./correctora";
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
