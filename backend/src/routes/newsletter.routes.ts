import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth, requirePermission, requireRole } from '../middleware/auth.js';
import { listCampaigns, sendCampaign, subscribe, subscriberCount } from '../controllers/newsletter.controller.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

export const newsletterRouter = Router();

/**
 * @openapi
 * /api/newsletter/subscribe:
 *   post:
 *     summary: S'abonner à la newsletter (public)
 *     tags: [Newsletter]
 *     security: []
 *     responses:
 *       201: { description: Abonnement enregistré }
 */
newsletterRouter.post('/subscribe', asyncHandler(subscribe));

/**
 * @openapi
 * /api/newsletter/subscribers/count:
 *   get:
 *     summary: Nombre d'abonnés (admin)
 *     tags: [Newsletter]
 *     responses:
 *       200: { description: Nombre d'abonnés }
 */
newsletterRouter.get('/subscribers/count', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('newsletter', 'read'), asyncHandler(subscriberCount));

/**
 * @openapi
 * /api/newsletter/campaigns:
 *   get:
 *     summary: Liste des campagnes envoyées (admin)
 *     tags: [Newsletter]
 *     responses:
 *       200: { description: Liste des campagnes }
 *   post:
 *     summary: Rédiger et envoyer une campagne à tous les abonnés, avec pièce jointe optionnelle (admin)
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               subject: { type: string }
 *               bodyHtml: { type: string }
 *               attachment: { type: string, format: binary }
 *     responses:
 *       201: { description: Campagne envoyée }
 */
newsletterRouter.get('/campaigns', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('newsletter', 'read'), asyncHandler(listCampaigns));
newsletterRouter.post(
  '/campaigns',
  requireAuth,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  requirePermission('newsletter', 'edit'),
  upload.single('attachment'),
  asyncHandler(sendCampaign)
);
