import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createRequest, listRequests, updateRequestStatus } from '../controllers/requests.controller.js';

export const requestsRouter = Router();

/**
 * @openapi
 * /api/requests:
 *   get:
 *     summary: Liste des demandes reçues (admin)
 *     tags: [Requests]
 *     responses:
 *       200: { description: Liste des demandes }
 *   post:
 *     summary: Soumettre une demande (formulaire de contact public)
 *     tags: [Requests]
 *     security: []
 *     responses:
 *       201: { description: Demande créée }
 */
requestsRouter.get('/', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(listRequests));
requestsRouter.post('/', asyncHandler(createRequest));

/**
 * @openapi
 * /api/requests/{id}:
 *   patch:
 *     summary: Programmer un rendez-vous ou refuser une demande (admin)
 *     tags: [Requests]
 *     responses:
 *       200: { description: Demande mise à jour }
 */
requestsRouter.patch('/:id', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), asyncHandler(updateRequestStatus));
