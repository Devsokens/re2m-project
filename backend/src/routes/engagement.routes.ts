import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { addComment, getLikeState, listComments, toggleLike } from '../controllers/engagement.controller.js';

// All public — likes/comments on Actualités & Blog have no admin gating.
export const engagementRouter = Router();

/**
 * @openapi
 * /api/engagement/{targetType}/{targetId}/likes:
 *   get:
 *     summary: État des likes pour un contenu (public)
 *     tags: [Engagement]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: targetType
 *         required: true
 *         schema: { type: string, enum: [news, article] }
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: visitorKey
 *         schema: { type: string }
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
