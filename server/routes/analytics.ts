import { Router, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/overview', authenticateToken, requireAdmin, (_req: AuthRequest, res: Response): void => {
  try {
    const orders = db.getOrders();
    const products = db.getProducts();

    // Filter out cancelled orders for revenue
    const validOrders = orders.filter(o => o.status !== 'cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.total_amount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
    
    // Low stock alerts: stock <= 5
    const lowStockProducts = products.filter(p => p.stock <= 5);
    const outOfStockProducts = products.filter(p => p.stock === 0);

    // Category breakdown
    const categoryBreakdown: Record<string, { count: number; totalValue: number }> = {};
    products.forEach(p => {
      if (!categoryBreakdown[p.category]) {
        categoryBreakdown[p.category] = { count: 0, totalValue: 0 };
      }
      categoryBreakdown[p.category].count += 1;
      categoryBreakdown[p.category].totalValue += p.price * p.stock;
    });

    // Recent orders preview (top 5)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    // Status breakdown
    const statusCounts: Record<string, number> = {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    res.json({
      metrics: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        totalProductsCount: products.length,
      },
      lowStockProducts,
      recentOrders,
      categoryBreakdown,
      statusCounts
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to compute analytics' });
  }
});

// Admin: Get all customer records with order history and total spend
router.get('/customers', authenticateToken, requireAdmin, (_req: AuthRequest, res: Response): void => {
  try {
    const users = db.getUsers().filter(u => u.role === 'customer');
    const orders = db.getOrders();

    const customerRecords = users.map(user => {
      const userOrders = orders.filter(o => o.user_id === user.id);
      const totalSpent = userOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total_amount, 0);

      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone || 'N/A',
        created_at: user.created_at,
        totalOrders: userOrders.length,
        totalSpent,
        saved_addresses: user.saved_addresses || [],
        recentOrders: userOrders.slice(0, 3)
      };
    });

    res.json({ customers: customerRecords });
  } catch (error) {
    console.error('Customers fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch customer records' });
  }
});

export default router;
