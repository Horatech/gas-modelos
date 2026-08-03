import { z } from "zod";

export const TipoDispositivoFirmwareSchema = z.enum(["NSP", "NUC", "NME"]);
export type TipoDispositivoFirmware = z.infer<typeof TipoDispositivoFirmwareSchema>;

export const VersionHardwareSchema = z.enum(["v1.0", "v1.1", "v2.0"]);
export type VersionHardware = z.infer<typeof VersionHardwareSchema>;

export const FirmwareSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  version: z.string().optional(),
  versionHardware: VersionHardwareSchema.optional(),
  dispositivo: TipoDispositivoFirmwareSchema.optional(),
  archivo: z.string().optional(),
});
export type IFirmware = z.infer<typeof FirmwareSchema>;

// CREATE
export const CreateFirmwareSchema = FirmwareSchema.omit({ _id: true });
export type ICreateFirmware = z.infer<typeof CreateFirmwareSchema>;

// UPDATE
export const UpdateFirmwareSchema = FirmwareSchema.omit({ _id: true });
export type IUpdateFirmware = z.infer<typeof UpdateFirmwareSchema>;
