import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

test("canales de clima: los cuatro del gráfico, en el catálogo, de ambiente y estimados", () => {
  assert.deepEqual(m.CANALES_CLIMA, [
    "registroclimas/Clima#temperatura",
    "registroclimas/Clima#sensacionTermica",
    "registroclimas/Clima#viento.velocidad",
    "registroclimas/Clima#presionAtmosferica",
  ]);
  for (const c of m.CANALES_CLIMA) {
    const d = m.descriptorDe(c);
    assert.ok(d, `sin descriptor: ${c}`);
    assert.equal(d.dominio, "ambiente");
    assert.equal(d.commodity, "na");
    assert.equal(d.naturaleza, "estimado");
    assert.equal(d.emitido, true);
    assert.equal(d.divisionRequerida, undefined);
    assert.ok(m.esCanalClima(c));
  }
  assert.equal(m.descriptorDe("registroclimas/Clima#viento.velocidad").quantityKind, "velocidad");
  assert.equal(m.descriptorDe("registroclimas/Clima#presionAtmosferica").unidadCanonica, "hPa");
});

test("clima no publica dirección del viento ni humedad", () => {
  assert.equal(m.descriptorDe("registroclimas/Clima#viento.direccion"), undefined);
  assert.equal(m.descriptorDe("registroclimas/Clima#humedad"), undefined);
  assert.equal(m.esCanalClima("registros/NUC#temperatura"), false);
});

test("pedido de series de clima: Localidad o Centro Operativo, nunca Unidad de Negocio", () => {
  const item = (nivel) => ({ canal: "registroclimas/Clima#temperatura", ambito: { nivel, id: "x" } });
  const base = { desde: "2026-10-01T00:00:00Z", hasta: "2026-10-02T00:00:00Z" };
  assert.ok(m.PedidoSeriesClimaSchema.safeParse({ ...base, items: [item("Localidad")] }).success);
  assert.ok(m.PedidoSeriesClimaSchema.safeParse({ ...base, items: [item("CentroOperativo")] }).success);
  assert.equal(m.PedidoSeriesClimaSchema.safeParse({ ...base, items: [item("UnidadNegocio")] }).success, false);
  assert.equal(m.PedidoSeriesClimaSchema.safeParse({ ...base, items: [] }).success, false);
  assert.equal(
    m.PedidoSeriesClimaSchema.safeParse({
      ...base,
      items: [{ canal: "registros/NUC#temperatura", ambito: { nivel: "Localidad", id: "x" } }],
    }).success,
    false,
    "un canal que no es de clima no se pide por ámbito",
  );
});

test("preset: una serie de clima guarda su ámbito", () => {
  const r = m.SeriePresetSchema.safeParse({
    canal: "registroclimas/Clima#temperatura",
    ambito: { nivel: "CentroOperativo", id: "co1" },
    visible: true,
  });
  assert.ok(r.success);
  assert.deepEqual(r.data.ambito, { nivel: "CentroOperativo", id: "co1" });
});
