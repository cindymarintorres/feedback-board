import { z } from "zod";

export const Roles = ["ADMIN", "MEMBER", "COMMERCE_ADMIN"] as const;

export const UserRoleSchema = z.enum(Roles, {
  message: "Rol de usuario inválido",
});
export const UserRoleValues = UserRoleSchema.enum;

export const PublicUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  role: UserRoleSchema,
  avatarUrl: z.string().nullish(),
  bio: z.string().nullish(),
  phone: z.string().nullish(),
  location: z.string().nullish(),
  website: z.string().nullish(),
  twitterHandle: z.string().nullish(),
  linkedinHandle: z.string().nullish(),
  githubHandle: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateUserSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email().toLowerCase(),
  password: z.string().min(6),
});

export const UpdateUserSchema = z
  .object({
    name: z.string().trim().min(2).optional(),
    avatarUrl: z.url().optional().or(z.literal("")),
    bio: z.string().max(160).optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.url().optional().or(z.literal("")),
    twitterHandle: z.string().optional(),
    linkedinHandle: z.string().optional(),
    githubHandle: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar",
  });

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const AdminResetPasswordSchema = z.object({
  newPassword: z.string().min(6),
})

export const JwtPayloadSchema = z.object({
  id: z.string(),
  email: z.email(),
  role: UserRoleSchema,
});

export const JwtUserSchema = JwtPayloadSchema.extend({
  name: z.string().min(2),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
export type JwtUser = z.infer<typeof JwtUserSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;
export type AdminResetPasswordDto = z.infer<typeof AdminResetPasswordSchema>;
