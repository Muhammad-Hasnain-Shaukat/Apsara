import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../server/routes/auth.js';
import productRoutes from '../server/routes/products.js';
import orderRoutes from '../server/routes/orders.js';
import analyticsRoutes from '../server/routes/analytics.js';
import { db } from '../server/db.js';
import { seedDatabase } from '../server/seed.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'APSARA Luxury Atelier',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Auto seed if empty
if (db.getUsers().length === 0 || db.getProducts().length === 0) {
  seedDatabase().catch(err => console.error('Seed error:', err));
}

export default app;
