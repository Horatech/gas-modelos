import { test } from "node:test";
import assert from "node:assert/strict";
import { EnvioPushSchema, TokenPushSchema, TipoAlertaEnvioSchema } from "../dist/index.js";

test("alerta válida", () => {
  const r = EnvioPushSchema.safeParse({
    idsUsuarios: ["u1"],
    idCliente: "c1",
    tipo: "alerta",
    alerta: { tipoAlerta: "Unidades Presión - Fuera de límite", idPuntoMedicion: "p1", nombrePunto: "ERM Norte", valor: 3.2, unidad: "BAR" },
  });
  assert.equal(r.success, true);
});

test("alerta sin bloque alerta falla", () => {
  const r = EnvioPushSchema.safeParse({ idsUsuarios: ["u1"], idCliente: "c1", tipo: "alerta" });
  assert.equal(r.success, false);
});

test("los cinco códigos viejos son tipoAlerta", () => {
  for (const t of ["Correctora sin Reportar", "Error de Comunicación con la Correctora", "Cromatografía Próxima a Vencer", "Fallo en Aplicación de Cromatografía", "Medidores Residenciales - Sensor desconectado"]) {
    assert.ok(TipoAlertaEnvioSchema.options.includes(t), t);
  }
});

test("token por dispositivo", () => {
  assert.equal(TokenPushSchema.safeParse({ idDispositivo: "d1", token: "t", plataforma: "web", fechaAlta: "2026-09-11T00:00:00Z" }).success, true);
  assert.equal(TokenPushSchema.safeParse({ token: "t", plataforma: "web" }).success, false);
});
