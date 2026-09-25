/**
 * El árbol de navegación: orden, poda y descendencia. Es lógica pura que
 * consumen gas-api-cliente (el árbol que ve cada usuario, la validación de
 * mover) y gas-datos (el borrado en cascada), así que se fija acá.
 *
 * Corre con el runner nativo de Node contra `dist/`. `npm test` ya encadena
 * el build.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { armarArbol, descendientesDe } = require("../dist/index.js");

const nodo = (id, idPadre, tipo, orden = 0, nombre = id) => ({
  _id: id,
  idPadre,
  tipo,
  orden,
  nombre,
  idCliente: "c1",
});

const nombres = (arbol) =>
  arbol.map((n) => (n.hijos.length ? [n.nombre, nombres(n.hijos)] : n.nombre));

test("ordena por orden y, a igual orden, por nombre", () => {
  const arbol = armarArbol([
    nodo("b", null, "entrada", 1),
    nodo("a", null, "entrada", 1),
    nodo("z", null, "entrada", 0),
  ]);
  assert.deepEqual(nombres(arbol), ["z", "a", "b"]);
});

test("poda las carpetas sin entradas, también las anidadas", () => {
  const arbol = armarArbol([
    nodo("vacia", null, "carpeta"),
    nodo("con", null, "carpeta", 1),
    nodo("sub-vacia", "con", "carpeta"),
    nodo("e1", "con", "entrada", 1),
  ]);
  assert.deepEqual(nombres(arbol), [["con", ["e1"]]]);
});

test("sin podar conserva las carpetas vacías (editor)", () => {
  const arbol = armarArbol([nodo("vacia", null, "carpeta")], { podar: false });
  assert.deepEqual(nombres(arbol), ["vacia"]);
});

test("un nodo cuyo padre no vino no aparece, ni sube a la raíz", () => {
  const arbol = armarArbol([
    nodo("e1", "padre-invisible", "entrada"),
    nodo("e2", null, "entrada"),
  ]);
  assert.deepEqual(nombres(arbol), ["e2"]);
});

test("los hijos de una entrada no se muestran", () => {
  const arbol = armarArbol([
    nodo("e1", null, "entrada"),
    nodo("colgado", "e1", "entrada"),
  ]);
  assert.deepEqual(arbol[0].hijos, []);
});

test("un ciclo sin raíz no cuelga y no aparece", () => {
  const arbol = armarArbol([nodo("a", "b", "carpeta"), nodo("b", "a", "carpeta")]);
  assert.deepEqual(arbol, []);
});

test("compara ids como string (ObjectId de Mongo)", () => {
  const oid = (s) => ({ toString: () => s });
  const arbol = armarArbol([
    { ...nodo("x", null, "carpeta"), _id: oid("x") },
    { ...nodo("e", null, "entrada"), idPadre: oid("x") },
  ]);
  assert.equal(arbol[0].hijos.length, 1);
});

test("descendientesDe junta toda la rama sin el propio nodo", () => {
  const nodos = [
    nodo("r", null, "carpeta"),
    nodo("a", "r", "carpeta"),
    nodo("b", "a", "entrada"),
    nodo("otro", null, "entrada"),
  ];
  assert.deepEqual([...descendientesDe(nodos, "r")].sort(), ["a", "b"]);
});

test("descendientesDe termina aunque haya un ciclo", () => {
  const nodos = [nodo("a", "b", "carpeta"), nodo("b", "a", "carpeta")];
  assert.deepEqual([...descendientesDe(nodos, "a")].sort(), ["b"]);
});
