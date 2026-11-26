import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const reg = (extra) => ({
  export: "registros", desde: "2026-11-01T10:00:00.000Z", hasta: "2026-11-27T09:59:59.999Z",
  agrupacionTemporal: "hora", conjunto: { idGrupo: "6".repeat(24) }, ...extra,
});
const bloque = (pedido) => ({
  id: "b1", tipo: "exportacion", titulo: "Exportar", version: 1, pedido,
  descripcion: "x", cantidadPuntos: 32, nombreArchivo: "Registros.xlsx",
});

test("bloque exportacion: valida y rechaza", () => {
  assert.ok(m.BloqueAsistenteSchema.safeParse(bloque(reg())).success);
  assert.ok(m.TIPOS_BLOQUE_ASISTENTE.includes("exportacion"));
  assert.ok(!m.BloqueAsistenteSchema.safeParse(bloque(reg({ conjunto: { idGrupo: "a", idLocalidad: "b" } }))).success);
  assert.ok(!m.BloqueAsistenteSchema.safeParse(bloque(reg({ conjunto: {} }))).success);
  assert.ok(!m.BloqueAsistenteSchema.safeParse(bloque(reg({ conjunto: { idsPunto: [] } }))).success);
  assert.ok(!m.BloqueAsistenteSchema.safeParse(bloque(reg({ hasta: "2027-12-01T09:59:59.999Z" }))).success);
  assert.ok(!m.BloqueAsistenteSchema.safeParse(bloque(reg({ hasta: "2026-10-01T09:59:59.999Z" }))).success);
  assert.ok(m.BloqueAsistenteSchema.safeParse(bloque({ export: "padron", filtros: { divisiones: ["Residencial"] }, preset: "operaciones" })).success);
  assert.ok(!m.BloqueAsistenteSchema.safeParse(bloque({ export: "padron", filtros: {}, preset: "otro" })).success);
});

test("describirExportacion", () => {
  assert.equal(
    m.describirExportacion(reg(), { conjunto: "grupo Grandes Clientes", cantidadPuntos: 32 }),
    "Registros de correctoras por hora, del 01/11/2026 al 26/11/2026 (días gas), de 32 puntos: grupo Grandes Clientes",
  );
  assert.equal(
    m.describirExportacion(reg({ agrupacionTemporal: "dia", conjunto: { idsPunto: ["a"] } }), { cantidadPuntos: 1 }),
    "Registros de correctoras por día, del 01/11/2026 al 26/11/2026 (días gas), de 1 punto",
  );
  assert.equal(
    m.describirExportacion(
      { export: "padron", filtros: { divisiones: ["Residencial"], estados: ["Sin Reportar"] }, preset: "operaciones" },
      { cantidadPuntos: 120 },
    ),
    "Padrón de 120 puntos (columnas: operaciones) · Residencial · Sin Reportar",
  );
  assert.deepEqual([...m.PRESETS_PADRON], ["padron-minimo", "operaciones", "comercial", "ente", "todo"]);
});
