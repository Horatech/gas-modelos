import { z } from "zod";
import { CentroOperativoSchema } from "../../gas/centroOperativo/schema";
import { UnidadNegocioSchema } from "../../gas/unidadNegocio/schema";
import { DispositivoSchema } from "../dispositivo";
import { LocalidadSchema } from "../localidad";
import { PuntoMedicionSchema } from "../punto-medicion";

// Schema para el volumen acumulado del mes
export const VolumenAcumuladoMesSchema = z.object({
  volumenBaseAcumulado: z.number(),
  volumenCorregidoAcumulado: z.number(),
});
export type IVolumenAcumuladoMes = z.infer<typeof VolumenAcumuladoMesSchema>;

// Schema principal del estado general de correctoras
export const EstadoGeneralCorrectorasSchema = z.object({
  _id: z.string().optional(),

  // Metadata
  fechaCreacion: z.string(),
  mes: z.number(),
  anio: z.number(),

  // Filtros aplicados (referencia a entidades)
  idCliente: z.string().optional(),
  idDispositivo: z.string().optional(),
  idUnidadNegocio: z.string().optional(),
  idCentroOperativo: z.string().optional(),
  idLocalidad: z.string().optional(),
  idPuntoMedicion: z.string().optional(),

  // Datos calculados
  fechaDesdeMes: z.string(),
  fechaHastaMes: z.string(),
  volumenAcumuladoMes: VolumenAcumuladoMesSchema,
  promedioPresionRedMes: z.number(),
  promedioTemperaturaRedMes: z.number(),
  cantidadCorrectoras: z.number(),

  // Hash del query para identificar búsquedas duplicadas
  queryHash: z.string().optional(),
  // Fecha de última actualización del registro
  fechaActualizacion: z.string().optional(),
  estado: z.enum(["Recalcular", "Activo", "Error"]).optional(),
  fechaRecalculo: z.string().optional(),

  // Populate
  puntoMedicion: PuntoMedicionSchema.optional(),
  unidadNegocio: UnidadNegocioSchema.optional(),
  centroOperativo: CentroOperativoSchema.optional(),
  localidad: LocalidadSchema.optional(),
  dispositivo: DispositivoSchema.optional(),
});
export type IEstadoGeneralCorrectoras = z.infer<
  typeof EstadoGeneralCorrectorasSchema
>;

// Nota: el `Omit` original incluía la clave "dispositivos" (typo, el campo
// real es "dispositivo") que no existe en IEstadoGeneralCorrectoras, por lo
// que nunca tuvo efecto — "dispositivo" nunca se omitió realmente. También
// envolvía con `Partial<...>` antes del Omit, por eso acá se encadena
// `.partial()`: todos los campos quedan opcionales en Create/Update.
export const CreateEstadoGeneralCorrectorasSchema =
  EstadoGeneralCorrectorasSchema.omit({
    _id: true,
    fechaCreacion: true,
    puntoMedicion: true,
    unidadNegocio: true,
    centroOperativo: true,
    localidad: true,
  }).partial();
export type ICreateEstadoGeneralCorrectoras = z.infer<
  typeof CreateEstadoGeneralCorrectorasSchema
>;

export const UpdateEstadoGeneralCorrectorasSchema =
  EstadoGeneralCorrectorasSchema.omit({
    _id: true,
    fechaCreacion: true,
    puntoMedicion: true,
    unidadNegocio: true,
    centroOperativo: true,
    localidad: true,
  }).partial();
export type IUpdateEstadoGeneralCorrectoras = z.infer<
  typeof UpdateEstadoGeneralCorrectorasSchema
>;
