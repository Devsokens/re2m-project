import { z } from 'zod';

export const newsletterSubscribeSchema = z.object({
  email: z.string().email()
});

export const newsletterCampaignInputSchema = z.object({
  subject: z.string().min(1),
  bodyHtml: z.string().min(1)
});
