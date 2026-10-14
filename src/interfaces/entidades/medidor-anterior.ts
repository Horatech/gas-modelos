import { z } from "zod";

/**
 * Medidor físico retirado al instalar un equipo con telemetría, cuando ese medidor
 * **nunca estuvo en la plataforma** (mecánico, sin dispositivo).
 *
 * El caso que lo origina (Santa Barbara, oct-2026): se saca un medidor mecánico y
 * se instala un EUW300 que arranca de cero. Lo que consumió el medidor viejo entre
 * la última lectura facturada y el retiro no lo midió nadie de la plataforma, así
 * que sin este dato ese consumo se pierde de la facturación del período.
 *
 * **Se cargan las dos lecturas físicas y la plataforma calcula la diferencia**, en
 * vez de cargar el parcial ya calculado: las dos lecturas son del mismo medidor y
 * las tiene quien opera (el instalador lee el dial al retirarlo; la oficina comercial
 * tiene la última facturada). Mezclar una lectura del medidor viejo con una del
 * equipo nuevo —que es como se armaba a mano— dio parciales negativos.
 *
 * Vive en el evento de asignación del medidor nuevo al punto (`IAsignacion`), no en
 * el punto ni en el medidor: es un hecho del recambio y la colección es un log
 * append-only. Completar o corregir los datos deja un evento
 * `cambio-medidor-anterior` que apunta al original (`idAsignacionCorregida`); al
 * resolver gana el más reciente.
 *
 * **Original = evento con `medidorAnterior` y SIN `idAsignacionCorregida`.** Es el
 * `asignar` del vínculo, o un `cambio-medidor-anterior` "declarado" sobre un punto
 * que ya tenía el medidor vinculado (`DeclararMedidorAnterior`).
 *
 * Archivo hoja (sólo zod): lo importan `asignacion.ts` y `vinculacion.ts`.
 */
export const MedidorAnteriorInputSchema = z.object({
  /** Número de serie del medidor retirado. */
  numeroSerie: z.string().optional(),
  /** Lectura del dial del medidor retirado al sacarlo, en m³. */
  lecturaRetiro: z.number().optional(),
  /**
   * Cuándo se retiró. Ausente = la fecha de instalación del equipo nuevo
   * (`fechaVigencia` del evento), que es el caso normal: se saca uno y se pone el
   * otro en la misma visita. Define a qué período de facturación se suma el parcial.
   */
  fechaRetiro: z.string().optional(),
  /** Última lectura facturada del medidor retirado, en m³. */
  lecturaFacturada: z.number().optional(),
  /** Cuándo se tomó la última lectura facturada. */
  fechaLecturaFacturada: z.string().optional(),
});
export type IMedidorAnteriorInput = z.infer<typeof MedidorAnteriorInputSchema>;

export const MedidorAnteriorSchema = MedidorAnteriorInputSchema.extend({
  /**
   * `lecturaRetiro - lecturaFacturada`, en m³. Lo calcula el backend; ausente
   * mientras falte alguna de las dos lecturas.
   */
  consumoParcial: z.number().optional(),
  /**
   * Falta alguna de las dos lecturas. Distinto de `consumoParcial: 0`, que afirma
   * que el medidor viejo no consumió: un pendiente no se puede facturar como cero.
   */
  pendiente: z.boolean().optional(),
});
export type IMedidorAnterior = z.infer<typeof MedidorAnteriorSchema>;
