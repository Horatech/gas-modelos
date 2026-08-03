import { z } from "zod";
import { ClienteSchema } from "../tenant/cliente.model";
import { DispositivoSchema } from "./dispositivo";
import {
  FirmwareSchema,
  TipoDispositivoFirmwareSchema,
  VersionHardwareSchema,
} from "./firmware";

export const FirmwarePorEntidadSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idDispositivo: z.string().optional(),
  idFirmware: z.string().optional(),
  tipo: TipoDispositivoFirmwareSchema.optional(),
  versionHardware: VersionHardwareSchema.optional(),
  fechaCreacion: z.string().optional(),
  version: z.string().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  dispositivo: DispositivoSchema.optional(),
  firmware: FirmwareSchema.optional(),
});
export type IFirmwarePorEntidad = z.infer<typeof FirmwarePorEntidadSchema>;

// CREATE / UPDATE
const omitir = {
  _id: true,
  cliente: true,
  dispositivo: true,
  firmware: true,
  fechaCreacion: true,
} as const;

export const CreateFirmwarePorEntidadSchema = FirmwarePorEntidadSchema.omit(omitir);
export type ICreateFirmwarePorEntidad = z.infer<typeof CreateFirmwarePorEntidadSchema>;

export const UpdateFirmwarePorEntidadSchema = FirmwarePorEntidadSchema.omit(omitir);
export type IUpdateFirmwarePorEntidad = z.infer<typeof UpdateFirmwarePorEntidadSchema>;
