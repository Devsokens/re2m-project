import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createAccount, deleteAccount, listAccounts, updateAccount } from '../controllers/accounts.controller.js';

export const accountsRouter = Router();

// Account management is SUPER_ADMIN-only — an ADMIN could otherwise grant
// themselves SUPER_ADMIN by editing their own account.
accountsRouter.use(requireAuth, requireRole('SUPER_ADMIN'));

/**
 * @openapi
 * /api/accounts:
 *   get:
 *     summary: Liste des comptes back-office (SUPER_ADMIN)
 *     tags: [Accounts]
 *     responses:
 *       200: { description: Liste des comptes }
 *   post:
 *     summary: Créer un compte (SUPER_ADMIN) — crée aussi la connexion Supabase Auth
 *     tags: [Accounts]
 *     responses:
 *       201: { description: Compte créé, avec mot de passe temporaire }
 */
accountsRouter.get('/', asyncHandler(listAccounts));
accountsRouter.post('/', asyncHandler(createAccount));

/**
 * @openapi
 * /api/accounts/{id}:
 *   put:
 *     summary: Modifier un compte — nom, rôle, statut, permissions (SUPER_ADMIN)
 *     tags: [Accounts]
 *     responses:
 *       200: { description: Compte mis à jour }
 *   delete:
 *     summary: Supprimer un compte (SUPER_ADMIN)
 *     tags: [Accounts]
 *     responses:
 *       204: { description: Supprimé }
 */
accountsRouter.put('/:id', asyncHandler(updateAccount));
accountsRouter.delete('/:id', asyncHandler(deleteAccount));
