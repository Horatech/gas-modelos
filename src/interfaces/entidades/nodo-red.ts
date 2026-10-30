/**
 * Nodo de red: el extremo de un tramo. ERP, punto de transferencia, planta
 * compresora, gran industria… o un empalme sin nada (`NV`, nodo virtual).
 *
 * Con `idPuntoMedicion` vacío es el **nodo sin medición** de la etapa 4. La
 * asociación a un punto se hace una vez por nodo, no una por extremo de tramo.
 *
 * Sin populate del punto: `punto-medicion.ts` está en el SCC de `IDispositivo`
 * (ver `CLAUDE.md`). Mismo motivo que `idPuntoFrontera` en `zona-balance.ts`.
 */

import { z } from "zod";
import { GeoJSONSchema } from "../auxiliares/coordenadas";
import { OrigenRedSchema } from "./sistema";

export const NodoRedSchema = z.object({
  _id: z.string().optional(),
  /** `asset_id` del proveedor (`ERP_ELCHOURRON`). Único por cliente. */
  codigo: z.string(),
  nombre: z.string().optional(),
  /** `ERP`, `NV` (virtual), `PT`, `GI`, `PC`, `SCR`, `PE`… Lista abierta. */
  tipo: z.string().optional(),
  /**
   * Array y no un id: un nodo de borde está en dos subsistemas
   * (`ERP_ELCHOURRON` en 036 y 037). `{ idsSistemas: id }` filtra igual.
   */
  idsSistemas: z.array(z.string()).optional(),
  /** Point, `[lng, lat]`. Índice 2dsphere en el backend. */
  geojson: GeoJSONSchema.optional(),
  /** Vacío = nodo sin medición. */
  idPuntoMedicion: z.string().nullable().optional(),
  /** El caño del que cuelga la estación (`SSS-NNN` de su `ID_Lic` en el GIS). */
  idTramo: z.string().nullable().optional(),
  /**
   * Presión de suministro y regulada de la estación (`Pres_Sum` / `Pres_Reg` del
   * GIS). **En la unidad del GIS del cliente, sin convertir**: no está confirmada
   * (ver el spec del 30-oct). Vacío si el GIS no la trae.
   */
  presionSuministro: z.number().nullable().optional(),
  presionRegulada: z.number().nullable().optional(),
  origen: OrigenRedSchema,
  fechaCreacion: z.string().optional(),
  idCliente: z.string(),
});
export type INodoRed = z.infer<typeof NodoRedSchema>;

export const CreateNodoRedSchema = NodoRedSchema.omit({ _id: true });
export type ICreateNodoRed = z.infer<typeof CreateNodoRedSchema>;

export const UpdateNodoRedSchema = NodoRedSchema.omit({
  _id: true,
  idCliente: true,
}).partial();
export type IUpdateNodoRed = z.infer<typeof UpdateNodoRedSchema>;
