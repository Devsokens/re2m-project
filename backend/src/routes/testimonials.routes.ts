import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { optionalAuth, requireAuth, requirePermission, requireRole } from '../middleware/auth.js';
import {
  approveTestimonial,
  checkToken,
  createShareToken,
  createTestimonial,
  listTestimonials,
  rejectTestimonial,
  republishTestimonial,
  submitPublicTestimonial,
  submitViaToken,
  updateTestimonial
} from '../controllers/testimonials.controller.js';

export const testimonialsRouter = Router();

/**
 * @openapi
 * /api/testimonials:
 *   get:
 *     summary: Liste des témoignages (publiés uniquement si non authentifié, tous statuts pour un admin)
 *     tags: [Testimonials]
 *     security: []
 *     responses:
 *       200: { description: Liste des témoignages }
 *   post:
 *     summary: Créer un témoignage directement publié (admin)
 *     tags: [Testimonials]
 *     responses:
 *       201: { description: Témoignage créé }
 */
testimonialsRouter.get('/', optionalAuth, asyncHandler(listTestimonials));
testimonialsRouter.post('/', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('testimonials', 'edit'), asyncHandler(createTestimonial));

/**
 * @openapi
 * /api/testimonials/public:
 *   post:
 *     summary: Soumission publique (sans lien d'invitation), arrive en attente de validation
 *     tags: [Testimonials]
 *     security: []
 *     responses:
 *       201: { description: Soumis pour validation }
 */
testimonialsRouter.post('/public', asyncHandler(submitPublicTestimonial));

/**
 * @openapi
 * /api/testimonials/tokens:
 *   post:
 *     summary: Générer un lien d'invitation privé (admin)
 *     tags: [Testimonials]
 *     responses:
 *       201: { description: Token généré }
 */
testimonialsRouter.post('/tokens', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('testimonials', 'edit'), asyncHandler(createShareToken));

/**
 * @openapi
 * /api/testimonials/tokens/{token}:
 *   get:
 *     summary: Vérifie la validité d'un lien d'invitation (public)
 *     tags: [Testimonials]
 *     security: []
 *     responses:
 *       200: { description: "{ valid: boolean }" }
 */
testimonialsRouter.get('/tokens/:token', asyncHandler(checkToken));

/**
 * @openapi
 * /api/testimonials/submit/{token}:
 *   post:
 *     summary: Soumission via un lien d'invitation privé (public)
 *     tags: [Testimonials]
 *     security: []
 *     responses:
 *       201: { description: Soumis pour validation }
 *       400: { description: Lien invalide }
 */
testimonialsRouter.post('/submit/:token', asyncHandler(submitViaToken));

/**
 * @openapi
 * /api/testimonials/{id}:
 *   put:
 *     summary: Modifier un témoignage (admin)
 *     tags: [Testimonials]
 *     responses:
 *       200: { description: Témoignage mis à jour }
 */
testimonialsRouter.put('/:id', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('testimonials', 'edit'), asyncHandler(updateTestimonial));

/**
 * @openapi
 * /api/testimonials/{id}/approve:
 *   patch:
 *     summary: Approuver (soumis -> publié)
 *     tags: [Testimonials]
 *     responses:
 *       200: { description: Publié }
 */
testimonialsRouter.patch('/:id/approve', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('testimonials', 'edit'), asyncHandler(approveTestimonial));

/**
 * @openapi
 * /api/testimonials/{id}/reject:
 *   patch:
 *     summary: Rejeter (kept, pas supprimé)
 *     tags: [Testimonials]
 *     responses:
 *       200: { description: Rejeté }
 */
testimonialsRouter.patch('/:id/reject', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('testimonials', 'edit'), asyncHandler(rejectTestimonial));

/**
 * @openapi
 * /api/testimonials/{id}/republish:
 *   patch:
 *     summary: Republier (rejeté -> publié)
 *     tags: [Testimonials]
 *     responses:
 *       200: { description: Republié }
 */
testimonialsRouter.patch('/:id/republish', requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), requirePermission('testimonials', 'edit'), asyncHandler(republishTestimonial));
