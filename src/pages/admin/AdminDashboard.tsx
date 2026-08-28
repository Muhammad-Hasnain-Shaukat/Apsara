import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Package,
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { analyticsApi } from '../../api/client';
import { AdminAnalyticsData } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await analyticsApi.getOverview();
        setData(res);
      } catch (err) {
        console.error('Failed to load admin analytics', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="p-10 flex items-center justify-center min-h-[60vh] text-apsara-champagne">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-apsara-sandstone border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-apsara-camel">Loading Atelier Intelligence...</span>
        </div>
      </div>
    );
  }

  const { metrics, recentOrders, lowStockProducts, categoryBreakdown, statusCounts } = data;

  const kpis = [
    {
      label: 'Gross Atelier Revenue',
      value: formatCurrency(metrics.totalRevenue),
      subtitle: 'From active private commissions',
      icon: DollarSign,
      color: 'text-apsara-sandstone',
    },
    {
      label: 'Total Commissions',
      value: metrics.totalOrders,
      subtitle: `${statusCounts.processing || 0} in active crafting`,
      icon: ShoppingCart,
      color: 'text-amber-300',
    },
    {
      label: 'Average Commission Value',
      value: formatCurrency(metrics.averageOrderValue),
      subtitle: 'High-net-worth average cart',
      icon: TrendingUp,
      color: 'text-emerald-400',
    },
    {
      label: 'Low Stock Alerts',
      value: `${metrics.lowStockCount} Pieces`,
      subtitle: `${metrics.outOfStockCount} out of atelier stock`,
      icon: AlertTriangle,
      color: 'text-rose-400',
    },
  ];

  return (
    <div className="p-8 lg:p-12 space-y-10 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-apsara-camel/20">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-apsara-camel font-semibold block mb-1">
            APSARA Atelier Executive Control
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Atelier Analytics & Performance
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products">
            <Button variant="gold" size="sm" leftIcon={<Package className="w-3.5 h-3.5" />}>
              Manage Inventory
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="dark" size="sm" leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}>
              All Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-[#141210] border border-apsara-camel/25 p-6 space-y-3 shadow-admin-card"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-apsara-camel font-semibold">
                  {kpi.label}
                </span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="font-serif text-3xl text-white font-medium">
                {kpi.value}
              </div>
              <p className="text-[11px] text-apsara-champagne/60 font-light">
                {kpi.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* 2-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Recent Commissions Table (7 Columns) */}
        <div className="lg:col-span-7 bg-[#141210] border border-apsara-camel/25 p-6 space-y-6 shadow-admin-card">
          <div className="flex items-center justify-between pb-4 border-b border-apsara-camel/20">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-apsara-sandstone" />
              <h3 className="font-serif text-xl text-white">Recent Atelier Orders</h3>
            </div>
            <Link to="/admin/orders" className="text-xs text-apsara-camel hover:text-white flex items-center gap-1 font-semibold">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-apsara-camel/15 text-[10px] uppercase tracking-wider text-apsara-camel font-semibold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apsara-camel/10 text-apsara-champagne/80">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-mono text-white">{order.id}</td>
                    <td className="py-3.5">
                      <div className="font-medium text-white">{order.customer_name || 'Private Client'}</div>
                      <div className="text-[10px] text-apsara-champagne/50">{formatDate(order.created_at)}</div>
                    </td>
                    <td className="py-3.5">
                      <Badge status={order.status} size="sm" />
                    </td>
                    <td className="py-3.5 text-right font-serif text-sm text-white">
                      {formatCurrency(order.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Low Stock & Category Breakdown (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Low Stock Alerts */}
          <div className="bg-[#141210] border border-apsara-camel/25 p-6 shadow-admin-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-apsara-camel/20">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-serif text-lg text-white">Low Stock Inventory Alerts</h3>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-apsara-champagne/60">All architectural inventory levels healthy.</p>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-[#1E1916] border border-apsara-camel/20 text-xs">
                    <div>
                      <div className="font-serif text-sm text-white truncate max-w-[180px]">{p.title}</div>
                      <div className="text-[10px] text-apsara-camel">{p.category}</div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                      p.stock === 0 ? 'bg-red-900/60 text-red-200 border border-red-500/40' : 'bg-amber-900/60 text-amber-200 border border-amber-500/40'
                    }`}>
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} Remaining`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Inventory Breakdown */}
          <div className="bg-[#141210] border border-apsara-camel/25 p-6 shadow-admin-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-apsara-camel/20">
              <Layers className="w-4 h-4 text-apsara-sandstone" />
              <h3 className="font-serif text-lg text-white">Inventory Valuation by Room</h3>
            </div>

            <div className="space-y-3">
              {Object.entries(categoryBreakdown).map(([category, info]) => (
                <div key={category} className="space-y-1 text-xs">
                  <div className="flex justify-between text-apsara-champagne/80">
                    <span className="font-medium text-white">{category}</span>
                    <span className="font-mono text-apsara-camel">{info.count} pieces • {formatCurrency(info.totalValue)}</span>
                  </div>
                  <div className="w-full bg-[#2A2421] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-apsara-camel to-apsara-sandstone h-full"
                      style={{ width: `${Math.min(100, (info.count / metrics.totalProductsCount) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
