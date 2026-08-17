import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  addParticipant,
  addParticipantsBulk,
  createFormation,
  deleteFormation,
  deleteParticipant,
  listFormations,
  listParticipants,
  updateParticipant
} from '../controllers/formations.controller.js';

// Everything here is admin-only — Formations/Participants have no public-facing view.
export const formationsRouter = Router();
formationsRouter.use(requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'));

/**
 * @openapi
 * /api/formations:
 *   get:
 *     summary: Liste des formations (admin)
 *     tags: [Formations]
 *     responses:
 *       200: { description: Liste des formations }
 *   post:
 *     summary: Créer une formation
 *     tags: [Formations]
 *     responses:
 *       201: { description: Formation créée }
 */
formationsRouter.get('/', asyncHandler(listFormations));
formationsRouter.post('/', asyncHandler(createFormation));

/**
 * @openapi
 * /api/formations/{id}:
 *   delete:
 *     summary: Supprimer une formation (et ses participants)
 *     tags: [Formations]
 *     responses:
 *       204: { description: Supprimée }
 */
formationsRouter.delete('/:id', asyncHandler(deleteFormation));

/**
 * @openapi
 * /api/formations/{id}/participants:
 *   get:
 *     summary: Liste des participants d'une formation
 *     tags: [Formations]
 *     responses:
 *       200: { description: Liste des participants }
 *   post:
 *     summary: Ajouter un participant
 *     tags: [Formations]
 *     responses:
 *       201: { description: Participant ajouté }
 */
formationsRouter.get('/:id/participants', asyncHandler(listParticipants));
formationsRouter.post('/:id/participants', asyncHandler(addParticipant));

/**
 * @openapi
 * /api/formations/{id}/participants/bulk:
 *   post:
 *     summary: Ajouter plusieurs participants (import Excel)
 *     tags: [Formations]
 *     responses:
 *       201: { description: Participants ajoutés }
 */
formationsRouter.post('/:id/participants/bulk', asyncHandler(addParticipantsBulk));

/**
 * @openapi
 * /api/formations/participants/{participantId}:
 *   put:
 *     summary: Modifier un participant
 *     tags: [Formations]
 *     responses:
 *       200: { description: Participant mis à jour }
 *   delete:
 *     summary: Retirer un participant
 *     tags: [Formations]
 *     responses:
 *       204: { description: Retiré }
 */
formationsRouter.put('/participants/:participantId', asyncHandler(updateParticipant));
formationsRouter.delete('/participants/:participantId', asyncHandler(deleteParticipant));
