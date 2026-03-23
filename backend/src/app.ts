import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './auth/auth.routes';

const app = express();

app.use(express.json());

// TODO: mount routers here as they are implemented
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
