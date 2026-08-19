import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth, requirePermission, requireRole } from '../middleware/auth.js';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';

export const settingsRouter = Router();

/**
 * @openapi
 * /api/settings:
 *   get:
 *     summary: Paramètres du cabinet (admin)
 *     tags: [Settings]
 *     responses:
 *       200: { description: Paramètres actuels }
 *   put:
 *     summary: Mettre à jour les paramètres (admin)
 *     tags: [Settings]
 *     responses:
 *       200: { description: Paramètres mis à jour }
 */
settingsRouter.get('/', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('settings', 'read'), asyncHandler(getSettings));
settingsRouter.put('/', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('settings', 'edit'), asyncHandler(updateSettings));
