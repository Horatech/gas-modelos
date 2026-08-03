import { FuenteClima } from "./registro-clima";

/**
 * Serie climatica HISTORICA por celda de grilla (INSIDEht 2.0 — grados-dia).
 *
 * A diferencia de `IRegistroClima` —que es la serie de PRESENTE (actual + pronostico)
 * de OpenWeatherMap y vive en Mongo (`registroclimas`)— la serie historica vive en un
 * **store propio de `gas-api-clima` (PostgreSQL dedicado)** y NO pasa por `gas-datos`.
 *
 * El motivo no es de performance: **este dataset no tiene tenant.** Es geodato publico
 * de referencia (reanalisis ERA5-Land del Copernicus CDS), sin `idCliente`, sin permisos
 * y sin ciclo de vida ligado a un cliente. La regla "todo acceso a DB pasa por gas-datos"
 * gobierna datos de tenant, no esto.
 *
 * Lo que se declara aca es SOLO la superficie que cruza el borde de la API: el
 * identificador de celda que se guarda en la Localidad y el DTO de lectura del diario.
 * El esquema de las tablas (horario en buckets mensuales, diario, normal) vive en las
 * migraciones de `gas-api-clima`.
 *
 * Plan: `PLAN-GRADOS-DIA.md`.
 */

/**
 * Celda de la grilla ERA5-Land (0,1° ≈ 9 km) a la que pertenece una Localidad.
 *
 * La clave es DETERMINISTA a partir del centroide —redondeo a 0,1°— asi que no hace
 * falta ninguna consulta espacial (ni PostGIS) para resolverla. Es tambien lo que hace
 * que el store crezca de forma sublineal: **varias Localidades comparten celda y la
 * serie se guarda una sola vez**. Medido sobre las 395 Localidades con centroide de
 * PROD: 353 celdas unicas (10,6% de dedup).
 *
 * Lo escribe `gas-api-clima` al resolver la celda de cada Localidad.
 */
export interface IGridEra5 {
  /** Identificador de la celda efectivamente usada. Formato: `S3450_W05880`. */
  clave: string;

  /** Centro de la celda usada, en grados. */
  lat: number;
  lon: number;

  /**
   * `true` si la celda del centroide cayo en MAR y hubo que caer a una vecina.
   *
   * ERA5-Land es **solo tierra**: una localidad costera puede tener su celda enmascarada.
   * Medido en PROD: 11 de 353 celdas (3,1%) — Mar del Plata, Comodoro Rivadavia, Ushuaia,
   * Necochea, Miramar, Punta Alta, Monte Hermoso, Camarones, Puerto San Julian, Puerto
   * Santa Cruz y Cte. Piedrabuena. Las 11 se resolvieron con la celda contigua (6,4 a
   * 11,1 km).
   *
   * **No es un detalle interno: se muestra.** El dato de esas Localidades viene de un
   * punto desplazado y quien lo lee tiene que poder saberlo.
   */
  esFallback?: boolean;

  /** Celda originalmente pedida, cuando `esFallback` es `true`. */
  claveOriginal?: string;

  /** Distancia entre el centroide de la Localidad y el centro de la celda usada (km). */
  distanciaKm?: number;
}

/**
 * Un dia de la serie historica de una celda, tal como lo devuelve `gas-api-clima`.
 * NO es una entidad de Mongo: es el DTO de lectura del store historico.
 *
 * El dia es el **DIA-GAS** (arranca 10:00 UTC = 07:00 AR), igual que
 * `IResumenDiarioLocalidad.fecha` y que el resto del dominio gas. Si el clima y el
 * consumo usaran cortes distintos, la correlacion entre ambos se emborrona.
 * Efecto colateral asumido: estos grados-dia **no coinciden exactamente** con los que
 * publican ENARGAS o el SMN, que usan dia calendario.
 */
export interface IClimaDiarioCelda {
  clave: string;
  fecha: string; // ISO UTC — inicio del dia-gas

  // Agregados del dia, calculados sobre la serie HORARIA (unidades canonicas)
  temperaturaMedia?: number; // °C
  temperaturaMin?: number; // °C
  temperaturaMax?: number; // °C
  sensacionTermicaMedia?: number; // °C — wind chill
  vientoVelocidadMedia?: number; // m/s
  humedadMedia?: number; // %
  radiacionMedia?: number; // W/m2

  /**
   * Horas del dia con dato (24 = dia completo). **Es el gate de calidad**: por debajo
   * de 20 horas el dia queda fuera de la regresion y de la normal. Un dia con 6 muestras
   * produce un HDD que parece un numero y no lo es.
   */
  horas?: number;

  /**
   * Grados-dia de calefaccion, indexados por temperatura BASE en °C: `{ "18": 9.4 }`.
   *
   * Se publica un VECTOR y no un escalar a proposito. La base no es una constante
   * universal: 18,3 °C es solo la conversion de los 65 °F del default estadounidense,
   * IRAM 11603 usa 18/20/22 y la base optima real varia por segmento (Meng & Mourshed:
   * 11,6-20,5 °C). Guardar el vector permite **recalibrar la base sin releer el
   * historico ni volver a pegarle al proveedor**.
   *
   * Calculados por **integracion horaria** —`Σ_h max(0, base − T_h) / 24`—, no por
   * `(Tmax+Tmin)/2`: el metodo de la media subestima cuando la temperatura cruza la base
   * durante el dia, que es justo lo que pasa en media estacion.
   *
   * ⚠️ **No se promedian entre Localidades.** `max(0, base − T)` es convexa, asi que por
   * Jensen el promedio de los HDD es MAYOR que el HDD de la temperatura promedio: calcular
   * el HDD de un CO o una UN a partir de una temperatura promediada lo subestima de forma
   * sistematica. Se calcula por celda y recien despues se agrega, **ponderando por carga**
   * (cantidad de medidores), nunca de forma aritmetica. Sumar sobre el TIEMPO (acumulado
   * de la temporada) si es valido; sumar sobre el ESPACIO no significa nada.
   */
  gradosDia?: Record<string, number>;

  /** Idem `gradosDia` pero sobre la sensacion termica. Relevante en Patagonia ventosa. */
  gradosDiaEfectivos?: Record<string, number>;

  /**
   * Temperatura efectiva: `0,5·T(d) + 0,5·T_ef(d−1)`. Modela la inercia termica de los
   * edificios. En el modelo de demanda de ENARGAS (2020) es la variable mas predictiva
   * —**86% de la influencia**, contra 4% de la temperatura del dia—, por lejos.
   * Los coeficientes son los del mercado britanico y **hay que recalibrarlos** con datos
   * locales; el principio fisico es universal, los numeros no.
   */
  temperaturaEfectiva?: number; // °C

  /**
   * Dias consecutivos de helada (`temperaturaMin <= 0`) hasta este dia, inclusive.
   * Insumo de integridad de cañeria: el daño por congelamiento depende del frio
   * SOSTENIDO, no de la minima de un dia suelto.
   */
  heladaConsecutivos?: number;

  /**
   * `false` mientras el dato provenga de ERA5-Land-T (near-real-time, ~5 dias de atraso,
   * **sin control de calidad**). El consolidado sale 2-3 meses despues y **los valores
   * cambian**: hay un job que re-ingesta la ventana movil de los ultimos 3 meses.
   * Sin este flag, el HDD reciente discreparia en silencio del historico.
   */
  consolidado?: boolean;

  fuente?: FuenteClima;
}
