import { Router, Response } from 'express';
import { db, Order, OrderItem } from '../db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Create new order (Customer Checkout)
router.post('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required to complete order' });
      return;
    }

    const {
      items,
      shipping_address,
      payment_method,
      special_instructions
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Cart items are required' });
      return;
    }

    if (!shipping_address || !shipping_address.street || !shipping_address.city) {
      res.status(400).json({ message: 'Valid shipping address is required' });
      return;
    }

    // Calculate totals and verify stock
    let subtotal = 0;
    const orderItems: OrderItem[] = [];
    const orderId = `APS-${Math.floor(10000 + Math.random() * 90000)}`;

    for (const item of items) {
      const product = db.getProductById(item.productId);
      if (!product) {
        res.status(400).json({ message: `Product ${item.productId} not found` });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({ message: `Insufficient stock for ${product.title}. Only ${product.stock} available.` });
        return;
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        order_id: orderId,
        product_id: product.id,
        product_title: product.title,
        product_image: item.selectedFinishImage || product.images[0],
        quantity: item.quantity,
        unit_price: product.price,
        selected_finish: item.selectedFinish || 'Standard Edition'
      });

      // Decrease stock
      db.updateProduct(product.id, { stock: Math.max(0, product.stock - item.quantity) });
    }

    // White glove delivery is complimentary for orders over $5000, otherwise $250
    const shipping_fee = subtotal >= 5000 ? 0 : 250;
    const tax_amount = 0; // Luxury atelier tax included
    const total_amount = subtotal + shipping_fee + tax_amount;

    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      user_id: req.user.id,
      customer_name: req.user.full_name,
      customer_email: req.user.email,
      status: 'pending',
      status_timeline: [
        {
          step: 'pending',
          title: 'Order Reserved in Atelier',
          timestamp: now,
          note: 'Deposit confirmed. Bespoke production queued in Northern Atelier.',
          completed: true
        },
        {
          step: 'processing',
          title: 'Handcrafted by Master Artisans',
          timestamp: '',
          note: '',
          completed: false
        },
        {
          step: 'shipped',
          title: 'Dispatched via White-Glove Logistics',
          timestamp: '',
          note: '',
          completed: false
        },
        {
          step: 'delivered',
          title: 'White-Glove Installed in Sanctuary',
          timestamp: '',
          note: '',
          completed: false
        }
      ],
      total_amount,
      subtotal_amount: subtotal,
      shipping_fee,
      tax_amount,
      shipping_address,
      payment_method: payment_method || 'Concierge Wire / Credit Card',
      tracking_number: `APS-WG-${Math.floor(100000 + Math.random() * 900000)}`,
      special_instructions: special_instructions || '',
      created_at: now
    };

    const created = db.createOrder(newOrder, orderItems);

    res.status(201).json({
      message: 'Order created successfully',
      order: created
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Get user orders (Customer Account)
router.get('/my-orders', authenticateToken, (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userOrders = db.getOrdersByUserId(req.user.id);
  res.json({ orders: userOrders });
});

// Admin: Get all orders across the platform with search & status filters
router.get('/admin/all', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    let orders = db.getOrders();
    const { status, search } = req.query;

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }

    if (search) {
      const q = (search as string).toLowerCase().trim();
      orders = orders.filter(o =>
        o.id.toLowerCase().includes(q) ||
        (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
        (o.customer_email && o.customer_email.toLowerCase().includes(q)) ||
        (o.tracking_number && o.tracking_number.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Failed to retrieve orders' });
  }
});

// Get single order by ID
router.get('/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const order = db.getOrderById(id);

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  // Authorize: customer must own order, or user is admin
  if (req.user?.role !== 'admin' && req.user?.id !== order.user_id) {
    res.status(403).json({ message: 'Access forbidden to this order' });
    return;
  }

  res.json({ order });
});

// Admin: Update order status & timeline
router.patch('/admin/:id/status', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { status, note, tracking_number } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid order status' });
      return;
    }

    const order = db.getOrderById(id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (tracking_number) {
      order.tracking_number = tracking_number;
    }

    const updated = db.updateOrderStatus(id, status, note);
    res.json({
      message: `Order status updated to ${status}`,
      order: updated
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

export default router;
