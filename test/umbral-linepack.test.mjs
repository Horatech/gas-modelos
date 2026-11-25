import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const U = (o) => ({ lo: null, lolo: null, hi: null, hihi: null, unidad: "bar", ...o });

test("orden de límites: válidos e inválidos", () => {
  assert.ok(m.ValoresUmbralLinepackSchema.safeParse(U({ lolo: 10, lo: 12 })).success);
  assert.ok(m.ValoresUmbralLinepackSchema.safeParse(U({ lolo: 12, lo: 12 })).success);
  assert.ok(m.ValoresUmbralLinepackSchema.safeParse(U({ lo: 12 })).success);
  assert.ok(m.ValoresUmbralLinepackSchema.safeParse(U({})).success);
  assert.equal(m.ValoresUmbralLinepackSchema.safeParse(U({ lolo: 13, lo: 12 })).success, false);
  assert.equal(m.ValoresUmbralLinepackSchema.safeParse(U({ lolo: -1 })).success, false);
  assert.equal(m.ValoresUmbralLinepackSchema.safeParse(U({ unidad: "" })).success, false);
});

test("cuatro límites: lolo ≤ lo < hi ≤ hihi sobre los presentes", () => {
  const ok = (o) => m.ValoresUmbralLinepackSchema.safeParse(U(o)).success;
  assert.ok(ok({ lolo: 10, lo: 12, hi: 40, hihi: 45 }));
  assert.ok(ok({ lolo: 10, lo: 12, hi: 40, hihi: 40 }));
  assert.ok(ok({ hi: 40 }));
  assert.ok(ok({ hihi: 45 }));
  assert.ok(ok({ lo: 12, hihi: 45 }));
  // Entre un inferior y un superior, estricto.
  assert.equal(ok({ lo: 40, hi: 40 }), false);
  assert.equal(ok({ lolo: 40, hihi: 40 }), false);
  assert.equal(ok({ lo: 41, hi: 40 }), false);
  // Ausente el del medio, se comparan los que están.
  assert.equal(ok({ lolo: 46, hihi: 45 }), false);
  assert.equal(ok({ lo: 12, hi: 46, hihi: 45 }), false);
  assert.equal(ok({ hihi: -1 }), false);
});

test("los cuatro viajan en los valores", () => {
  const r = m.ValoresUmbralLinepackSchema.safeParse(U({ lo: 12, hi: 40, hihi: 45 }));
  assert.ok(r.success);
  assert.deepEqual(Object.keys(r.data).sort(), ["hi", "hihi", "lo", "lolo", "unidad"]);
});

test("convertirPresion", () => {
  assert.equal(m.convertirPresion(10, "kg/cm2", "bar"), 9.80665);
  assert.equal(m.convertirPresion(9.80665, "bar", "kg/cm2"), 10);
  assert.equal(m.convertirPresion(10, "bar", "bar"), 10);
  assert.equal(m.convertirPresion(10, "bar", "psi"), null);
});

test("UmbralLinepackSchema: una fila por nodo; el punto es dato, no clave", () => {
  const fila = { idCliente: "c", nodo: "ERP_BARILOCHE.P_ENTRADA", idPuntoMedicion: "pm1", ...U({ lo: 12 }) };
  assert.ok(m.UmbralLinepackSchema.safeParse(fila).success);
  assert.ok(m.UmbralLinepackSchema.safeParse({ ...fila, idPuntoMedicion: undefined }).success);
  assert.equal(m.UmbralLinepackSchema.safeParse({ ...fila, nodo: undefined }).success, false);
  assert.equal(m.UmbralLinepackSchema.safeParse({ ...fila, nodo: "" }).success, false);
  assert.ok(m.CreateUmbralLinepackSchema.safeParse(fila).success);
  assert.ok(m.UpdateUmbralLinepackSchema.safeParse({ lo: 3 }).success);
});

test("juego por defecto: sólo, sin propio ni unidad", () => {
  const porDefecto = { lo: 43.16, lolo: 31.35, hi: 54.15, hihi: null, origen: "csv", fecha: "2026-11-25T12:00:00.000Z" };
  const fila = { idCliente: "c", nodo: "ERP_BARILOCHE.P_ENTRADA", porDefecto };
  assert.ok(m.UmbralLinepackSchema.safeParse(fila).success);
  assert.ok(m.UmbralLinepackSchema.safeParse({ ...fila, porDefecto: null }).success);
  assert.ok(m.UmbralLinepackSchema.safeParse({ ...fila, porDefecto: { ...porDefecto, origen: "proveedor" } }).success);
  assert.equal(m.UmbralLinepackSchema.safeParse({ ...fila, porDefecto: { ...porDefecto, origen: "otro" } }).success, false);
  assert.equal(m.UmbralLinepackSchema.safeParse({ ...fila, porDefecto: { ...porDefecto, fecha: undefined } }).success, false);
  assert.equal(m.UmbralLinepackSchema.safeParse({ ...fila, porDefecto: { ...porDefecto, lo: -1 } }).success, false);
});

test("límite ausente (undefined) cuenta como null", () => {
  assert.equal(m.umbralesEnOrden({ lo: 12 }), true);
  assert.equal(m.umbralesEnOrden({ lolo: 12 }), true);
  assert.equal(m.umbralesEnOrden({ lolo: 13, lo: 12 }), false);
  assert.equal(m.umbralesEnOrden({ hi: 40 }), true);
  assert.equal(m.umbralesEnOrden({ lo: 40, hi: 40 }), false);
});
