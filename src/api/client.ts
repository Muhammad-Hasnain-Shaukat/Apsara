import axios from 'axios';
import {
  User,
  Product,
  Order,
  CartItem,
  Address,
  OrderStatus,
  AdminAnalyticsData,
  CustomerRecord
} from '../types';

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('apsara-auth-storage');
  if (storedAuth) {
    try {
      const parsed = JSON.parse(storedAuth);
      const token = parsed?.state?.token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore parse error
    }
  }
  return config;
});

// Auth API
export const authApi = {
  async register(data: { email: string; password: string; full_name: string; phone?: string }) {
    const res = await apiClient.post<{ message: string; token: string; user: User }>('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await apiClient.post<{ message: string; token: string; user: User }>('/auth/login', data);
    return res.data;
  },

  async adminLogin(data: { email: string; password: string }) {
    const res = await apiClient.post<{ message: string; token: string; user: User }>('/auth/admin-login', data);
    return res.data;
  },

  async loginWithGoogle(data: { email: string; full_name: string; google_id?: string; photo_url?: string }) {
    const res = await apiClient.post<{ message: string; token: string; user: User }>('/auth/google', data);
    return res.data;
  },

  async getMe() {
    const res = await apiClient.get<{ user: User }>('/auth/me');
    return res.data.user;
  },

  async updateProfile(data: { full_name?: string; phone?: string; saved_addresses?: string[] }) {
    const res = await apiClient.put<{ message: string; user: User }>('/auth/profile', data);
    return res.data.user;
  },
};

// Products API
export const productsApi = {
  async getAll(params?: {
    category?: string;
    material?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    featured?: boolean;
    search?: string;
    sort?: string;
  }) {
    const res = await apiClient.get<{ total: number; products: Product[] }>('/products', { params });
    return res.data;
  },

  async getBySlugOrId(slugOrId: string) {
    const res = await apiClient.get<{ product: Product; related: Product[] }>(`/products/${slugOrId}`);
    return res.data;
  },

  async getFilterMeta() {
    const res = await apiClient.get<{
      categories: string[];
      materials: string[];
      priceRange: { min: number; max: number };
    }>('/products/meta/filters');
    return res.data;
  },

  // Admin Product Actions
  async create(data: Partial<Product>) {
    const res = await apiClient.post<{ message: string; product: Product }>('/products', data);
    return res.data.product;
  },

  async update(id: string, data: Partial<Product>) {
    const res = await apiClient.put<{ message: string; product: Product }>(`/products/${id}`, data);
    return res.data.product;
  },

  async updateStock(id: string, stock?: number) {
    const res = await apiClient.patch<{ message: string; product: Product }>(`/products/${id}/stock`, { stock });
    return res.data.product;
  },

  async delete(id: string) {
    const res = await apiClient.delete<{ message: string }>(`/products/${id}`);
    return res.data;
  },
};

// Orders API
export const ordersApi = {
  async createOrder(data: {
    items: CartItem[];
    shipping_address: Address;
    payment_method: string;
    special_instructions?: string;
  }) {
    const res = await apiClient.post<{ message: string; order: Order }>('/orders', data);
    return res.data.order;
  },

  async getMyOrders() {
    const res = await apiClient.get<{ orders: Order[] }>('/orders/my-orders');
    return res.data.orders;
  },

  async getOrderById(id: string) {
    const res = await apiClient.get<{ order: Order }>(`/orders/${id}`);
    return res.data.order;
  },

  // Admin Order Actions
  async getAllOrdersAdmin(params?: { status?: string; search?: string }) {
    const res = await apiClient.get<{ orders: Order[] }>('/orders/admin/all', { params });
    return res.data.orders;
  },

  async updateOrderStatus(id: string, data: { status: OrderStatus; note?: string; tracking_number?: string }) {
    const res = await apiClient.patch<{ message: string; order: Order }>(`/orders/admin/${id}/status`, data);
    return res.data.order;
  },
};

// Analytics & Admin API
export const analyticsApi = {
  async getOverview() {
    const res = await apiClient.get<AdminAnalyticsData>('/admin/analytics/overview');
    return res.data;
  },

  async getCustomers() {
    const res = await apiClient.get<{ customers: CustomerRecord[] }>('/admin/analytics/customers');
    return res.data.customers;
  },
};
