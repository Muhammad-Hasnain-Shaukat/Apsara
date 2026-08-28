export type UserRole = 'customer' | 'admin';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  saved_addresses?: string[];
  created_at: string;
}

export interface CustomerRecord {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
  totalOrders: number;
  totalSpent: number;
  saved_addresses: string[];
  recentOrders: Order[];
}

export interface Address {
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface FinishOption {
  label: string;
  hex: string;
  image: string;
}

export type ProductCategory =
  | 'Living'
  | 'Dining'
  | 'Bedroom'
  | 'Storage'
  | 'Lighting'
  | 'Office'
  | 'Outdoor'
  | 'Accessories';

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  story: string;
  price: number;
  category: ProductCategory;
  images: string[];
  materials: string[];
  dimensions: string;
  weight: string;
  stock: number;
  is_featured: boolean;
  finish_options: FinishOption[];
  created_at: string;
}

export interface CartItem {
  productId: string;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  selectedFinish: string;
  selectedFinishImage: string;
  category: string;
  maxStock: number;
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
  status: OrderStatus;
  status_timeline: OrderTimelineStep[];
  total_amount: number;
  subtotal_amount: number;
  shipping_fee: number;
  tax_amount: number;
  shipping_address: Address;
  payment_method: string;
  tracking_number?: string;
  special_instructions?: string;
  items?: OrderItem[];
  created_at: string;
}

export interface FilterState {
  category: string;
  material: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  search: string;
  sort: 'featured' | 'price_asc' | 'price_desc' | 'newest';
}

export interface AdminAnalyticsData {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalProductsCount: number;
  };
  recentOrders: Order[];
  lowStockProducts: Product[];
  categoryBreakdown: Record<string, { count: number; totalValue: number }>;
  statusCounts: Record<string, number>;
}
