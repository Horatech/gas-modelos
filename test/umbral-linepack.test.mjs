import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const U = (o) => ({ lo: null, lolo: null, hi: null, hihi: null, unidad: "bar", ...o });

test("orden de umbrales: válidos e inválidos", () => {
  assert.ok(m.ValoresUmbralLinepackSchema.safeParse(U({ lolo: 10, lo: 12, hi: 40, hihi: 45 })).success);
  assert.ok(m.ValoresUmbralLinepackSchema.safeParse(U({ lolo: 12, lo: 12 })).success);
  assert.ok(m.ValoresUmbralLinepackSchema.safeParse(U({ hihi: 45 })).success);
  assert.ok(m.ValoresUmbralLinepackSchema.safeParse(U({})).success);
  assert.equal(m.ValoresUmbralLinepackSchema.safeParse(U({ lolo: 13, lo: 12 })).success, false);
  assert.equal(m.ValoresUmbralLinepackSchema.safeParse(U({ lo: 40, hi: 40 })).success, false);
  assert.equal(m.ValoresUmbralLinepackSchema.safeParse(U({ lo: 20, hihi: 15 })).success, false);
  assert.equal(m.ValoresUmbralLinepackSchema.safeParse(U({ lolo: -1 })).success, false);
  assert.equal(m.ValoresUmbralLinepackSchema.safeParse(U({ unidad: "" })).success, false);
});

test("evaluarExtremo: bandas", () => {
  const u = U({ lolo: 10, lo: 12, hi: 40, hihi: 45 });
  assert.equal(m.evaluarExtremo(9.9, "good", "bar", u), "red");
  assert.equal(m.evaluarExtremo(11, "good", "bar", u), "yellow");
  assert.equal(m.evaluarExtremo(12, "good", "bar", u), "green");
  assert.equal(m.evaluarExtremo(41, "good", "bar", u), "yellow");
  assert.equal(m.evaluarExtremo(45.1, "good", "bar", u), "red");
});

test("evaluarExtremo: sin dato, viejo o unidad desconocida → gris", () => {
  const u = U({ lo: 12 });
  assert.equal(m.evaluarExtremo(null, "good", "bar", u), "gray");
  assert.equal(m.evaluarExtremo(undefined, "good", "bar", u), "gray");
  assert.equal(m.evaluarExtremo(5, "uncertain", "bar", u), "gray");
  assert.equal(m.evaluarExtremo(5, "bad", "bar", u), "gray");
  assert.equal(m.evaluarExtremo(5, undefined, "bar", u), "gray");
  assert.equal(m.evaluarExtremo(5, "good", "psi", u), "gray");
});

test("evaluarExtremo: parciales y conversión", () => {
  assert.equal(m.evaluarExtremo(50, "good", "bar", U({ hihi: 45 })), "red");
  assert.equal(m.evaluarExtremo(5, "good", "bar", U({ hihi: 45 })), "green");
  // fila en kg/cm2: 12 kg/cm2 = 11,77 bar
  assert.equal(m.evaluarExtremo(11.8, "good", "bar", U({ lo: 12, unidad: "kg/cm2" })), "green");
  assert.equal(m.evaluarExtremo(11.7, "good", "bar", U({ lo: 12, unidad: "kg/cm2" })), "yellow");
  // señal sin unidad: se toma bar
  assert.equal(m.evaluarExtremo(11, "good", undefined, U({ lo: 12 })), "yellow");
  assert.equal(m.convertirPresion(10, "kg/cm2", "bar"), 9.80665);
  assert.equal(m.convertirPresion(9.80665, "bar", "kg/cm2"), 10);
  assert.equal(m.convertirPresion(10, "bar", "bar"), 10);
  assert.equal(m.convertirPresion(10, "bar", "psi"), null);
});

test("peorEstadoUmbral", () => {
  assert.equal(m.peorEstadoUmbral([]), "gray");
  assert.equal(m.peorEstadoUmbral(["gray", "green"]), "green");
  assert.equal(m.peorEstadoUmbral(["green", "red", "yellow"]), "red");
});

test("UmbralLinepackSchema: extremos válidos y omit sin romper", () => {
  const fila = { idCliente: "c", codigoTramo: "088-001-A", extremo: "P_FIN", ...U({ lo: 12 }) };
  assert.ok(m.UmbralLinepackSchema.safeParse(fila).success);
  assert.equal(m.UmbralLinepackSchema.safeParse({ ...fila, extremo: "PRESION_PROMEDIO" }).success, false);
  assert.ok(m.CreateUmbralLinepackSchema.safeParse(fila).success);
  assert.ok(m.UpdateUmbralLinepackSchema.safeParse({ lo: 3 }).success);
});

test("umbral ausente (undefined) cuenta como null", () => {
  assert.equal(m.umbralesEnOrden({ lo: 12 }), true);
  assert.equal(m.umbralesEnOrden({ lolo: 13, lo: 12 }), false);
  assert.equal(m.evaluarExtremo(11, "good", "bar", { lo: 12, unidad: "bar" }), "yellow");
  assert.equal(m.evaluarExtremo(20, "good", "bar", { lo: 12, unidad: "bar" }), "green");
});
