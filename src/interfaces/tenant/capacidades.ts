import { z } from "zod";
import type { TipoDispositivo } from "../auxiliares/tipoDispositivo";
import { TipoDispositivoSchema } from "../auxiliares/tipoDispositivo";
import type { Commodity } from "../entidades/commodity";
import type { ICliente, IConfigCliente } from "./cliente.model";
import type { Modulo } from "./modulo";
import { ModuloSchema } from "./modulo";
import type { Division, Rol } from "./usuario/permiso";
import type { IUsuario } from "./usuario/schema";

/**
 * Qué puede un usuario en su cliente, en un solo lugar.
 *
 * Hasta acá cada consumidor lo recalculaba con su propia tabla: el portal con
 * `tiposDispositivo` del cliente, la API con `@Permisos` y `ModuloGuard`, el MCP
 * del asistente sólo con los permisos (y por eso un administrador global de una
 * distribuidora de gas veía herramientas de agua). Este archivo junta las tres
 * señales:
 *
 * 1. **El cliente**: qué vende (`commodities`, declarado) y qué hardware opera
 *    (`tiposDispositivo`). De ahí salen las divisiones que el cliente tiene.
 * 2. **Los permisos del usuario**: nivel · división · rol. Un permiso sin
 *    división vale para todas las divisiones del cliente, no para todas las que
 *    existen.
 * 3. **Los módulos**: activo en el cliente y marcado en el usuario.
 *
 * Sólo importa valores de hojas (`tipoDispositivo`, `modulo`); del cliente, el
 * usuario y el permiso toma únicamente tipos, así no cierra ningún ciclo.
 */

/**
 * Qué tipos de dispositivo hacen que un cliente tenga cada división. Es la
 * `TIPOS_DISPOSITIVO_POR_DIVISION` del portal (gas-web-cliente
 * `helper.service.ts`), más lo que esa tabla no lista y el portal resuelve
 * aparte: SCADA no tiene dispositivo (el cliente lo declara con el mismo nombre
 * en `tiposDispositivo`) y Dispositivo Externo NUC va con el NUC.
 */
export const TIPOS_POR_DIVISION: Record<Division, readonly TipoDispositivo[]> = {
  Correctoras: ["NUC"],
  Presión: ["VERIBOX MICRO", "NSP"],
  Residencial: ["SML", "WRC"],
  "Residencial Agua": ["ML107A", "ML107GH", "EUW300", "BOVE", "MRA", "UWM-NB"],
  "SCADA Unifilares": ["SCADA Unifilares"],
  "SCADA Mediciones": ["SCADA Mediciones"],
  "Dispositivo Externo NUC": ["NUC"],
  "Medidores Eléctricos": ["NME"],
  "Estaciones de Bombeo": ["UC300"],
};

export const DIVISIONES: readonly Division[] = Object.freeze(Object.keys(TIPOS_POR_DIVISION) as Division[]);

/**
 * Qué commodity mide cada tipo de dispositivo. `undefined` = la del cliente
 * (SCADA integra lo que el cliente tenga). Sirve para derivar `commodities`
 * cuando el cliente no lo declaró, y para el valor inicial al cargarlo.
 */
export const COMMODITY_POR_TIPO: Record<TipoDispositivo, Commodity | undefined> = {
  NUC: "gas",
  SML: "gas",
  MRA: "agua",
  NSP: "gas",
  "VERIBOX MICRO": "gas",
  WRC: "gas",
  "SCADA Unifilares": undefined,
  "SCADA Mediciones": undefined,
  ML107A: "agua",
  EUW300: "agua",
  BOVE: "agua",
  ML107GH: "agua",
  NME: "electricidad",
  OCR: "gas",
  "UWM-NB": "agua",
  // Bombeo es saneamiento, no agua potable (Santa Bárbara: agua y saneamiento).
  UC300: "saneamiento",
};

/**
 * Qué commodity es cada división. `undefined` = la del cliente. Una división
 * con commodity sólo existe para un cliente que la vende.
 */
export const COMMODITY_POR_DIVISION: Record<Division, Commodity | undefined> = {
  Correctoras: "gas",
  Presión: "gas",
  Residencial: "gas",
  "Residencial Agua": "agua",
  "SCADA Unifilares": undefined,
  "SCADA Mediciones": undefined,
  "Dispositivo Externo NUC": "gas",
  "Medidores Eléctricos": "electricidad",
  "Estaciones de Bombeo": "saneamiento",
};

type ClienteParaCapacidades = Pick<ICliente, "tiposDispositivo" | "commodities" | "config">;
type UsuarioParaCapacidades = Pick<IUsuario, "permisos" | "modulos"> & { cliente?: ClienteParaCapacidades };

/** Las commodities del cliente: las declaradas, o derivadas de su hardware mientras no las declare. */
export function commoditiesDe(cliente?: ClienteParaCapacidades): Commodity[] {
  if (cliente?.commodities?.length) return [...new Set(cliente.commodities)];
  return commoditiesDerivadas(cliente?.tiposDispositivo);
}

export function commoditiesDerivadas(tiposDispositivo?: TipoDispositivo[]): Commodity[] {
  const c = (tiposDispositivo ?? []).map((t) => COMMODITY_POR_TIPO[t]).filter((x): x is Commodity => Boolean(x));
  return [...new Set(c)];
}

/**
 * Las divisiones que el cliente tiene: tiene el hardware de la división y vende
 * su commodity (o la división no tiene commodity propia, como SCADA).
 */
export function divisionesDelCliente(cliente?: ClienteParaCapacidades): Division[] {
  const tipos = cliente?.tiposDispositivo ?? [];
  const commodities = commoditiesDe(cliente);
  return DIVISIONES.filter((d) => {
    const commodity = COMMODITY_POR_DIVISION[d];
    if (commodity && !commodities.includes(commodity)) return false;
    return TIPOS_POR_DIVISION[d].some((t) => tipos.includes(t));
  });
}

/** El campo viejo de `IConfigCliente` que acompaña a cada módulo, hasta que todos lean `config.modulos`. */
const CAMPO_VIEJO: Record<Modulo, keyof IConfigCliente> = {
  navegacion: "moduloNavegacion",
  linepack: "moduloLinepack",
  clima: "moduloClima",
  red: "moduloRed",
  clasificacion: "moduloClasificacion",
  coberturaLorawan: "moduloCoberturaLorawan",
  topologia: "moduloTopologia",
};

/** Si el cliente tiene el módulo activo: `config.modulos.<m>` manda; si no está, el campo viejo. */
export function moduloActivoEnCliente(cliente: ClienteParaCapacidades | undefined, modulo: Modulo): boolean {
  const nuevo = cliente?.config?.modulos?.[modulo];
  if (nuevo) return nuevo.activo === true;
  const viejo = cliente?.config?.[CAMPO_VIEJO[modulo]] as { activo?: boolean } | undefined;
  return viejo?.activo === true;
}

/** Si el usuario tiene el módulo: activo en el cliente y marcado en el usuario. Sin excepción para el administrador global. */
export function tieneModulo(usuario: UsuarioParaCapacidades | undefined, cliente: ClienteParaCapacidades | undefined, modulo: Modulo): boolean {
  return moduloActivoEnCliente(cliente, modulo) && usuario?.modulos?.[modulo] === true;
}

/** Los roles con los que la API deja consultar (`@Permisos` en puntos y resumen). */
export const ROLES_CONSULTA: readonly Rol[] = ["Administrador", "Usuario", "Visualizar"];

/**
 * Si el usuario ve alguna de las divisiones: un permiso con un rol de consulta de
 * esa división, o uno sin división, y en los dos casos el cliente la tiene.
 */
export function veDivision(
  usuario: UsuarioParaCapacidades | undefined,
  cliente: ClienteParaCapacidades | undefined,
  divisiones: readonly Division[],
  roles: readonly Rol[] = ROLES_CONSULTA,
): boolean {
  const delCliente = divisionesDelCliente(cliente);
  const posibles = divisiones.filter((d) => delCliente.includes(d));
  return (usuario?.permisos ?? []).some(
    (p) => !!p.rol && roles.includes(p.rol) && (p.division ? posibles.includes(p.division) : posibles.length > 0),
  );
}

/**
 * Las capacidades: cada una dice qué pide. Todas las condiciones que declara se
 * exigen a la vez; lo que no declara no se mira.
 */
export const CapacidadSchema = z.enum([
  // Ver una división (su listado, su detalle, sus alertas).
  "verCorrectoras",
  "verPresion",
  "verResidencial",
  "verResidencialAgua",
  "verScada",
  "verDispositivoExternoNuc",
  "verMedidoresElectricos",
  "verEstacionesBombeo",
  // Funciones que dependen de una división.
  "consumoCorrectoras",
  "consumoResidencial",
  "consumoAgua",
  "recambiosAgua",
  "cromatografias",
  "graficos",
  "mantenimientos",
  // Módulos.
  ...ModuloSchema.options,
]);
export type Capacidad = z.infer<typeof CapacidadSchema>;

export interface IDefinicionCapacidad {
  /** Alguna de estas divisiones, que el cliente tenga y el usuario vea. */
  divisiones?: readonly Division[];
  /** Alguna de estas commodities entre las del cliente. */
  commodities?: readonly Commodity[];
  /** Activo en el cliente y marcado en el usuario. */
  modulo?: Modulo;
  /** Algún permiso con uno de estos roles. Por defecto, los de consulta. */
  roles?: readonly Rol[];
}

const SCADA: readonly Division[] = ["SCADA Unifilares", "SCADA Mediciones"];

export const CATALOGO_CAPACIDADES: Record<Capacidad, IDefinicionCapacidad> = {
  verCorrectoras: { divisiones: ["Correctoras"] },
  verPresion: { divisiones: ["Presión"] },
  verResidencial: { divisiones: ["Residencial"] },
  verResidencialAgua: { divisiones: ["Residencial Agua"] },
  verScada: { divisiones: SCADA },
  verDispositivoExternoNuc: { divisiones: ["Dispositivo Externo NUC"] },
  verMedidoresElectricos: { divisiones: ["Medidores Eléctricos"] },
  verEstacionesBombeo: { divisiones: ["Estaciones de Bombeo"] },
  // `@Permisos({ division: 'Correctoras' })` en /registros/consumo.
  consumoCorrectoras: { divisiones: ["Correctoras"] },
  // `@Permisos({ division: 'Residencial' })` en /reportes/consumo.
  consumoResidencial: { divisiones: ["Residencial"] },
  // Los endpoints de agua no piden división: recortan por los puntos del usuario.
  consumoAgua: { divisiones: ["Residencial Agua"] },
  recambiosAgua: { divisiones: ["Residencial Agua"] },
  cromatografias: { divisiones: ["Correctoras"], commodities: ["gas"] },
  // Gráficos grafica SCADA, Presión y Correctoras.
  graficos: { divisiones: [...SCADA, "Presión", "Correctoras"] },
  // `@Permisos({ roles: ['Administrador'] })`, de cualquier división.
  mantenimientos: { roles: ["Administrador"] },
  navegacion: { modulo: "navegacion" },
  linepack: { modulo: "linepack", commodities: ["gas"] },
  clima: { modulo: "clima" },
  red: { modulo: "red" },
  clasificacion: { modulo: "clasificacion" },
  coberturaLorawan: { modulo: "coberturaLorawan" },
  topologia: { modulo: "topologia" },
};

/** Si el usuario tiene una capacidad en su cliente. */
export function tieneCapacidad(
  usuario: UsuarioParaCapacidades | undefined,
  cliente: ClienteParaCapacidades | undefined,
  capacidad: Capacidad,
): boolean {
  const def = CATALOGO_CAPACIDADES[capacidad];
  const roles = def.roles ?? ROLES_CONSULTA;
  if (!(usuario?.permisos ?? []).some((p) => !!p.rol && roles.includes(p.rol))) return false;
  if (def.commodities && !def.commodities.some((c) => commoditiesDe(cliente).includes(c))) return false;
  if (def.divisiones && !veDivision(usuario, cliente, def.divisiones, roles)) return false;
  if (def.modulo && !tieneModulo(usuario, cliente, def.modulo)) return false;
  return true;
}

/**
 * Todas las capacidades del usuario en su cliente. `cliente` por defecto es el
 * populado en el usuario (`GET /usuarios/propio` lo trae entero).
 */
export function capacidadesDe(
  usuario: UsuarioParaCapacidades | undefined,
  cliente: ClienteParaCapacidades | undefined = usuario?.cliente,
): Set<Capacidad> {
  return new Set(CapacidadSchema.options.filter((c) => tieneCapacidad(usuario, cliente, c)));
}

// Que las tablas cubran todos los tipos y todas las divisiones lo fija el test; esto sólo evita que un tipo nuevo
// compile sin entrar a COMMODITY_POR_TIPO.
void TipoDispositivoSchema;
