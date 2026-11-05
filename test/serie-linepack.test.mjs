import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const LP = "linepack/Linepack#LINEPACK";
const PI = "linepack/Linepack#P_INICIO";

test("canales de linepack: las tres señales del tramo, calculadas, en el catálogo", () => {
  assert.deepEqual(m.CANALES_LINEPACK, [LP, PI, "linepack/Linepack#P_FIN"]);
  assert.equal(m.CANAL_LINEPACK, LP);
  for (const c of m.CANALES_LINEPACK) {
    const d = m.descriptorDe(c);
    assert.ok(d, `sin descriptor: ${c}`);
    assert.equal(d.naturaleza, "calculado");
    assert.equal(d.divisionRequerida, undefined);
    assert.ok(m.esCanalLinepack(c));
    assert.equal(m.esCanalClima(c), false);
  }
  assert.equal(m.descriptorDe(LP).unidadCanonica, "Sm3");
  assert.equal(m.descriptorDe(PI).unidadCanonica, "bar");
  // La presión promedio es sólo el paso intermedio del cálculo del linepack: no es un canal.
  assert.equal(m.esCanalLinepack("linepack/Linepack#PRESION_PROMEDIO"), false);
  assert.equal(m.esCanalLinepack("linepack/Linepack#VOLUMEN"), false);
});

test("pedido de series de linepack: en sistema y subsistema, sólo el linepack", () => {
  const base = { desde: "2026-10-01T00:00:00Z", hasta: "2026-10-02T00:00:00Z" };
  const item = (canal, nivel) => ({ canal, linepack: { nivel, id: "x" } });
  const ok = (items) => m.PedidoSeriesLinepackSchema.safeParse({ ...base, items }).success;
  assert.ok(ok([item(LP, "Sistema"), item(LP, "Subsistema"), item(LP, "Tramo"), item(PI, "Tramo")]));
  assert.equal(ok([item(PI, "Subsistema")]), false);
  assert.equal(ok([item(LP, "Nodo")]), false);
  assert.equal(ok([item("registroclimas/Clima#temperatura", "Tramo")]), false);
  assert.equal(ok([]), false);
});

test("preset: una serie de linepack lleva su ámbito y conserva el campo", () => {
  const preset = {
    idUsuario: "u",
    idCliente: "c",
    nombre: "Linepack",
    modo: "vivo",
    duracion: "1W",
    vista: "unico",
    nombreMostrado: "descripcion",
    escala: "auto",
    series: [{ canal: LP, linepack: { nivel: "Sistema", id: "CORDILLERANO_PATAGONICO" }, visible: true }],
  };
  const r = m.CreateGraficoPersonalizadoSchema.safeParse(preset);
  assert.ok(r.success);
  assert.deepEqual(r.data.series[0].linepack, { nivel: "Sistema", id: "CORDILLERANO_PATAGONICO" });
  const malo = { ...preset, series: [{ canal: PI, linepack: { nivel: "Sistema", id: "x" }, visible: true }] };
  assert.equal(m.CreateGraficoPersonalizadoSchema.safeParse(malo).success, false);
});
