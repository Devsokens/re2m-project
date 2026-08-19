import { z } from 'zod';

export const emailTemplateSettingSchema = z.object({
  enabled: z.boolean(),
  subject: z.string().min(1),
  body: z.string().min(1)
});

export const settingsInputSchema = z.object({
  cabinetName: z.string().min(1),
  senderEmail: z.string().email(),
  emailTemplates: z.object({
    accuse: emailTemplateSettingSchema,
    refus: emailTemplateSettingSchema,
    rdv: emailTemplateSettingSchema
  }),
  notifications: z.object({
    newRequest: z.boolean(),
    newTestimonial: z.boolean()
  }),
  certificateStampUrl: z.string().optional().default(''),
  certificateDefaultTemplate: z.enum(['re2m-classique', 'moderne', 'corporate'])
});
