import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const H = 3600_000;

test("canales graficables: presión por división y NUC de correctoras, todos en el catálogo", () => {
  assert.deepEqual(m.CANALES_GRAFICABLES["Presión"], ["reportes/Presion#valores.presion"]);
  for (const canales of Object.values(m.CANALES_GRAFICABLES)) {
    for (const c of canales) {
      const d = m.descriptorDe(c);
      assert.ok(d, `sin descriptor: ${c}`);
      assert.equal(d.emitido, true);
      assert.equal(d.dominio, "proceso");
      assert.ok(m.perfilDe(c));
    }
  }
  assert.equal(m.descriptorDe("reportes/Presion#valores.presion").divisionRequerida, "Presión");
  assert.equal(m.descriptorDe("reportes/Presion#valores.presion").rangoPlausible.min, 0);
});

test("desfase del corte diario: día gas 10:00 UTC; calendario según el navegador", () => {
  assert.equal(m.desfaseCorteDiario("dia-gas"), 600);
  assert.equal(m.desfaseCorteDiario("dia-gas", 180), 600);
  assert.equal(m.desfaseCorteDiario("dia-calendario", 180), 180);
});

test("balde diario con desfase: día gas arranca 10:00 UTC; calendario AR a las 03:00 UTC", () => {
  const t = Date.parse("2026-10-15T08:30:00.000Z"); // 05:30 ARG: día gas del 14, calendario del 15
  assert.equal(new Date(m.inicioBaldeConDesfase(t, "1d", 600)).toISOString(), "2026-10-14T10:00:00.000Z");
  assert.equal(new Date(m.inicioBaldeConDesfase(t, "1d", 180)).toISOString(), "2026-10-15T03:00:00.000Z");
  assert.equal(m.inicioBaldeConDesfase(t, "1d", 0), Date.parse("2026-10-15T00:00:00.000Z"));
  assert.equal(m.inicioBaldeConDesfase(t, "1h", 600), Date.parse("2026-10-15T08:00:00.000Z"));
  assert.equal(m.inicioBaldeConDesfase(Date.parse("2026-10-15T10:00:00.000Z"), "1d", 600), Date.parse("2026-10-15T10:00:00.000Z"));
  assert.ok(H > 0);
});

test("pedido de series por punto: 1 a 20 items con canal válido", () => {
  const s = m.PedidoSeriesPuntoSchema;
  const base = { desde: "2026-10-01T00:00:00.000Z", hasta: "2026-10-02T00:00:00.000Z" };
  const item = { idPunto: "p1", canal: "reportes/Presion#valores.presion" };
  assert.equal(s.safeParse({ ...base, items: [item], desfaseMin: 600 }).success, true);
  assert.equal(s.safeParse({ ...base, items: [] }).success, false);
  assert.equal(s.safeParse({ ...base, items: Array(21).fill(item) }).success, false);
  assert.equal(s.safeParse({ ...base, items: [{ idPunto: "p1", canal: "x" }] }).success, false);
});

test("el preset acepta corte diario y lo rechaza si no es uno de los dos", () => {
  const p = {
    idUsuario: "u1", idCliente: "c1", nombre: "Presión", modo: "historico", duracion: "1A",
    vista: "unico", nombreMostrado: "descripcion", escala: "auto",
    series: [{ canal: "reportes/Presion#valores.presion", idPunto: "p1", visible: true }],
  };
  const s = m.CreateGraficoPersonalizadoSchema;
  assert.equal(s.safeParse({ ...p, corteDiario: "dia-calendario" }).success, true);
  assert.equal(s.safeParse(p).success, true);
  assert.equal(s.safeParse({ ...p, corteDiario: "utc" }).success, false);
});
