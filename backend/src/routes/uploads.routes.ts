import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage } from '../controllers/uploads.controller.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

export const uploadsRouter = Router();

/**
 * @openapi
 * /api/uploads:
 *   post:
 *     summary: Envoyer une image (remplace le stockage en base64 côté client)
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: string, format: binary }
 *     responses:
 *       201: { description: URL publique du fichier téléversé }
 */
uploadsRouter.post('/', requireAuth, upload.single('file'), asyncHandler(uploadImage));
