import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { login, logout, me } from '../controllers/auth.controller.js';

export const authRouter = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Connexion administrateur
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Connexion réussie, un token Bearer est renvoyé }
 *       401: { description: Identifiants invalides }
 */
authRouter.post('/login', asyncHandler(login));

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion (le token doit ensuite être supprimé côté client)
 *     tags: [Auth]
 *     responses:
 *       204: { description: Déconnecté }
 */
authRouter.post('/logout', requireAuth, asyncHandler(logout));

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Profil de l'utilisateur authentifié
 *     tags: [Auth]
 *     responses:
 *       200: { description: Profil courant }
 *       401: { description: Non authentifié }
 */
authRouter.get('/me', requireAuth, asyncHandler(me));
