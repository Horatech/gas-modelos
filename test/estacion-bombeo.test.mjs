import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CommoditySchema,
  CreateEstacionBombeoSchema,
  DivisionSchema,
  EstacionBombeoSchema,
  PuntoMedicionSchema,
  ReporteBombeoSchema,
  ReporteTypesSchema,
  TipoDispositivoGasSchema,
} from "../dist/index.js";

test("enums nuevos", () => {
  assert.ok(CommoditySchema.options.includes("saneamiento"));
  assert.ok(DivisionSchema.options.includes("Estaciones de Bombeo"));
  assert.ok(TipoDispositivoGasSchema.options.includes("UC300"));
  assert.equal(ReporteTypesSchema.safeParse("Bombeo").success, true);
});

test("reporte de bombeo ancho, con ok por canal", () => {
  const r = ReporteBombeoSchema.safeParse({
    timestamp: "2026-09-02T13:23:03.000Z",
    plantilla: "uc300-3b",
    senalAsu: 28,
    salidas: { DO1: false, DO2: false },
    canales: {
      "pozo.nivel_m": { valor: 1.71, ok: false },
      "b1.marcha": { valor: true, ok: true },
    },
  });
  assert.equal(r.success, true);
  assert.equal(ReporteBombeoSchema.safeParse({ timestamp: "x", plantilla: "uc300-3b" }).success, false);
  assert.equal(
    ReporteBombeoSchema.safeParse({ timestamp: "x", plantilla: "p", canales: { a: { valor: "1", ok: true } } }).success,
    false,
  );
});

test("estación con bombas; el alta no acepta calculados", () => {
  const e = {
    nombre: "Pozo Norte",
    idCliente: "c1",
    deveui: "6445F17298620016",
    plantilla: "uc300-3b",
    bombas: [{ numero: 1, esclavoModbus: 2, entradaTestigo: "DI1", modoMando: "ninguno" }],
    ultimoEstado: { "b1.marcha": { valor: true, ok: true, medidoEn: "2026-09-02T13:23:03.000Z" } },
  };
  assert.equal(EstacionBombeoSchema.safeParse(e).success, true);
  const alta = CreateEstacionBombeoSchema.parse(e);
  assert.equal(alta.ultimoEstado, undefined);
  assert.equal(
    EstacionBombeoSchema.safeParse({ bombas: [{ numero: 1, modoMando: "plc" }] }).success,
    false,
  );
});

test("el punto de medición referencia la estación", () => {
  const p = PuntoMedicionSchema.parse({ idEstacionBombeo: "e1", fechaAsignacionEstacionBombeo: "2026-10-05T00:00:00Z" });
  assert.equal(p.idEstacionBombeo, "e1");
});

test("la estación de bombeo es entidad vinculable por deveui", async () => {
  const m = await import("../dist/index.js");
  assert.ok(m.TIPOS_ENTIDAD_VINCULABLE.includes("Estación de Bombeo"));
  assert.ok(m.EntidadesSchema.options.includes("Estación de Bombeo"));
  const meta = m.METADATA_ENTIDADES_VINCULABLES["Estación de Bombeo"];
  assert.deepEqual(meta.divisiones, ["Estaciones de Bombeo"]);
  assert.deepEqual(meta.tiposDispositivo, ["UC300"]);
  assert.equal(meta.campoIdPunto, "idEstacionBombeo");
  assert.equal(m.PuntoMedicionSchema.shape[meta.campoFechaPunto] !== undefined, true);
  assert.equal(m.AlertaSchema.shape[meta.campoAlerta] !== undefined, true);
  assert.equal(m.EstacionBombeoSchema.shape.deveui !== undefined, true);
  assert.equal(m.EstacionBombeoSchema.shape.deveuiRtu, undefined);
});

test("la estación lleva los campos que escribe la vinculación", async () => {
  const m = await import("../dist/index.js");
  const r = m.UpdateEstacionBombeoSchema.safeParse({
    deveui: null,
    fechaAsignacionDispositivo: null,
    estadoActual: "Sin Asignar",
  });
  assert.equal(r.success, true);
  assert.equal(m.EstacionBombeoSchema.safeParse({ estadoActual: "Rota" }).success, false);
});

test("F2: alertas y envíos de bombeo; el punto no se guarda en la estación", async () => {
  const m = await import("../dist/index.js");
  assert.ok(m.TipoAlertaSchema.options.includes("Falla de variador"));
  for (const t of [
    "Estación de bombeo - Falla de variador",
    "Estación de bombeo - Nivel alto",
    "Estación de bombeo - Error de comunicación",
  ]) assert.ok(m.TipoAlertaEnvioSchema.options.includes(t), t);
  assert.equal(m.EstacionBombeoSchema.shape.idPuntoMedicion, undefined);
  assert.equal(m.EstacionBombeoSchema.safeParse({ nivelAlarmaM: 3.5 }).success, true);
});
