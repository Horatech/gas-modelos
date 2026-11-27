import { z } from "zod";

/**
 * Informe de campo: lo que el técnico informa de un SML instalado después de verificarlo con una foto (asistente,
 * `proponer_informe_campo`). Va por dispositivo (el SML queda fijo en su medidor) y lo ve y lo resuelve quien tiene
 * alcance sobre el punto. No pasa por alertas ni notificaciones.
 */

export const TIPOS_INFORME_CAMPO = ["montaje", "emisor", "sml_de_otro_medidor", "valor_inicial", "otro"] as const;
export type TipoInformeCampo = (typeof TIPOS_INFORME_CAMPO)[number];

export const ESTADOS_INFORME_CAMPO = ["abierto", "resuelto"] as const;
export type EstadoInformeCampo = (typeof ESTADOS_INFORME_CAMPO)[number];

export const RESULTADOS_VERIFICACION = ["coincide", "visor_adelante", "visor_atras", "sin_valor_inicial", "sin_lectura"] as const;

const idMongo = z.string().regex(/^[0-9a-f]{24}$/);

/** Lo que el asistente propone informar. La verificación la calcula el MCP, no el modelo. */
export const PedidoInformeCampoSchema = z.object({
  tipo: z.enum(TIPOS_INFORME_CAMPO),
  lecturas: z.object({
    snSml: z.string().max(40).optional(),
    serieMedidor: z.string().max(30).optional(),
    lecturaVisor: z.number().min(0).optional(),
  }),
  verificacion: z
    .object({
      resultado: z.enum(RESULTADOS_VERIFICACION),
      diferencia: z.number().nullable().optional(),
      margen: z.number().nullable().optional(),
      ultimaLectura: z.number().nullable().optional(),
      fecha: z.iso.datetime(),
    })
    .optional(),
  comentario: z.string().max(1000).optional(),
  idDispositivo: idMongo.optional(),
  idMedidorResidencial: idMongo.optional(),
  idPuntoMedicion: idMongo.optional(),
});
export type IPedidoInformeCampo = z.infer<typeof PedidoInformeCampoSchema>;

/** `POST /informesCampo`: el pedido de la tarjeta y la foto de la charla (la misma que vio el asistente). */
export const CreateInformeCampoSchema = z.object({
  pedido: PedidoInformeCampoSchema,
  imagen: z.object({ tipo: z.enum(["image/jpeg", "image/png"]), datos: z.string().min(1) }).optional(),
});
export type ICreateInformeCampo = z.infer<typeof CreateInformeCampoSchema>;

export interface IFirmaInformeCampo {
  idUsuario?: string;
  nombre?: string;
  fecha?: string;
}

export interface IInformeCampo {
  _id?: string;
  fechaCreacion?: string;
  idCliente?: string;
  // El SML (fijo en su medidor) y lo que tenía asignado al informar.
  idDispositivo?: string;
  deveui?: string;
  deviceName?: string;
  idMedidorResidencial?: string;
  serieMedidor?: string;
  idPuntoMedicion?: string;
  nombrePunto?: string;
  // Snapshot de alcance (del punto; sin punto, del dispositivo).
  idUnidadNegocio?: string;
  idCentroOperativo?: string;
  idLocalidad?: string;
  idsAgrupaciones?: string[];
  division?: string;
  tipo?: TipoInformeCampo;
  lecturas?: IPedidoInformeCampo["lecturas"];
  verificacion?: IPedidoInformeCampo["verificacion"];
  comentario?: string;
  /** Ruta de la foto en el bucket privado (se sirve por la API con alcance). */
  foto?: string;
  estado?: EstadoInformeCampo;
  creado?: IFirmaInformeCampo;
  resuelto?: IFirmaInformeCampo;
  resolucion?: string;
}

const TIPO_EN_PALABRAS: Record<TipoInformeCampo, string> = {
  montaje: "montaje",
  emisor: "emisor del medidor",
  sml_de_otro_medidor: "SML de otro medidor",
  valor_inicial: "valor inicial",
  otro: "otro",
};

/** El texto de la tarjeta: lo que se confirma es lo que se guarda. */
export function describirInformeCampo(pedido: IPedidoInformeCampo, nombres: { punto?: string }): string {
  const { snSml, serieMedidor } = pedido.lecturas;
  return [
    `Informe de campo: ${TIPO_EN_PALABRAS[pedido.tipo]}`,
    ...(snSml ? [`SML ${snSml}`] : []),
    ...(serieMedidor ? [`medidor ${serieMedidor}`] : []),
    ...(nombres.punto ? [nombres.punto] : []),
  ].join(" · ");
}
