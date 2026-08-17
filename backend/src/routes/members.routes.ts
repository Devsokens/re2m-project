import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  createMember,
  deleteMember,
  getMember,
  listActivityLogs,
  listMembers,
  recordScan,
  updateMember
} from '../controllers/members.controller.js';

export const membersRouter = Router();

/**
 * @openapi
 * /api/members:
 *   get:
 *     summary: Liste des membres (public — utilisé par le site et l'admin)
 *     tags: [Members]
 *     security: []
 *     responses:
 *       200: { description: Liste des membres }
 *   post:
 *     summary: Créer un membre
 *     tags: [Members]
 *     responses:
 *       201: { description: Membre créé }
 */
membersRouter.get('/', asyncHandler(listMembers));
membersRouter.post('/', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(createMember));

/**
 * @openapi
 * /api/members/{id}:
 *   get:
 *     summary: Détail d'un membre (public)
 *     tags: [Members]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Membre trouvé }
 *       404: { description: Introuvable }
 *   put:
 *     summary: Mettre à jour un membre
 *     tags: [Members]
 *     responses:
 *       200: { description: Membre mis à jour }
 *   delete:
 *     summary: Supprimer un membre (SUPER_ADMIN uniquement)
 *     tags: [Members]
 *     responses:
 *       204: { description: Supprimé }
 */
membersRouter.get('/:id', asyncHandler(getMember));
membersRouter.put('/:id', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(updateMember));
membersRouter.delete('/:id', requireAuth, requireRole('SUPER_ADMIN'), asyncHandler(deleteMember));

/**
 * @openapi
 * /api/members/{id}/scan:
 *   post:
 *     summary: Enregistre une consultation de la carte virtuelle (public)
 *     tags: [Members]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Compteur mis à jour }
 */
membersRouter.post('/:id/scan', asyncHandler(recordScan));

/**
 * @openapi
 * /api/activity-logs:
 *   get:
 *     summary: Journal d'activité (admin)
 *     tags: [Members]
 *     responses:
 *       200: { description: Liste des 200 dernières actions }
 */
export const activityLogsRouter = Router();
activityLogsRouter.get('/', requireAuth, asyncHandler(listActivityLogs));
