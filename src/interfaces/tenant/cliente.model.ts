import { z } from "zod";
import { TipoDispositivoSchema } from "../auxiliares/tipoDispositivo";
import { ModeloCorrectoraSchema } from "../entidades/mensajes-nuc/mensajes-nuc";
// Import directo al archivo HOJA `entidades/estado.ts`, no a `entidades/correctora`
// ni al barrel: correctora → localidad → ClienteSchema cerraría un ciclo runtime.
import { EstadoCorrectoraSchema } from "../entidades/estado";
import { ImagenesClienteSchema } from "./cliente.dto";
import { IntegracionSchema } from "./integraciones";
// OJO: `DivisionSchema` NO se puede importar como VALOR acá. `usuario/permiso`
// importa `LocalidadSchema` y `localidad.ts` importa `ClienteSchema`, así que un
// import de valor cierra el ciclo runtime cliente.model → permiso → localidad →
// cliente.model y el barrel compilado explota con `ClienteSchema` undefined
// (verificado). Por eso los records por división de este archivo
// (`VistasPersonalizadasPorDivisionSchema`, `CiclosFacturacionPorDivisionSchema`)
// se declaran como `z.object` literal con las divisiones soportadas en vez de
// `z.partialRecord(DivisionSchema, ...)`.
import type { Division } from "./usuario/permiso";

export const TemplatesWhatsappSchema = z.enum([
  "Alerta de presión",
  "Punto de medición en mantenimiento",
  "Sensor de presión desconectado",
  "Error de comunicación de alarma",
  "Scada valor fuera de límite",
  "Scada valor fuera de límite genérico",
  "Scada valor reestablecido",
  "Scada booleano alarma",
  "Scada booleano reestablecido",
  "Scada error de comunicación con servidor",
  "Scada cambio de límites por fuera",
  "Equipos fuera de línea",
  "Batería baja",
]);
export type TemplatesWhatsapp = z.infer<typeof TemplatesWhatsappSchema>;

export const TemplatesMailSchema = z.union([
  TemplatesWhatsappSchema,
  z.enum(["Nuevo usuario", "Reset de contraseña", "Cambio de contraseña"]),
]);
export type TemplatesMail = z.infer<typeof TemplatesMailSchema>;

export const ApnSchema = z.object({
  apn: z.string().optional(),
  usuario: z.string().optional(),
  password: z.string().optional(),
});
export type IApn = z.infer<typeof ApnSchema>;

export const ConfigTwilioSchema = z.object({
  //Mensajes y llamadas
  accSid: z.string().optional(),
  authToken: z.string().optional(),
  msgServiceSid: z.string().optional(),
  statusCallback: z.string().optional(),
  phoneSms: z.string().optional(),
  phoneWhatsapp: z.string().optional(),
  phoneLlamada: z.string().optional(),
  templatesWhatsapp: z.partialRecord(TemplatesWhatsappSchema, z.string()).optional(),
  //Email
  senderEmail: z.string().optional(),
  senderName: z.string().optional(),
  senderAddress: z.string().optional(),
  senderCity: z.string().optional(),
  senderState: z.string().optional(),
  senderZip: z.number().optional(),
  sendGridApiKey: z.string().optional(),
  templatesMail: z.partialRecord(TemplatesMailSchema, z.string()).optional(),
});
export type IConfigTwilio = z.infer<typeof ConfigTwilioSchema>;

export const ConfigSincHorariaSchema = z.object({
  activo: z.boolean().optional(),
  desfaseMinimo: z.number().optional(),
  desfaseMaximo: z.number().optional(),
});
export type IConfigSincHoraria = z.infer<typeof ConfigSincHorariaSchema>;

export const ColumnaVistaPersonalizadaCorrectorasSchema = z.enum([
  "temperatura",
  "presion",
  "volumenBaseTotalizado",
  "volumenCorregidoTotalizado",
  "volumenBaseHorario",
  "volumenCorregidoHorario",
  "caudalPico",
  "caudalPromedio",
  "fpv",
]);
export type ColumnaVistaPersonalizadaCorrectoras = z.infer<typeof ColumnaVistaPersonalizadaCorrectorasSchema>;

export const ColumnaVistaPersonalizadaResidencialSchema = z.enum([
  "consumoInstantaneo", // Consumo Parcial
  "consumo", // Consumo Acumulado Dispositivo
  "consumoCorregido", // Consumo Acumulado Medidor
  "bateria", // Batería
]);
export type ColumnaVistaPersonalizadaResidencial = z.infer<typeof ColumnaVistaPersonalizadaResidencialSchema>;

export const ColumnaVistaPersonalizadaSchema = z.union([
  ColumnaVistaPersonalizadaCorrectorasSchema,
  ColumnaVistaPersonalizadaResidencialSchema,
]);
export type ColumnaVistaPersonalizada = z.infer<typeof ColumnaVistaPersonalizadaSchema>;

export const StatVistaPersonalizadaSchema = z.enum(["min", "max", "avg"]);
export type StatVistaPersonalizada = z.infer<typeof StatVistaPersonalizadaSchema>;

export const VistaPersonalizadaColumnaSchema = z.object({
  key: ColumnaVistaPersonalizadaSchema,
  label: z.string().optional(),
  stats: z.array(StatVistaPersonalizadaSchema).optional(),
  mostrarConsumo: z.boolean().optional(),
});
export type IVistaPersonalizadaColumna = z.infer<typeof VistaPersonalizadaColumnaSchema>;

/**
 * El orden de los elementos en el array `columnas` define el orden de
 * visualización y exportación de las columnas.
 */
export const VistaPersonalizadaFechaSchema = z.object({
  separar: z.boolean().optional(),
  formato: z.string().optional(),
  formatoFecha: z.string().optional(),
  formatoHora: z.string().optional(),
  label: z.string().optional(),
  labelFecha: z.string().optional(),
  labelHora: z.string().optional(),
});
export type IVistaPersonalizadaFecha = z.infer<typeof VistaPersonalizadaFechaSchema>;

export const VistaPersonalizadaCorrectorasSchema = z.object({
  activo: z.boolean(),
  columnas: z.array(VistaPersonalizadaColumnaSchema),
  agrupacion: z.enum(["hora", "dia"]),
  tipoDia: z.enum(["gas", "calendario"]).optional(),
  fecha: VistaPersonalizadaFechaSchema.optional(),
});
export type IVistaPersonalizadaCorrectoras = z.infer<typeof VistaPersonalizadaCorrectorasSchema>;

export const VistasPersonalizadasPorDivisionSchema = z.object({
  Correctoras: VistaPersonalizadaCorrectorasSchema.optional(),
  Residencial: VistaPersonalizadaCorrectorasSchema.optional(),
});
export type IVistasPersonalizadasPorDivision = z.infer<typeof VistasPersonalizadasPorDivisionSchema>;

export const ModuloCoberturaLorawanSchema = z.object({
  activo: z.boolean().optional(),
  verMetricas: z.boolean().optional(),
});
export type IModuloCoberturaLorawan = z.infer<typeof ModuloCoberturaLorawanSchema>;

export const ModuloClimaSchema = z.object({
  activo: z.boolean().optional(),
});
export type IModuloClima = z.infer<typeof ModuloClimaSchema>;

/**
 * Editor de clasificación de puntos de medición (F5 del modelo canónico).
 *
 * Ausente ⇒ apagado. Es una pantalla de administración del padrón que sólo tiene
 * sentido para el cliente que está haciendo ese trabajo; al resto le muestra una
 * sección vacía que no sabe para qué es.
 */
export const ModuloClasificacionSchema = z.object({
  activo: z.boolean().optional(),
});
export type IModuloClasificacion = z.infer<typeof ModuloClasificacionSchema>;

/**
 * Pantalla de carga de la topología de red (etapa 17 del Tablero de Operaciones).
 *
 * Ausente ⇒ apagado, igual que el módulo de clasificación. Flag propio y no el de
 * clasificación porque son dos trabajos distintos sobre el mismo padrón: un cliente
 * puede estar clasificando sus puntos sin cargar la topología, o al revés.
 *
 * Las conexiones son carga **manual**: no están latentes en los datos y no hay
 * clasificador posible, así que esta pantalla es la única fuente del grafo.
 */
export const ModuloTopologiaSchema = z.object({
  activo: z.boolean().optional(),
});
export type IModuloTopologia = z.infer<typeof ModuloTopologiaSchema>;

export const ParametrosObisSchema = z.object({
  reporteMask: z.number().optional(),
});
export type IParametrosObis = z.infer<typeof ParametrosObisSchema>;

/**
 * Catálogo FIJO de íconos de estado de punto de medición. Cada slug corresponde a
 * un asset existente en los frontends (`assets/estados/<slug>.png`) y trae su color
 * horneado: elegir el ícono elige también el color.
 *
 * El catálogo con asset + hex + variantes de card es un VALOR que sólo consumen los
 * frontends Angular, así que vive duplicado en gas-web-cliente y gas-web-admin; acá
 * sólo se declaran los slugs válidos.
 *
 * Ojo: `sin-reportar`, `resolver` y `sin-asignar` comparten exactamente el mismo
 * glifo (signo de admiración blanco) y se distinguen SÓLO por el color del círculo.
 */
export const IconoEstadoSchema = z.enum([
  "ok", // verde brillante  #02DA3D  check
  "incompleto", // verde oscuro     #168526  check + documento
  "sin-reportar", // rojo            #FF0000  !
  "resolver", // naranja         #F7931D  !
  "sin-asignar", // violeta         #7A1996  !
  "alerta", // amarillo        #FDED22  triángulo con !
  "mantenimiento", // celeste         #00B2D0  llave + destornillador
  "dado-de-baja", // casi negro      #2C2C2C  círculo tachado
  "sin-informacion", // rojo oscuro     #D0091D  X negra
]);
export type IconoEstado = z.infer<typeof IconoEstadoSchema>;

export type DivisionConVistaPersonalizada = Extract<
  Division,
  "Correctoras" | "Residencial"
>;

/**
 * Ciclo de facturación de una división: el día del mes en que cierra el período.
 *
 * El período rotulado por un mes va de `diaCierre` del mes ANTERIOR (00:00,
 * inclusive) a `diaCierre` de ese mes (00:00, exclusive) — media abierta, así los
 * períodos no se solapan ni dejan huecos. Ej. `diaCierre: 5` ⇒ "Agosto" = del 5 de
 * julio 00:00 al 5 de agosto 00:00.
 *
 * **El corte es a las 00:00 locales, NO a las 7:00.** El 7:00-6:59 del resto de las
 * exportaciones es el día gas de las correctoras; los medidores residenciales de agua
 * reportan una vez por día y con corte a las 7:00 el reporte de madrugada del día de
 * cierre caería en el período anterior.
 *
 * Tope 28 a propósito: un cierre 29/30/31 no existe en todos los meses y el período
 * quedaría sin definir en febrero.
 *
 * Ausente ⇒ la división no tiene ciclo de facturación y todo se comporta como antes
 * (mes calendario en las exportaciones, ventana de N días en las vistas de detalle).
 */
export const CicloFacturacionSchema = z.object({
  diaCierre: z.number().int().min(1).max(28).optional(),
});
export type ICicloFacturacion = z.infer<typeof CicloFacturacionSchema>;

/**
 * Ciclo de facturación por división. Hoy sólo lo consume "Residencial Agua".
 *
 * `z.object` literal y no `z.partialRecord(DivisionSchema, ...)`: ver el comentario
 * del import de `usuario/permiso` arriba — tomar `DivisionSchema` como valor cierra un
 * ciclo runtime. Sumar una división es agregar una clave acá.
 */
export const CiclosFacturacionPorDivisionSchema = z.object({
  "Residencial Agua": CicloFacturacionSchema.optional(),
});
export type ICiclosFacturacionPorDivision = z.infer<typeof CiclosFacturacionPorDivisionSchema>;

export type DivisionConCicloFacturacion = Extract<Division, "Residencial Agua">;

export const ConfigClienteSchema = z.object({
  apns: z.array(ApnSchema).optional(),
  usaLlm: z.boolean().optional(),
  tokensMensualesDisponibles: z.number().optional(),
  maximoUsuariosUsanLlm: z.number().optional(),
  twilio: ConfigTwilioSchema.optional(),
  sincHoraria: z.partialRecord(ModeloCorrectoraSchema, ConfigSincHorariaSchema).optional(),
  nucV3: z.boolean().optional(),
  sobreEscribirRegistrosNuc: z.boolean().optional(),
  valorAlarmaBateriaSml: z.number().optional(),
  /**
   * Metros cúbicos mínimos que tiene que crecer el acumulado de flujo inverso de un
   * medidor residencial de agua, respecto de su lectura anterior, para abrir una
   * alerta de "Flujo inverso".
   *
   * El campo del equipo es un ODÓMETRO (cuenta desde que se puso en servicio y nunca
   * decrece): un valor > 0 sólo dice que alguna vez hubo contraflujo — le pasa al 67%
   * del parque. Lo que indica contraflujo activo es el INCREMENTO entre dos lecturas,
   * y eso es lo que se compara contra este umbral.
   *
   * Sin definir, se usa el default del productor (gas-api-ml107a). Campo plano y no
   * un objeto anidado a propósito: el merge de `config` en gas-admin es SHALLOW.
   */
  umbralFlujoInversoAgua: z.number().optional(),
  /**
   * Cantidad de lecturas CONSECUTIVAS con la bandera de fuga encendida que hacen
   * falta para abrir una alerta de "Fuga" en un medidor residencial de agua.
   *
   * Existe porque la bandera del equipo alterna: de los 445 equipos que la
   * encendieron en un relevamiento de 3 días, 247 la prendieron y apagaron. Con 1 el
   * comportamiento es el del bit crudo (abre y cierra con cada transmisión).
   *
   * Sin definir, se usa el default del productor (gas-api-ml107a).
   */
  lecturasParaAlertaFugaAgua: z.number().optional(),
  puedeCrearDispositivos: z.boolean().optional(),
  vistasPersonalizadas: VistasPersonalizadasPorDivisionSchema.optional(),
  moduloCoberturaLorawan: ModuloCoberturaLorawanSchema.optional(),
  moduloClima: ModuloClimaSchema.optional(),
  moduloClasificacion: ModuloClasificacionSchema.optional(),
  moduloTopologia: ModuloTopologiaSchema.optional(),
  parametrosObis: ParametrosObisSchema.optional(),
  ciclosFacturacion: CiclosFacturacionPorDivisionSchema.optional(),
  permitirEditarUnNcoAsignado: z.boolean().optional(),
  crearMedidorResidencialAutomatico: z.boolean().optional(),
  gestionCuentas: z.boolean().optional(),
  /**
   * Ícono (y por lo tanto color) con el que el frontend muestra cada estado de punto
   * de medición: listados, detalle, popups del mapa, pines, clusters y cards de
   * Estado General.
   *
   * Opcional y parcial: los estados no definidos usan la asignación por defecto del
   * frontend (la actual, que es también el fallback). "Sin Comunicación", si no está
   * definido, hereda lo que resuelva "Sin Reportar" (es su alias visual en todo el
   * front).
   *
   * OJO: el merge de `config` en gas-admin (`clientes.service.ts updateCliente`) es
   * SHALLOW, así que el admin tiene que enviar el objeto `iconosEstado` COMPLETO en
   * cada PUT o pisa la config previa.
   */
  iconosEstado: z
    .partialRecord(EstadoCorrectoraSchema, IconoEstadoSchema)
    .optional(),
});
export type IConfigCliente = z.infer<typeof ConfigClienteSchema>;

// Populate intra-SCC (IImagenesCliente vive en cliente.dto.ts, que a su vez
// importa IConfigCliente de acá solo como tipo — ver cliente.dto.ts): esto no
// es un ciclo runtime porque cliente.dto.ts usa `import type` para lo que
// toma de este archivo. Ver CLAUDE.md, "De solo tipos a schemas Zod".
export const ClienteSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  activo: z.boolean().optional(),
  nombre: z.string().optional(),
  admin: z.boolean().optional(),
  imagenes: ImagenesClienteSchema.optional(),
  tiposDispositivo: z.array(TipoDispositivoSchema).optional(),
  integraciones: z.array(IntegracionSchema).optional(),
  config: ConfigClienteSchema.optional(),
});
export type ICliente = z.infer<typeof ClienteSchema>;

// Create/Update viven acá (no en cliente.dto.ts) para no necesitar el valor
// real de ClienteSchema desde cliente.dto.ts, que rompería el ciclo que se
// evita justo arriba. cliente.dto.ts re-exporta estos tipos (type-only) para
// mantener los paths de import de siempre.
//
// Definido explícito (no ClienteSchema.omit().required()): .required()
// encadenado no sobrevive portablemente al .d.ts consumido desde otro
// paquete (verificado con gas-datos vía CreateAuditoriaSchema — ver el
// comentario en gas/auditoria/create.ts).
export const CreateClienteSchema = z.object({
  activo: z.boolean().optional(),
  nombre: z.string(),
  admin: z.boolean().optional(),
  imagenes: ImagenesClienteSchema.optional(),
  tiposDispositivo: z.array(TipoDispositivoSchema).optional(),
  integraciones: z.array(IntegracionSchema).optional(),
  config: ConfigClienteSchema.optional(),
});
export type ICreateCliente = z.infer<typeof CreateClienteSchema>;

export const UpdateClienteSchema = ClienteSchema.omit({
  _id: true,
  fechaCreacion: true,
});
export type IUpdateCliente = z.infer<typeof UpdateClienteSchema>;
