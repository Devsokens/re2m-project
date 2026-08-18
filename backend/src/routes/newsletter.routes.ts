import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listCampaigns, sendCampaign, subscribe, subscriberCount } from '../controllers/newsletter.controller.js';

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
newsletterRouter.get('/subscribers/count', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(subscriberCount));

/**
 * @openapi
 * /api/newsletter/campaigns:
 *   get:
 *     summary: Liste des campagnes envoyées (admin)
 *     tags: [Newsletter]
 *     responses:
 *       200: { description: Liste des campagnes }
 *   post:
 *     summary: Rédiger et envoyer une campagne à tous les abonnés (admin)
 *     tags: [Newsletter]
 *     responses:
 *       201: { description: Campagne envoyée }
 */
newsletterRouter.get('/campaigns', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(listCampaigns));
newsletterRouter.post('/campaigns', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(sendCampaign));
