import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createArticle, deleteArticle, listArticles, updateArticle } from '../controllers/articles.controller.js';

export const articlesRouter = Router();

/**
 * @openapi
 * /api/articles:
 *   get:
 *     summary: Liste des articles de blog (public)
 *     tags: [Articles]
 *     security: []
 *     responses:
 *       200: { description: Liste des articles }
 *   post:
 *     summary: Créer un article (admin)
 *     tags: [Articles]
 *     responses:
 *       201: { description: Article créé }
 */
articlesRouter.get('/', asyncHandler(listArticles));
articlesRouter.post('/', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(createArticle));

/**
 * @openapi
 * /api/articles/{id}:
 *   put:
 *     summary: Modifier un article (admin)
 *     tags: [Articles]
 *     responses:
 *       200: { description: Article mis à jour }
 *   delete:
 *     summary: Supprimer un article (admin)
 *     tags: [Articles]
 *     responses:
 *       204: { description: Supprimé }
 */
articlesRouter.put('/:id', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(updateArticle));
articlesRouter.delete('/:id', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(deleteArticle));
