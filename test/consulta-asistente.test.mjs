import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

test("sugerencias: hasta 3, de 3 a 80 caracteres, sin repetir", () => {
  const ok = ["Mostrame los registros de hoy", "Graficá la última semana"];
  assert.deepEqual(m.SugerenciasAsistenteSchema.parse(ok), ok);
  assert.deepEqual(m.SugerenciasAsistenteSchema.parse(["  Seguila en vivo  "]), ["Seguila en vivo"]);
  assert.equal(m.SugerenciasAsistenteSchema.safeParse(["a", "b", "c", "d"].map((x) => x.repeat(5))).success, false);
  assert.equal(m.SugerenciasAsistenteSchema.safeParse(["no"]).success, false);
  assert.equal(m.SugerenciasAsistenteSchema.safeParse(["x".repeat(81)]).success, false);
  assert.equal(m.SugerenciasAsistenteSchema.safeParse(["Seguila en vivo", "seguila en vivo"]).success, false);
});

test("la consulta acepta sugerencias y sigue valiendo sin ellas", () => {
  const base = { idCliente: "c", idUsuario: "u", idConversacion: "k", pregunta: "¿?", resultado: "ok" };
  assert.equal(m.ConsultaAsistenteSchema.safeParse(base).success, true);
  assert.equal(m.ConsultaAsistenteSchema.safeParse({ ...base, sugerencias: ["Seguila en vivo"] }).success, true);
  assert.equal(m.ConsultaAsistenteSchema.safeParse({ ...base, sugerencias: ["ok"] }).success, false);
});

test("conversación del listado", () => {
  const c = { idConversacion: "k", titulo: "Presiones", inicio: "2026-11-05T11:00:00.000Z", ultima: "2026-11-05T11:30:00.000Z", turnos: 3, conSeguimiento: true };
  assert.deepEqual(m.ConversacionAsistenteSchema.parse(c), c);
  assert.equal(m.ConversacionAsistenteSchema.safeParse({ ...c, turnos: 0 }).success, false);
});

test("pedido del listado: limit de la query como número, con tope", () => {
  assert.deepEqual(m.PedidoConversacionesAsistenteSchema.parse({ limit: "20" }), { limit: 20 });
  assert.deepEqual(m.PedidoConversacionesAsistenteSchema.parse({}), {});
  assert.equal(m.PedidoConversacionesAsistenteSchema.safeParse({ limit: String(m.MAX_CONVERSACIONES_ASISTENTE + 1) }).success, false);
  assert.equal(m.PedidoConversacionesAsistenteSchema.safeParse({ limit: "0" }).success, false);
});
