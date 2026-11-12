/**
 * Capacidades por cliente y por usuario (`tenant/capacidades.ts`): las tablas
 * tipo → división → commodity, los módulos normalizados y el resolver.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const admin = { permisos: [{ nivel: "Global", rol: "Administrador" }] };
const camuzzi = { tiposDispositivo: ["NSP", "NUC", "SCADA Mediciones", "SCADA Unifilares", "SML", "VERIBOX MICRO", "WRC"] };
const aysam = { tiposDispositivo: ["ML107A"] };

test("las tablas cubren todos los tipos de dispositivo y todas las divisiones, y no se contradicen", () => {
  assert.deepEqual(Object.keys(m.COMMODITY_POR_TIPO).sort(), [...m.TIPOS_DISPOSITIVOS].sort());
  assert.deepEqual([...m.DIVISIONES].sort(), [...m.DivisionSchema.options].sort());
  for (const d of m.DIVISIONES) {
    for (const t of m.TIPOS_POR_DIVISION[d]) {
      assert.ok(m.TIPOS_DISPOSITIVOS.includes(t), `${d}: ${t}`);
      // Un tipo con commodity sólo entra en divisiones de esa commodity.
      if (m.COMMODITY_POR_TIPO[t] && m.COMMODITY_POR_DIVISION[d]) assert.equal(m.COMMODITY_POR_TIPO[t], m.COMMODITY_POR_DIVISION[d], `${d}: ${t}`);
    }
  }
  // OCR es gas y no tiene división: sólo aporta commodity.
  assert.equal(m.COMMODITY_POR_TIPO.OCR, "gas");
  assert.ok(!m.DIVISIONES.some((d) => m.TIPOS_POR_DIVISION[d].includes("OCR")));
});

test("commodities: declaradas mandan; sin declarar, se derivan del hardware", () => {
  assert.deepEqual(m.commoditiesDe(camuzzi), ["gas"]);
  assert.deepEqual(m.commoditiesDe(aysam), ["agua"]);
  assert.deepEqual(m.commoditiesDe({ tiposDispositivo: ["EUW300", "NME"] }), ["agua", "electricidad"]);
  // Santa Bárbara: medidores de agua y una estación de bombeo = agua y saneamiento.
  assert.deepEqual(m.commoditiesDe({ tiposDispositivo: ["EUW300", "MRA", "UC300"] }), ["agua", "saneamiento"]);
  // SCADA solo no deriva nada: hay que declararlo.
  assert.deepEqual(m.commoditiesDe({ tiposDispositivo: ["SCADA Mediciones"] }), []);
  assert.deepEqual(m.commoditiesDe({ tiposDispositivo: ["SCADA Mediciones"], commodities: ["gas"] }), ["gas"]);
  // Declarado gas con hardware de agua: el hardware no cuenta.
  assert.deepEqual(m.commoditiesDe({ tiposDispositivo: ["EUW300", "NME"], commodities: ["electricidad"] }), ["electricidad"]);
  assert.deepEqual(m.commoditiesDe(undefined), []);
});

test("divisiones del cliente: hardware de la división y commodity que vende", () => {
  assert.deepEqual(m.divisionesDelCliente(camuzzi), ["Correctoras", "Presión", "Residencial", "SCADA Unifilares", "SCADA Mediciones", "Dispositivo Externo NUC"]);
  assert.deepEqual(m.divisionesDelCliente(aysam), ["Residencial Agua"]);
  // Costa Esmeralda declara EUW300 pero vende electricidad: no tiene Residencial Agua.
  assert.deepEqual(m.divisionesDelCliente({ tiposDispositivo: ["EUW300", "NME"], commodities: ["electricidad"] }), ["Medidores Eléctricos"]);
  // SCADA sin commodity declarada existe igual: no tiene commodity propia.
  assert.deepEqual(m.divisionesDelCliente({ tiposDispositivo: ["SCADA Mediciones"] }), ["SCADA Mediciones"]);
  // Bombeo sólo para quien vende saneamiento: declarado sólo agua, la estación no aparece.
  assert.deepEqual(m.divisionesDelCliente({ tiposDispositivo: ["EUW300", "UC300"], commodities: ["agua"] }), ["Residencial Agua"]);
  assert.deepEqual(m.divisionesDelCliente({ tiposDispositivo: ["EUW300", "UC300"] }), ["Residencial Agua", "Estaciones de Bombeo"]);
  assert.deepEqual(m.divisionesDelCliente(undefined), []);
});

test("un permiso sin división vale para las divisiones del cliente, no para todas", () => {
  const deGas = m.capacidadesDe(admin, camuzzi);
  for (const c of ["verCorrectoras", "verPresion", "verResidencial", "verScada", "consumoCorrectoras", "consumoResidencial", "cromatografias", "graficos", "mantenimientos"]) assert.ok(deGas.has(c), c);
  for (const c of ["verResidencialAgua", "consumoAgua", "recambiosAgua", "verMedidoresElectricos"]) assert.ok(!deGas.has(c), c);
  const deAgua = m.capacidadesDe(admin, aysam);
  for (const c of ["verResidencialAgua", "consumoAgua", "recambiosAgua", "mantenimientos"]) assert.ok(deAgua.has(c), c);
  for (const c of ["verCorrectoras", "consumoCorrectoras", "cromatografias", "graficos", "verScada"]) assert.ok(!deAgua.has(c), c);
  // Sin cliente, nada por división.
  assert.deepEqual([...m.capacidadesDe(admin, undefined)], ["mantenimientos"]);
  // El cliente populado en el usuario es el default.
  assert.ok(m.capacidadesDe({ ...admin, cliente: aysam }).has("consumoAgua"));
});

test("un permiso con división pide esa división en el cliente, y el rol cuenta", () => {
  const residencial = { permisos: [{ nivel: "Localidad", division: "Residencial", rol: "Visualizar" }] };
  assert.ok(m.tieneCapacidad(residencial, camuzzi, "consumoResidencial"));
  assert.ok(!m.tieneCapacidad(residencial, camuzzi, "consumoCorrectoras"));
  assert.ok(!m.tieneCapacidad(residencial, aysam, "consumoResidencial"));
  assert.ok(!m.tieneCapacidad(residencial, camuzzi, "mantenimientos"));
  const croma = { permisos: [{ nivel: "Localidad", division: "Correctoras", rol: "Croma" }] };
  assert.deepEqual([...m.capacidadesDe(croma, camuzzi)], []);
  assert.deepEqual([...m.capacidadesDe(undefined, camuzzi)], []);
});

test("módulos: activo en el cliente y marcado en el usuario; el campo nuevo manda sobre el viejo", () => {
  const u = { ...admin, modulos: { clima: true, linepack: true, coberturaLorawan: true } };
  const viejo = { ...camuzzi, config: { moduloClima: { activo: true }, moduloLinepack: { activo: true } } };
  assert.ok(m.tieneCapacidad(u, viejo, "clima"));
  assert.ok(m.tieneCapacidad(u, viejo, "linepack"));
  assert.ok(!m.tieneCapacidad(u, viejo, "coberturaLorawan"));
  assert.ok(!m.tieneCapacidad(admin, viejo, "clima"), "sin la marca del usuario no");
  const nuevo = { ...camuzzi, config: { modulos: { clima: { activo: false }, coberturaLorawan: { activo: true, verMetricas: true } }, moduloClima: { activo: true } } };
  assert.ok(!m.tieneCapacidad(u, nuevo, "clima"), "modulos.clima apagado manda sobre moduloClima");
  assert.ok(m.tieneCapacidad(u, nuevo, "coberturaLorawan"));
  // Linepack pide gas: un cliente de agua con el módulo no lo tiene.
  assert.ok(!m.tieneCapacidad(u, { ...aysam, config: { modulos: { linepack: { activo: true } } } }, "linepack"));
});

test("el enum de módulos es uno solo, sin sinóptico, y los schemas lo aceptan entero", () => {
  assert.deepEqual([...m.MODULOS], ["navegacion", "linepack", "clima", "red", "clasificacion", "coberturaLorawan", "topologia"]);
  const todos = Object.fromEntries(m.MODULOS.map((x) => [x, true]));
  assert.deepEqual(m.ModulosUsuarioSchema.parse(todos), todos);
  assert.deepEqual(m.ModulosUsuarioSchema.parse({ sinoptico: true }), {}, "strip: una llave desconocida se descarta");
  assert.deepEqual(Object.keys(m.ModulosUsuarioSchema.shape), [...m.MODULOS]);
  assert.deepEqual(Object.keys(m.ModulosClienteSchema.shape), [...m.MODULOS]);
  const cfg = m.ConfigClienteSchema.parse({ modulos: { red: { activo: true }, coberturaLorawan: { activo: true, verMetricas: false } }, moduloSinoptico: { activo: true } });
  assert.deepEqual(cfg.modulos, { red: { activo: true }, coberturaLorawan: { activo: true, verMetricas: false } });
  assert.equal(cfg.moduloSinoptico, undefined);
  assert.ok(!("ModuloSinopticoSchema" in m));
  // Todas las capacidades tienen definición y cada módulo es una capacidad.
  assert.deepEqual(Object.keys(m.CATALOGO_CAPACIDADES).sort(), [...m.CapacidadSchema.options].sort());
  for (const x of m.MODULOS) assert.equal(m.CATALOGO_CAPACIDADES[x].modulo, x);
});

test("el cliente declara commodities", () => {
  assert.deepEqual(m.ClienteSchema.parse({ commodities: ["gas", "agua"] }).commodities, ["gas", "agua"]);
  assert.equal(m.ClienteSchema.safeParse({ commodities: ["petroleo"] }).success, false);
  assert.deepEqual(m.CreateClienteSchema.parse({ nombre: "x", commodities: ["agua"] }).commodities, ["agua"]);
});

test("Nodos Virtuales: por módulo linepack, no por dispositivo", () => {
  const sin = { tiposDispositivo: ["SCADA Mediciones"], config: {} };
  const con = { tiposDispositivo: ["SCADA Mediciones"], config: { modulos: { linepack: { activo: true } } } };
  assert.ok(!m.divisionesDelCliente(sin).includes("Nodos Virtuales"));
  assert.ok(m.divisionesDelCliente(con).includes("Nodos Virtuales"));
});
