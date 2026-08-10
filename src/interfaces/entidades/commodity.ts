/**
 * Servicio / vertical del dato. Fuente única de verdad.
 *
 * Vive en su propio archivo porque lo necesitan tanto el catálogo de canales
 * (`canal-descriptor.ts`, que es data pura sin Zod) como las entidades que **sí**
 * se persisten y validan (`clasificacion-punto.ts`, `zona-balance.ts`). Duplicar
 * la lista en los dos lados era la forma garantizada de que se desincronicen.
 *
 * INVARIANTES respecto de `Dominio` (ver `canal-descriptor.ts`):
 * - `dominio: 'dispositivo'` ⇒ `commodity: 'na'` (batería y señal no son de ninguna vertical)
 * - `dominio: 'ambiente'`    ⇒ `commodity: 'na'`
 * - `dominio: 'proceso'`     ⇒ `commodity ∈ {gas, agua, electricidad, otro}`
 *
 * `otro` cubre proceso sin vertical conocida: los contadores de pulsos externos
 * del NUC-2 (horas de bomba, eventos), que hoy no tienen unidad ni servicio en el
 * modelo.
 */

import { z } from "zod";

export const CommoditySchema = z.enum([
  "gas",
  "agua",
  "electricidad",
  "otro",
  "na",
]);
export type Commodity = z.infer<typeof CommoditySchema>;
