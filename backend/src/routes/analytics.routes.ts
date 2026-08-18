import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getVisitsSeries, recordPageView } from '../controllers/analytics.controller.js';

export const analyticsRouter = Router();

/**
 * @openapi
 * /api/analytics/pageviews:
 *   post:
 *     summary: Enregistrer une vue de page (public)
 *     tags: [Analytics]
 *     security: []
 *     responses:
 *       201: { description: Enregistrée }
 *   get:
 *     summary: Série des visites par période (admin)
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema: { type: string, enum: [day, week, month, year] }
 *     responses:
 *       200: { description: "{ data: number[], labels: string[] }" }
 */
analyticsRouter.post('/pageviews', asyncHandler(recordPageView));
analyticsRouter.get('/pageviews', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(getVisitsSeries));
