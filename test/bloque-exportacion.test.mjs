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

const rep = (extra) => ({
  export: "reportes", division: "Residencial", desde: "2026-11-01T10:00:00.000Z", hasta: "2026-11-27T09:59:59.999Z",
  agrupacionTemporal: "dia", conjunto: { idUnidadNegocio: "6".repeat(24) }, ...extra,
});

test("bloque exportacion: reportes e indicadores", () => {
  assert.ok(m.BloqueAsistenteSchema.safeParse(bloque(rep())).success);
  assert.ok(m.BloqueAsistenteSchema.safeParse(bloque(rep({ division: "Presión", conjunto: { idsPunto: ["a"] } }))).success);
  // La API de reportes no resuelve zonas de calidad.
  assert.ok(!m.BloqueAsistenteSchema.safeParse(bloque(rep({ conjunto: { idCuenca: "a" } }))).success);
  assert.ok(!m.BloqueAsistenteSchema.safeParse(bloque(rep({ division: "Correctoras" }))).success);
  assert.ok(!m.BloqueAsistenteSchema.safeParse(bloque(rep({ hasta: "2027-12-01T09:59:59.999Z" }))).success);
  assert.ok(m.BloqueAsistenteSchema.safeParse(bloque({ export: "indicadores", filtros: { divisiones: ["Correctoras"] } })).success);
  assert.deepEqual([...m.DIVISIONES_REPORTES], ["Residencial", "Presión", "Residencial Agua", "Dispositivo Externo NUC"]);
});

test("describirExportacion: reportes e indicadores", () => {
  assert.equal(
    m.describirExportacion(rep(), { conjunto: "unidad de negocio Chubut", cantidadPuntos: 40 }),
    "Reportes de Residencial por día, del 01/11/2026 al 26/11/2026 (días gas), de 40 puntos: unidad de negocio Chubut",
  );
  assert.equal(
    m.describirExportacion({ export: "indicadores", filtros: { divisiones: ["Correctoras", "Presión"] } }, { conjunto: "unidad de negocio Mar del Plata", cantidadPuntos: 300 }),
    "Indicadores de unidades de negocio (300 puntos) · Correctoras · Presión · unidad de negocio Mar del Plata",
  );
  assert.equal(
    m.describirExportacion({ export: "indicadores", filtros: {} }, { cantidadPuntos: 1 }),
    "Indicadores de unidades de negocio (1 punto) · todas las divisiones",
  );
});
