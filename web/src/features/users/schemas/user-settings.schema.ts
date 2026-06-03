import { z } from 'zod'
import { UpdatePasswordSchema } from 'feedbackboard-shared'

// ─── Personal Info ────────────────────────────────────────────────────────────
export const ProfileFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  avatarUrl: z.url('URL inválida').optional().or(z.literal('')),
  bio: z.string().max(160, 'Máximo 160 caracteres').optional(),
})

// ─── Contact ──────────────────────────────────────────────────────────────────
export const ContactFormSchema = z.object({
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.url('URL inválida').optional().or(z.literal('')),
})

// ─── Social Links ─────────────────────────────────────────────────────────────
export const SocialLinksFormSchema = z.object({
  twitterHandle: z.string().optional(),
  linkedinHandle: z.string().optional(),
  githubHandle: z.string().optional(),
})

// ─── Change Password ──────────────────────────────────────────────────────────
export const ChangePasswordFormSchema = UpdatePasswordSchema.extend({
  currentPassword: z.string().min(1, 'Ingresa tu contraseña actual'),
  newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type ProfileFormData = z.infer<typeof ProfileFormSchema>
export type ContactFormData = z.infer<typeof ContactFormSchema>
export type SocialLinksFormData = z.infer<typeof SocialLinksFormSchema>
export type ChangePasswordFormData = z.infer<typeof ChangePasswordFormSchema>