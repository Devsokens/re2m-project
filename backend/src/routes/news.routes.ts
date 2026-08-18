import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth, requirePermission, requireRole } from '../middleware/auth.js';
import { createNews, deleteNews, listNews, updateNews } from '../controllers/news.controller.js';

export const newsRouter = Router();

/**
 * @openapi
 * /api/news:
 *   get:
 *     summary: Liste des actualités (public)
 *     tags: [News]
 *     security: []
 *     responses:
 *       200: { description: Liste des actualités }
 *   post:
 *     summary: Créer une actualité (admin)
 *     tags: [News]
 *     responses:
 *       201: { description: Actualité créée }
 */
newsRouter.get('/', asyncHandler(listNews));
newsRouter.post('/', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('content', 'edit'), asyncHandler(createNews));

/**
 * @openapi
 * /api/news/{id}:
 *   put:
 *     summary: Modifier une actualité (admin)
 *     tags: [News]
 *     responses:
 *       200: { description: Actualité mise à jour }
 *   delete:
 *     summary: Supprimer une actualité (admin)
 *     tags: [News]
 *     responses:
 *       204: { description: Supprimée }
 */
newsRouter.put('/:id', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('content', 'edit'), asyncHandler(updateNews));
newsRouter.delete('/:id', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('content', 'edit'), asyncHandler(deleteNews));
