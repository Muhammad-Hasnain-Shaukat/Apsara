import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import analyticsRoutes from './routes/analytics.js';
import { db } from './db.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    brand: 'APSARA Luxury Atelier',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Auto-seed if database is freshly created
if (db.getUsers().length === 0 || db.getProducts().length === 0) {
  console.log('Database empty, running initial seed...');
  seedDatabase().catch(err => console.error('Seed error:', err));
}

app.listen(PORT, () => {
  console.log(`✨ APSARA Luxury Backend Server running on http://localhost:${PORT}`);
});
