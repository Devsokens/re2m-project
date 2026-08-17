import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { corsOrigins } from './lib/env.js';
import { swaggerSpec } from './lib/swagger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.routes.js';
import { membersRouter, activityLogsRouter } from './routes/members.routes.js';
import { cmsRouter } from './routes/cms.routes.js';
import { uploadsRouter } from './routes/uploads.routes.js';

export const app = express();

app.use(
  cors({
    origin: corsOrigins,
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/', (_req, res) => res.redirect('/api-docs'));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRouter);
app.use('/api/members', membersRouter);
app.use('/api/activity-logs', activityLogsRouter);
app.use('/api/cms', cmsRouter);
app.use('/api/uploads', uploadsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
