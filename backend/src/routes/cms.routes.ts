import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth, requirePermission, requireRole } from '../middleware/auth.js';
import { getDraftLayout, getPublishedLayout, publishLayout, saveDraftLayout } from '../controllers/cms.controller.js';

export const cmsRouter = Router();

/**
 * @openapi
 * /api/cms/{slug}/published:
 *   get:
 *     summary: Mise en page publiée d'une page (public — consommé par le site)
 *     tags: [CMS]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string, enum: [accueil, qui-nous-sommes, nos-services, contact] }
 *     responses:
 *       200: { description: Liste des blocs publiés }
 */
cmsRouter.get('/:slug/published', asyncHandler(getPublishedLayout));

/**
 * @openapi
 * /api/cms/{slug}/draft:
 *   get:
 *     summary: Brouillon d'une page (admin — éditeur visuel)
 *     tags: [CMS]
 *     responses:
 *       200: { description: Liste des blocs en brouillon }
 *   put:
 *     summary: Enregistrer le brouillon d'une page
 *     tags: [CMS]
 *     responses:
 *       200: { description: Brouillon enregistré }
 */
cmsRouter.get('/:slug/draft', requireAuth, asyncHandler(getDraftLayout));
cmsRouter.put('/:slug/draft', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('content', 'edit'), asyncHandler(saveDraftLayout));

/**
 * @openapi
 * /api/cms/{slug}/publish:
 *   post:
 *     summary: Publier le brouillon (copie draft -> published)
 *     tags: [CMS]
 *     responses:
 *       200: { description: Blocs publiés }
 */
cmsRouter.post('/:slug/publish', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('content', 'edit'), asyncHandler(publishLayout));
