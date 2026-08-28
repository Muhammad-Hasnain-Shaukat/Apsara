import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  XCircle,
  Eye,
  X,
  MapPin,
  Download
} from 'lucide-react';
import { ordersApi } from '../../api/client';
import { Order, OrderStatus } from '../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { generatePrintableInvoice } from '../../utils/invoice';
import { Badge } from '../../components/common/Badge';
import { OrderTimeline } from '../../components/orders/OrderTimeline';
import { Button } from '../../components/common/Button';
import { useUIStore } from '../../store/uiStore';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { addToast } = useUIStore();

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await ordersApi.getAllOrdersAdmin({
        status: statusFilter,
        search: search || undefined,
      });
      setOrders(data);
    } catch (err) {
      console.error('Failed to load admin orders', err);
      addToast('Failed to retrieve orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await ordersApi.updateOrderStatus(orderId, {
        status: newStatus,
        note: statusNote || undefined,
      });
      addToast(`Order ${orderId} updated to ${newStatus}`, 'success');
      setStatusNote('');
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      console.error('Failed to update status', err);
      addToast('Failed to update order status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-apsara-camel/20">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-apsara-camel font-semibold block mb-1">
            Atelier Fulfillment & Logistics
          </span>
          <h1 className="font-serif text-3xl text-white font-normal">
            Orders & Commissions Management
          </h1>
        </div>
        <span className="text-xs uppercase tracking-wider font-mono text-apsara-sandstone font-semibold">
          {orders.length} Total Records
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-[#141210] border border-apsara-camel/25 shadow-admin-card">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-apsara-camel absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, client, email..."
            className="w-full bg-[#1E1916] border border-apsara-camel/30 pl-9 pr-3 py-2 text-xs text-white placeholder-apsara-champagne/40 focus:outline-none focus:border-apsara-sandstone"
          />
        </form>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-apsara-sandstone text-apsara-espresso font-bold shadow-sm'
                  : 'bg-[#1E1916] text-apsara-champagne/70 hover:text-white border border-apsara-camel/20'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-[#141210] border border-apsara-camel/25 shadow-admin-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs uppercase tracking-widest text-apsara-camel">
            Loading Commissions...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-apsara-champagne/60 font-light">
            No commissions match the current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-apsara-camel/20 text-[10px] uppercase tracking-wider text-apsara-camel font-semibold bg-[#1A1613]">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Client & Sanctuary</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status & Progression</th>
                  <th className="p-4 text-right">Investment</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apsara-camel/10 text-apsara-champagne/80">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-white font-semibold">{order.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{order.customer_name || 'Private Client'}</div>
                      <div className="text-[10px] text-apsara-champagne/50">{order.customer_email}</div>
                      <div className="text-[10px] text-apsara-camel">{order.shipping_address.city}, {order.shipping_address.state}</div>
                    </td>
                    <td className="p-4 text-[11px] text-apsara-champagne/60">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="p-4">
                      <Badge status={order.status} size="sm" />
                      {order.tracking_number && (
                        <div className="text-[10px] font-mono text-apsara-camel mt-1 truncate max-w-[140px]">
                          {order.tracking_number}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right font-serif text-sm text-white font-medium">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Order Inspector & Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#141210] border border-apsara-camel/40 p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-apsara-champagne">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-apsara-camel/20">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-bold text-white">{selectedOrder.id}</span>
                <Badge status={selectedOrder.status} />
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-apsara-champagne/60 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Transition Controls */}
            <div className="p-4 bg-[#1E1916] border border-apsara-camel/30 space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-apsara-sandstone font-semibold block">
                Update Atelier Order Status
              </span>
              
              <div className="flex flex-wrap gap-2">
                {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    disabled={isUpdatingStatus || selectedOrder.status === st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    className={`px-3 py-1.5 text-xs uppercase font-semibold transition-all ${
                      selectedOrder.status === st
                        ? 'bg-apsara-sandstone text-apsara-espresso'
                        : 'bg-[#2A2421] text-apsara-champagne/80 hover:text-white hover:bg-[#342D29] border border-apsara-camel/20'
                    }`}
                  >
                    Set to {st}
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Optional status transition log note (e.g. Master polishing completed)..."
                  className="w-full bg-[#141210] border border-apsara-camel/30 px-3 py-1.5 text-xs text-white placeholder-apsara-champagne/40 focus:outline-none focus:border-apsara-sandstone"
                />
              </div>
            </div>

            {/* Timeline View */}
            <div className="p-4 bg-[#181513] border border-apsara-camel/20">
              <h4 className="font-serif text-base text-white pb-2 border-b border-apsara-camel/15">
                Current Status Timeline
              </h4>
              <OrderTimeline
                timeline={selectedOrder.status_timeline}
                currentStatus={selectedOrder.status}
              />
            </div>

            {/* Client & Shipping Destination */}
            <div className="p-4 bg-[#181513] border border-apsara-camel/20 space-y-2 text-xs">
              <div className="text-[10px] uppercase text-apsara-camel font-semibold">
                Client & Sanctuary Destination
              </div>
              <div className="text-white font-medium">{selectedOrder.shipping_address.fullName}</div>
              <div className="text-apsara-champagne/70">{selectedOrder.shipping_address.street} {selectedOrder.shipping_address.apartment}</div>
              <div className="text-apsara-champagne/70">{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postalCode}</div>
              <div className="text-apsara-champagne/70">Tel: {selectedOrder.shipping_address.phone}</div>
              {selectedOrder.special_instructions && (
                <div className="p-2 bg-[#1E1916] text-[11px] text-apsara-sandstone mt-2">
                  <strong>Delivery Notes:</strong> {selectedOrder.special_instructions}
                </div>
              )}
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3">
              <h4 className="font-serif text-base text-white">
                Ordered Pieces ({selectedOrder.items?.length || 0})
              </h4>
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-[#181513] border border-apsara-camel/20 text-xs">
                  <img
                    src={item.product_image}
                    alt={item.product_title}
                    className="w-14 h-14 object-cover border border-apsara-camel/20 shrink-0"
                  />
                  <div className="flex-1 flex justify-between">
                    <div>
                      <div className="font-serif text-sm text-white">{item.product_title}</div>
                      <div className="text-[11px] text-apsara-camel">{item.selected_finish}</div>
                      <div className="text-[11px] text-apsara-champagne/50">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-white">
                      {formatCurrency(item.unit_price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-apsara-camel/20 flex justify-between items-center">
              <div className="font-serif text-lg text-white font-bold">
                Total: {formatCurrency(selectedOrder.total_amount)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => generatePrintableInvoice(selectedOrder)}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Print Invoice
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
