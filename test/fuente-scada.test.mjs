/**
 * Fuentes SCADA de un cliente y cómo se identifica a qué servidor pertenece un tag
 * (gas/PLAN-MULTI-FUENTE-SCADA.md).
 *
 * Corre con el runner nativo de Node contra `dist/` (npm test hace el build antes).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const CAMUZZI = [
  { alias: "FIX", porDefecto: true },
  { alias: "FIX02", porDefecto: false },
];
const TAG = "BAC_TAN_PRC_041001RODRIGUEZYPARANA_REC_CICON";

test("la notación de iFIX de la fuente por defecto se guarda como tag base", () => {
  for (const entrada of [TAG, `${TAG}.F_CV`, `FIX.${TAG}`, `FIX.${TAG}.F_CV`, `  ${TAG} `]) {
    assert.deepEqual(m.normalizarTagScada(entrada, CAMUZZI), { ok: true, tag: TAG }, entrada);
  }
});

test("el tag de otra fuente se guarda calificado con su alias", () => {
  for (const entrada of [`FIX02.${TAG}`, `FIX02.${TAG}.F_CV`]) {
    assert.deepEqual(
      m.normalizarTagScada(entrada, CAMUZZI),
      { ok: true, tag: `FIX02.${TAG}`, fuente: "FIX02" },
      entrada,
    );
  }
});

test("un alias que no es fuente del cliente se rechaza", () => {
  const r = m.normalizarTagScada(`FIX03.${TAG}`, CAMUZZI);
  assert.equal(r.ok, false);
  assert.equal(r.error, "FUENTE_DESCONOCIDA");
  // Sin fuentes declaradas, sólo se acepta el tag sin prefijo.
  assert.equal(m.normalizarTagScada(`FIX.${TAG}`, []).error, "FUENTE_DESCONOCIDA");
  assert.deepEqual(m.normalizarTagScada(TAG, []), { ok: true, tag: TAG });
});

test("formatos que no son TAG ni FUENTE.TAG se rechazan", () => {
  for (const entrada of ["A.B.C", ".TAG", "FIX02.", "FIX02..TAG", "F_CV", "FIX02. TAG"]) {
    assert.equal(m.normalizarTagScada(entrada, CAMUZZI).error, "FORMATO", entrada);
  }
  assert.equal(m.normalizarTagScada("   ", CAMUZZI).error, "VACIO");
});

test("sólo corta por el punto: los caracteres de los tags de producción pasan", () => {
  for (const tag of ["BAC_OLA_ERP_60-25_TP_PS", "CMH_NQN_GI_GNCC&S_UC_PS", "CMH_NQN_ERP_CHAÑAR_UC_PE"]) {
    assert.deepEqual(m.normalizarTagScada(tag, CAMUZZI), { ok: true, tag });
    assert.deepEqual(m.normalizarTagScada(`FIX02.${tag}`, CAMUZZI), {
      ok: true,
      tag: `FIX02.${tag}`,
      fuente: "FIX02",
    });
  }
});

test("cada tag guardado pertenece a una sola fuente", () => {
  const guardados = [TAG, `FIX02.${TAG}`, "CMH_NQN_ERP_CHAÑAR_UC_PE"];
  for (const t of guardados) {
    const de = [undefined, "FIX02"].filter((f) => m.esTagDeFuenteScada(t, f));
    assert.equal(de.length, 1, t);
  }
  assert.equal(m.esTagDeFuenteScada(TAG), true);
  assert.equal(m.esTagDeFuenteScada(TAG, ""), true);
  assert.equal(m.esTagDeFuenteScada(`FIX02.${TAG}`, "FIX02"), true);
  assert.equal(m.esTagDeFuenteScada(`FIX02.${TAG}`), false);
});

test("partir y calificar son inversas", () => {
  assert.deepEqual(m.partirTagScada(`FIX02.${TAG}`), { fuente: "FIX02", tag: TAG });
  assert.deepEqual(m.partirTagScada(TAG), { tag: TAG });
  for (const t of [TAG, `FIX02.${TAG}`]) {
    const { fuente, tag } = m.partirTagScada(t);
    assert.equal(m.calificarTagScada(tag, fuente), t);
  }
});

test("FuenteScadaSchema: el alias no admite el separador", () => {
  const base = { idCliente: "x", porDefecto: false, inst: "r03-fix02", protocolo: "opcua", perfilNodeId: "ifix" };
  assert.equal(m.FuenteScadaSchema.safeParse({ ...base, alias: "FIX02" }).success, true);
  assert.equal(m.FuenteScadaSchema.safeParse({ ...base, alias: "FIX.02" }).success, false);
  assert.equal(m.FuenteScadaSchema.safeParse({ ...base, alias: "FIX 02" }).success, false);
});
