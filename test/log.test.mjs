/**
 * `ILog` es la base de todos los logs que vengan. Estos tests fijan lo que no
 * puede romperse al agregar un tipo nuevo: el discriminante elige la variante,
 * `raw` vive en la base (no en `datos`) y un tipo desconocido se rechaza en vez
 * de entrar como documento suelto.
 *
 * Corre con el runner nativo de Node contra `dist/`, igual que los demás tests
 * del repo. Requiere `npm run build` antes (el script `test` ya lo encadena).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { LogSchema, CreateLogSchema } = require("../dist/index.js");

const contactoNfc = {
  tipo: "NFC",
  fecha: "2026-09-22T13:00:00.000Z",
  idIdempotencia: "3f9a1c7e-0000-4000-8000-000000000001",
  origen: { sistema: "gas-mobile", instancia: "a1b2c3d4e5f6", version: "1.6.0" },
  device: { deveui: "c4cd8276504e04a3" },
  ubicacion: { lat: -32.89, lng: -68.84, precision: 12 },
  resultado: "ok",
  raw: "═══ lectura ML107A\n  · +00.12s READ 0x09\n",
  datos: {
    tag: { uid: "04a1b2c3", atqa: "4400", sak: "20", techList: ["IsoDep", "NfcA"] },
    telefono: { fabricante: "samsung", modelo: "SM-A155M", versionSo: "16" },
    transceives: [
      { seq: 1, offsetMillis: 120, tipo: "TX", op: "READ 0x09", tx: "3009", rx: "c4cd8200", ms: 290 },
    ],
  },
};

test("el discriminante NFC parsea un contacto completo", () => {
  const r = LogSchema.safeParse(contactoNfc);
  assert.equal(r.success, true, JSON.stringify(r.error?.issues));
  assert.equal(r.data.tipo, "NFC");
  assert.equal(r.data.datos.transceives[0].op, "READ 0x09");
});

test("raw es de la base, no del discriminante: sobrevive sin datos", () => {
  const sinDatos = { ...contactoNfc };
  delete sinDatos.datos;
  const r = LogSchema.safeParse(sinDatos);
  assert.equal(r.success, true);
  assert.equal(r.data.raw.includes("lectura ML107A"), true);
});

test("un tipo que no existe se rechaza", () => {
  const r = LogSchema.safeParse({ ...contactoNfc, tipo: "BLE" });
  assert.equal(r.success, false);
});

test("el create no acepta _id ni fechaRecepcion", () => {
  const r = CreateLogSchema.safeParse({
    ...contactoNfc,
    _id: "68c00000000000000000000a",
    fechaRecepcion: "2026-09-22T13:00:01.000Z",
  });
  assert.equal(r.success, true);
  assert.equal("_id" in r.data, false, "el _id no puede entrar por el body");
  assert.equal("fechaRecepcion" in r.data, false, "la fechaRecepcion la pone el server");
});
