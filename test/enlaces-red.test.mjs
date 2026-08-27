/**
 * Los tres predicados que el recorrido de rama consume. Se fijan acá porque son
 * lógica pura y el backend no debería reimplementarla.
 *
 * Corre con el runner nativo de Node contra `dist/`, igual que
 * `predicados.test.mjs`. Requiere `npm run build` antes (el script ya lo encadena).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { orientacionesDe, enlaceAbierto, esBucle } = require("../dist/index.js");

const base = {
  _id: "e1",
  idPuntoDesde: "A",
  idPuntoHasta: "B",
  commodity: "gas",
  origen: "manual",
  idCliente: "c1",
};

test("un enlace dirigido aporta una sola orientación", () => {
  assert.deepEqual(orientacionesDe({ ...base, sentido: "dirigido" }), [
    ["A", "B"],
  ]);
});

// En un anillo los dos extremos suelen ser del mismo nivel: el flujo puede ir
// para cualquier lado y el recorrido tiene que poder entrar por los dos.
test("un enlace bidireccional aporta las dos orientaciones", () => {
  assert.deepEqual(orientacionesDe({ ...base, sentido: "bidireccional" }), [
    ["A", "B"],
    ["B", "A"],
  ]);
});

test("sin estado declarado, el enlace está abierto", () => {
  assert.equal(enlaceAbierto({ ...base, sentido: "dirigido" }), true);
});

// `desconocido` cuenta como abierto a propósito: tratar la ausencia de dato como
// válvula cerrada dejaría el grafo vacío justo mientras se está poblando.
test("desconocido cuenta como abierto; cerrado no", () => {
  const e = { ...base, sentido: "dirigido" };
  assert.equal(enlaceAbierto({ ...e, estado: { valor: "desconocido" } }), true);
  assert.equal(enlaceAbierto({ ...e, estado: { valor: "abierto" } }), true);
  assert.equal(enlaceAbierto({ ...e, estado: { valor: "cerrado" } }), false);
});

test("esBucle detecta la arista de un punto a sí mismo", () => {
  assert.equal(esBucle({ ...base, sentido: "dirigido" }), false);
  assert.equal(
    esBucle({ ...base, idPuntoHasta: "A", sentido: "dirigido" }),
    true,
  );
});
