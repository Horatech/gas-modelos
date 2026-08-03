import { z } from "zod";
import { ClienteSchema } from "../tenant/cliente.model";
import { CentroOperativoSchema } from "../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../gas/unidadNegocio/schema";
import { AgrupacionSchema } from "../gas/agrupacion/schema";
import { PuntoMedicionSchema } from "./punto-medicion";
import { LocalidadSchema } from "./localidad";
import { GrupoSchema } from "./grupo";
import { CuencaSchema } from "./cuenca";
import { MedidorResidencialAguaSchema } from "./medidor-residencial-agua";

/**
 * Registro horario de un medidor de agua residencial (serie temporal).
 *
 * Motivación (device UWM-NB, ver gas/PLAN-UWM-NB-INTEGRACION.md §3.2): el frame diario
 * trae un buffer de hasta 72 volúmenes horarios y llega 1 vez/día, pero el buffer cubre
 * las últimas 72 h → cada hora reaparece en ~3 frames consecutivos. Persistir la serie
 * en una colección aparte con UPSERT idempotente por (deveui, timestamp) deduplica el
 * solapamiento y hace la ingesta re-inyectable desde el DLQ sin duplicar registros.
 * Espejo del patrón de IRegistroMedidorElectrico (NME).
 *
 * El volumen es un odómetro TOTAL (m³); `consumoParcial` es el delta consumido en esa
 * hora respecto del registro previo (lo calcula el backend, patrón SML/NME).
 *
 * NOTA (zona horaria): `timestamp` se ancla con el supuesto de RTC en hora local UY
 * (UTC-3), no UTC. Ver R1 del plan.
 *
 * Colección genérica de agua (no atada a UWM-NB): cualquier device de agua residencial
 * con buffer horario puede escribir acá; el vínculo es por `deveui` + `idMedidorResidencialAgua`.
 */
export const RegistroHorarioAguaSchema = z.object({
  _id: z.string().optional(),
  timestamp: z.string().optional(), // ISO, hora en punto (cierre de la hora)
  //
  volumenM3: z.number().optional(), // odómetro TOTAL de esa hora (m³)
  consumoParcial: z.number().optional(), // delta respecto del registro previo (m³)
  //
  deveui: z.string().optional(),
  deviceName: z.string().optional(),
  meterId: z.string().optional(),
  //
  idMedidorResidencialAgua: z.string().optional(),
  idPuntoMedicion: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
  idCuenca: z.string().optional(),
  idsGrupos: z.array(z.string()).optional(),
  idsAgrupaciones: z.array(z.string()).optional(),
  //
  fechaCreacion: z.string().optional(),

  // Virtuals
  cliente: ClienteSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
  cuenca: CuencaSchema.optional(),
  puntoMedicion: PuntoMedicionSchema.optional(),
  medidorResidencialAgua: MedidorResidencialAguaSchema.optional(),
  grupos: z.array(GrupoSchema).optional(),
  agrupaciones: z.array(AgrupacionSchema).optional(),
});
export type IRegistroHorarioAgua = z.infer<typeof RegistroHorarioAguaSchema>;

////// CREATE
export const CreateRegistroHorarioAguaSchema = RegistroHorarioAguaSchema.omit({
  _id: true,
  cliente: true,
  unidadNegocio: true,
  centroOperativo: true,
  localidad: true,
  cuenca: true,
  puntoMedicion: true,
  medidorResidencialAgua: true,
  grupos: true,
  agrupaciones: true,
});
export type ICreateRegistroHorarioAgua = z.infer<
  typeof CreateRegistroHorarioAguaSchema
>;

////// UPDATE
export const UpdateRegistroHorarioAguaSchema = RegistroHorarioAguaSchema.omit({
  _id: true,
  cliente: true,
  unidadNegocio: true,
  centroOperativo: true,
  localidad: true,
  cuenca: true,
  puntoMedicion: true,
  medidorResidencialAgua: true,
  grupos: true,
  agrupaciones: true,
});
export type IUpdateRegistroHorarioAgua = z.infer<
  typeof UpdateRegistroHorarioAguaSchema
>;
