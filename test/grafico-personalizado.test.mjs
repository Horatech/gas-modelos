import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const base = {
  idUsuario: "u1", idCliente: "c1", nombre: "Sala",
  modo: "vivo", duracion: "1H", vista: "unico", nombreMostrado: "tag", escala: "auto",
  series: [{ canal: "reportes/SCADA#tag:LP_PT101", visible: true }],
};

test("canalScada y tagDeCanalScada son inversos; otro canal no es SCADA", () => {
  assert.equal(m.canalScada("FIX02.LP_PT101"), "reportes/SCADA#tag:FIX02.LP_PT101");
  assert.equal(m.tagDeCanalScada("reportes/SCADA#tag:FIX02.LP_PT101"), "FIX02.LP_PT101");
  assert.equal(m.tagDeCanalScada("registros/NUC#presion"), null);
  assert.ok(m.CATALOGO_CANALES.some((p) => p.clave === "SCADA" && p.forma === "angosto"));
});

test("un preset vivo con duración es válido; vivo sin duración no", () => {
  const s = m.CreateGraficoPersonalizadoSchema;
  assert.equal(s.safeParse(base).success, true);
  const { duracion, ...sin } = base;
  assert.equal(s.safeParse(sin).success, false);
});

test("histórico lleva duración o rango, no los dos", () => {
  const r = { desde: "2026-10-01T00:00:00.000Z", hasta: "2026-10-02T00:00:00.000Z" };
  const s = m.CreateGraficoPersonalizadoSchema;
  assert.equal(s.safeParse({ ...base, modo: "historico", duracion: undefined, rango: r }).success, true);
  assert.equal(s.safeParse({ ...base, modo: "historico", rango: r }).success, false);
});

test("canal inválido o más de 20 series no pasan", () => {
  const s = m.CreateGraficoPersonalizadoSchema;
  assert.equal(s.safeParse({ ...base, series: [{ canal: "cualquiera", visible: true }] }).success, false);
  const series = Array.from({ length: 21 }, (_, i) => ({ canal: m.canalScada(`T${i}`), visible: true }));
  assert.equal(s.safeParse({ ...base, series }).success, false);
});

test("al actualizar no se cambia dueño ni cliente", () => {
  assert.deepEqual(m.UpdateGraficoPersonalizadoSchema.parse({ idUsuario: "x", idCliente: "y", nombre: "n" }), { nombre: "n" });
});

test("pedido de series: ids separados por coma, 1 a 20", () => {
  const p = { desde: "2026-10-01T00:00:00.000Z", hasta: "2026-10-02T00:00:00.000Z" };
  assert.deepEqual(m.PedidoSeriesScadaSchema.parse({ ...p, ids: "a, b" }).ids, ["a", "b"]);
  assert.equal(m.PedidoSeriesScadaSchema.safeParse({ ...p, ids: "" }).success, false);
  const muchos = Array.from({ length: 21 }, (_, i) => `s${i}`).join(",");
  assert.equal(m.PedidoSeriesScadaSchema.safeParse({ ...p, ids: muchos }).success, false);
  assert.deepEqual(m.PedidoCatalogoScadaSchema.parse({ ids: "a,b" }).ids, ["a", "b"]);
});

test("escala por serie: min y max opcionales, min < max; márgenes opcional", () => {
  const s = m.CreateGraficoPersonalizadoSchema;
  const con = (escala) => ({ ...base, series: [{ ...base.series[0], escala }] });
  assert.equal(s.safeParse(con({ min: 0, max: 10 })).success, true);
  assert.equal(s.safeParse(con({ max: 10 })).success, true);
  assert.equal(s.safeParse(con({})).success, true);
  assert.equal(s.safeParse(con({ min: 10, max: 10 })).success, false);
  assert.deepEqual(s.parse(con({ min: 1 })).series[0].escala, { min: 1 });
  assert.equal(s.parse({ ...base, margenes: false }).margenes, false);
  assert.equal(s.parse(base).margenes, undefined);
});
