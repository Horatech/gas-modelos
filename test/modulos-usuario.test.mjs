/**
 * Módulos por usuario (`IUsuario.modulos`) y el módulo de linepack del cliente.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

test("el usuario guarda sus módulos y ausente vale", () => {
  const modulos = { navegacion: true, linepack: false, clima: true };
  assert.deepEqual(m.UsuarioSchema.parse({ modulos }).modulos, modulos);
  assert.equal(m.UsuarioSchema.parse({}).modulos, undefined);
  assert.equal(m.ModulosUsuarioSchema.safeParse({ navegacion: "si" }).success, false);
});

test("alta y edición del usuario aceptan los módulos", () => {
  const modulos = { navegacion: true };
  assert.deepEqual(m.CreateUsuarioSchema.parse({ username: "u", permisos: [], modulos }).modulos, modulos);
  assert.deepEqual(m.UpdateUsuarioSchema.parse({ modulos }).modulos, modulos);
});

test("el cliente tiene el módulo de linepack", () => {
  const config = m.ConfigClienteSchema.parse({ moduloLinepack: { activo: true } });
  assert.deepEqual(config.moduloLinepack, { activo: true });
});
