import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const U = (o) => ({ lo: null, lolo: null, unidad: "bar", ...o });

test("orden de límites: válidos e inválidos", () => {
  assert.ok(m.ValoresUmbralLinepackSchema.safeParse(U({ lolo: 10, lo: 12 })).success);
  assert.ok(m.ValoresUmbralLinepackSchema.safeParse(U({ lolo: 12, lo: 12 })).success);
  assert.ok(m.ValoresUmbralLinepackSchema.safeParse(U({ lo: 12 })).success);
  assert.ok(m.ValoresUmbralLinepackSchema.safeParse(U({})).success);
  assert.equal(m.ValoresUmbralLinepackSchema.safeParse(U({ lolo: 13, lo: 12 })).success, false);
  assert.equal(m.ValoresUmbralLinepackSchema.safeParse(U({ lolo: -1 })).success, false);
  assert.equal(m.ValoresUmbralLinepackSchema.safeParse(U({ unidad: "" })).success, false);
});

test("sin HI ni HIHI: no son parte de los valores", () => {
  const r = m.ValoresUmbralLinepackSchema.safeParse(U({ lo: 12, hi: 40, hihi: 45 }));
  assert.ok(r.success);
  assert.deepEqual(Object.keys(r.data).sort(), ["lo", "lolo", "unidad"]);
});

test("convertirPresion", () => {
  assert.equal(m.convertirPresion(10, "kg/cm2", "bar"), 9.80665);
  assert.equal(m.convertirPresion(9.80665, "bar", "kg/cm2"), 10);
  assert.equal(m.convertirPresion(10, "bar", "bar"), 10);
  assert.equal(m.convertirPresion(10, "bar", "psi"), null);
});

test("UmbralLinepackSchema: una fila por punto de medición, omit sin romper", () => {
  const fila = { idCliente: "c", idPuntoMedicion: "pm1", ...U({ lo: 12 }) };
  assert.ok(m.UmbralLinepackSchema.safeParse(fila).success);
  assert.equal(m.UmbralLinepackSchema.safeParse({ ...fila, idPuntoMedicion: undefined }).success, false);
  assert.ok(m.CreateUmbralLinepackSchema.safeParse(fila).success);
  assert.ok(m.UpdateUmbralLinepackSchema.safeParse({ lo: 3 }).success);
});

test("límite ausente (undefined) cuenta como null", () => {
  assert.equal(m.umbralesEnOrden({ lo: 12 }), true);
  assert.equal(m.umbralesEnOrden({ lolo: 12 }), true);
  assert.equal(m.umbralesEnOrden({ lolo: 13, lo: 12 }), false);
});
