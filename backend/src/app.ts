import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './auth/auth.routes';
import issuesRoutes from './issues/issues.routes';
import commentRoutes from './comments/comments.routes';
import statsRoute from './stats/stats.routes';

import swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

const app = express();

app.use(express.json());

// TODO: mount routers here as they are implemented
app.use('/api/auth', authRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api', commentRoutes);
app.use('/api/stats', statsRoute);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Issue Tracker API',
            version: '1.0.0',
            description: 'API documentation for the Issue Tracker application'
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Local server'
            }
        ]
    },
    apis: ['./src/**/*.ts'] // Adjust the path to your route files
} as swaggerUi.SwaggerUiOptions))); 

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
