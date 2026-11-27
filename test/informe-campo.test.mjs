import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const pedido = (extra) => ({
  tipo: "montaje",
  lecturas: { snSml: "2604270595", serieMedidor: "7100470", lecturaVisor: 21346.198 },
  verificacion: { resultado: "visor_adelante", diferencia: 103.518, margen: 1, ultimaLectura: 21242.68, fecha: "2026-11-27T15:00:00.000Z" },
  comentario: "Falta la chapa de bloqueo",
  idDispositivo: "a".repeat(24), idMedidorResidencial: "b".repeat(24), idPuntoMedicion: "c".repeat(24),
  ...extra,
});
const bloque = (p) => ({ id: "b1", tipo: "informe-campo", titulo: "Informar", version: 1, pedido: p, descripcion: "x" });

test("bloque informe-campo: valida y rechaza", () => {
  assert.ok(m.BloqueAsistenteSchema.safeParse(bloque(pedido())).success);
  assert.ok(m.TIPOS_BLOQUE_ASISTENTE.includes("informe-campo"));
  assert.deepEqual([...m.TIPOS_INFORME_CAMPO], ["montaje", "emisor", "sml_de_otro_medidor", "valor_inicial", "otro"]);
  assert.ok(!m.BloqueAsistenteSchema.safeParse(bloque(pedido({ tipo: "x" }))).success);
  assert.ok(!m.BloqueAsistenteSchema.safeParse(bloque(pedido({ comentario: "a".repeat(1001) }))).success);
  // Sin verificación (tipo otro o resultado coincide) también vale.
  assert.ok(m.BloqueAsistenteSchema.safeParse(bloque(pedido({ tipo: "otro", verificacion: undefined }))).success);
  assert.ok(m.CreateInformeCampoSchema.safeParse({ pedido: pedido(), imagen: { tipo: "image/jpeg", datos: "AAAA" } }).success);
  assert.ok(m.CreateInformeCampoSchema.safeParse({ pedido: pedido() }).success);
});

test("describirInformeCampo", () => {
  assert.equal(
    m.describirInformeCampo(pedido(), { punto: "8400008090900428621" }),
    "Informe de campo: montaje · SML 2604270595 · medidor 7100470 · 8400008090900428621",
  );
  assert.equal(m.describirInformeCampo(pedido({ tipo: "emisor", lecturas: {} }), {}), "Informe de campo: emisor del medidor");
});
