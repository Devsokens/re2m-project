import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth, requirePermission, requireRole } from '../middleware/auth.js';
import {
  addComment,
  getEngagementStats,
  getEngagementSummary,
  getLikeState,
  listAllComments,
  listComments,
  recordShare,
  replyToComment,
  toggleLike
} from '../controllers/engagement.controller.js';

export const engagementRouter = Router();

/**
 * @openapi
 * /api/engagement/{targetType}/{targetId}/likes:
 *   get:
 *     summary: État des likes pour un contenu (public)
 *     tags: [Engagement]
 *     security: []
 *     responses:
 *       200: { description: "{ count, liked }" }
 *   post:
 *     summary: Basculer le like (aime / n'aime plus) pour un visiteur
 *     tags: [Engagement]
 *     security: []
 *     responses:
 *       200: { description: "{ count, liked }" }
 */
engagementRouter.get('/:targetType/:targetId/likes', asyncHandler(getLikeState));
engagementRouter.post('/:targetType/:targetId/likes', asyncHandler(toggleLike));

/**
 * @openapi
 * /api/engagement/{targetType}/{targetId}/shares:
 *   post:
 *     summary: Enregistrer un partage (public)
 *     tags: [Engagement]
 *     security: []
 *     responses:
 *       201: { description: "{ count }" }
 */
engagementRouter.post('/:targetType/:targetId/shares', asyncHandler(recordShare));

/**
 * @openapi
 * /api/engagement/{targetType}/{targetId}/comments:
 *   get:
 *     summary: Liste des commentaires (public)
 *     tags: [Engagement]
 *     security: []
 *     responses:
 *       200: { description: Liste des commentaires }
 *   post:
 *     summary: Ajouter un commentaire (public)
 *     tags: [Engagement]
 *     security: []
 *     responses:
 *       201: { description: Commentaire créé }
 */
engagementRouter.get('/:targetType/:targetId/comments', asyncHandler(listComments));
engagementRouter.post('/:targetType/:targetId/comments', asyncHandler(addComment));

/**
 * @openapi
 * /api/engagement/summary:
 *   get:
 *     summary: Compteurs like/commentaire/partage par contenu, pour les cartes admin (admin)
 *     tags: [Engagement]
 *     parameters:
 *       - in: query
 *         name: targetType
 *         required: true
 *         schema: { type: string, enum: [news, article] }
 *     responses:
 *       200: { description: "{ likes, comments, shares } indexés par id" }
 */
engagementRouter.get('/summary', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(getEngagementSummary));

/**
 * @openapi
 * /api/engagement/stats:
 *   get:
 *     summary: Totaux de réactions site entier, pour le tableau de bord (admin)
 *     tags: [Engagement]
 *     responses:
 *       200: { description: "{ likes, comments, shares }" }
 */
engagementRouter.get('/stats', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(getEngagementStats));

/**
 * @openapi
 * /api/engagement/comments:
 *   get:
 *     summary: Liste de tous les commentaires, pour le panneau de modération (admin)
 *     tags: [Engagement]
 *     parameters:
 *       - in: query
 *         name: targetType
 *         schema: { type: string, enum: [news, article] }
 *     responses:
 *       200: { description: Liste des commentaires }
 */
engagementRouter.get('/comments', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(listAllComments));

/**
 * @openapi
 * /api/engagement/comments/{commentId}/reply:
 *   patch:
 *     summary: Répondre à un commentaire (admin uniquement)
 *     tags: [Engagement]
 *     responses:
 *       200: { description: Commentaire mis à jour avec la réponse admin }
 */
engagementRouter.patch(
  '/comments/:commentId/reply',
  requireAuth,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  requirePermission('content', 'edit'),
  asyncHandler(replyToComment)
);
