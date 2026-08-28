import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'admin';
  saved_addresses: string[]; // JSON array of address objects
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  story: string;
  price: number;
  category: 'Living' | 'Dining' | 'Bedroom' | 'Storage' | 'Lighting' | 'Office' | 'Outdoor' | 'Accessories';
  images: string[];
  materials: string[];
  dimensions: string;
  weight: string;
  stock: number;
  is_featured: boolean;
  finish_options: { label: string; hex: string; image: string }[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_title: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  selected_finish: string;
}

export interface OrderTimelineStep {
  step: string;
  title: string;
  timestamp: string;
  note: string;
  completed: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name?: string;
  customer_email?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  status_timeline: OrderTimelineStep[];
  total_amount: number;
  subtotal_amount: number;
  shipping_fee: number;
  tax_amount: number;
  shipping_address: {
    fullName: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  payment_method: string;
  tracking_number?: string;
  special_instructions?: string;
  items?: OrderItem[];
  created_at: string;
}

export interface DatabaseState {
  users: User[];
  products: Product[];
  orders: Order[];
  order_items: OrderItem[];
}

const DB_FILE = path.join(DATA_DIR, 'apsara_database.json');

class DatabaseEngine {
  private state: DatabaseState = {
    users: [],
    products: [],
    orders: [],
    order_items: []
  };

  constructor() {
    this.load();
  }

  private load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.state = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database file, resetting to empty state:', err);
        this.save();
      }
    } else {
      this.save();
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // Users API
  getUsers(): User[] {
    return this.state.users;
  }

  getUserById(id: string): User | undefined {
    return this.state.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: User): User {
    this.state.users.push(user);
    this.save();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.state.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.state.users[idx] = { ...this.state.users[idx], ...updates };
    this.save();
    return this.state.users[idx];
  }

  // Products API
  getProducts(): Product[] {
    return this.state.products;
  }

  getProductById(id: string): Product | undefined {
    return this.state.products.find(p => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.state.products.find(p => p.slug === slug);
  }

  createProduct(product: Product): Product {
    this.state.products.unshift(product);
    this.save();
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const idx = this.state.products.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    this.state.products[idx] = { ...this.state.products[idx], ...updates };
    this.save();
    return this.state.products[idx];
  }

  deleteProduct(id: string): boolean {
    const before = this.state.products.length;
    this.state.products = this.state.products.filter(p => p.id !== id);
    if (this.state.products.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Orders API
  getOrders(): Order[] {
    return this.state.orders.map(order => ({
      ...order,
      items: this.state.order_items.filter(item => item.order_id === order.id)
    }));
  }

  getOrderById(id: string): Order | undefined {
    const order = this.state.orders.find(o => o.id === id);
    if (!order) return undefined;
    const items = this.state.order_items.filter(item => item.order_id === order.id);
    return { ...order, items };
  }

  getOrdersByUserId(userId: string): Order[] {
    return this.state.orders
      .filter(o => o.user_id === userId)
      .map(order => ({
        ...order,
        items: this.state.order_items.filter(item => item.order_id === order.id)
      }));
  }

  createOrder(order: Order, items: OrderItem[]): Order {
    this.state.orders.unshift(order);
    this.state.order_items.push(...items);
    this.save();
    return { ...order, items };
  }

  updateOrderStatus(orderId: string, status: Order['status'], note?: string): Order | undefined {
    const order = this.state.orders.find(o => o.id === orderId);
    if (!order) return undefined;

    order.status = status;
    const now = new Date().toISOString();
    
    // Update timeline
    const timelineStepMap: Record<Order['status'], string> = {
      pending: 'Order Reserved in Atelier',
      processing: 'Handcrafted by Master Artisans',
      shipped: 'Dispatched via White-Glove Logistics',
      delivered: 'White-Glove Installed in Sanctuary',
      cancelled: 'Order Cancelled'
    };

    // Mark previous steps as completed
    const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIdx = statuses.indexOf(status);

    if (currentIdx !== -1) {
      order.status_timeline = statuses.map((st, idx) => ({
        step: st,
        title: timelineStepMap[st],
        timestamp: idx <= currentIdx ? now : '',
        note: idx === currentIdx ? (note || `Status transitioned to ${st}`) : '',
        completed: idx <= currentIdx
      }));
    } else if (status === 'cancelled') {
      order.status_timeline.push({
        step: 'cancelled',
        title: 'Order Cancelled',
        timestamp: now,
        note: note || 'The reservation was cancelled.',
        completed: true
      });
    }

    this.save();
    return this.getOrderById(orderId);
  }

  resetWithSeed(seedState: DatabaseState) {
    this.state = seedState;
    this.save();
  }
}

export const db = new DatabaseEngine();
