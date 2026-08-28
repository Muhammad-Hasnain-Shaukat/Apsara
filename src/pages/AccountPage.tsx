import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Package,
  MapPin,
  Clock,
  Download,
  Plus,
  Trash2,
  Edit2,
  X,
  Shield,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { ordersApi } from '../api/client';
import { Order, Address } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generatePrintableInvoice } from '../utils/invoice';
import { Badge } from '../components/common/Badge';
import { OrderTimeline } from '../components/orders/OrderTimeline';
import { Button } from '../components/common/Button';

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Profile Edit Form state
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });

  // Saved Addresses state
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: user?.full_name || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role === 'admin') {
      navigate('/admin');
      return;
    }

    if (user?.saved_addresses) {
      const parsed = user.saved_addresses.map((a) => {
        try {
          return JSON.parse(a);
        } catch {
          return null;
        }
      }).filter(Boolean);
      setSavedAddresses(parsed);
    }

    async function loadOrders() {
      try {
        const data = await ordersApi.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load private client orders', err);
      } finally {
        setIsLoadingOrders(false);
      }
    }
    loadOrders();
  }, [isAuthenticated, user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile({
      full_name: profileForm.full_name,
      phone: profileForm.phone,
    });
    if (success) {
      addToast('Sanctuary Profile details updated successfully', 'success');
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
      addToast('Please complete required address fields', 'warning');
      return;
    }

    const updated = [...savedAddresses, newAddress];
    const stringified = updated.map((a) => JSON.stringify(a));
    const success = await updateProfile({ saved_addresses: stringified });
    if (success) {
      setSavedAddresses(updated);
      setIsAddressModalOpen(false);
      addToast('New delivery sanctuary saved to your address book', 'success');
      setNewAddress({
        fullName: user?.full_name || '',
        street: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
        phone: user?.phone || '',
      });
    }
  };

  const handleDeleteAddress = async (idx: number) => {
    const updated = savedAddresses.filter((_, i) => i !== idx);
    const stringified = updated.map((a) => JSON.stringify(a));
    const success = await updateProfile({ saved_addresses: stringified });
    if (success) {
      setSavedAddresses(updated);
      addToast('Address removed', 'info');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-apsara-alabaster min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Account Header */}
        <div className="bg-[#FAF7F2] border border-apsara-camel/30 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-none bg-apsara-espresso text-apsara-champagne font-serif text-2xl flex items-center justify-center border border-apsara-camel/40">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl text-apsara-espresso font-normal">
                  {user.full_name}
                </h1>
                {user.role === 'admin' && (
                  <span className="px-2 py-0.5 bg-apsara-espresso text-apsara-sandstone text-[10px] uppercase font-semibold">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-apsara-espresso/60 font-light mt-0.5">
                {user.email} • Client since {formatDate(user.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Button
                variant="dark"
                size="sm"
                onClick={() => navigate('/admin')}
                leftIcon={<Shield className="w-3.5 h-3.5 text-apsara-sandstone" />}
              >
                Access Admin Suite
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-apsara-camel/30 gap-8 text-xs uppercase tracking-widest font-medium">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'orders'
                ? 'text-apsara-espresso font-bold'
                : 'text-apsara-espresso/50 hover:text-apsara-espresso'
            }`}
          >
            <span>Commissioned Orders ({orders.length})</span>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'addresses'
                ? 'text-apsara-espresso font-bold'
                : 'text-apsara-espresso/50 hover:text-apsara-espresso'
            }`}
          >
            <span>Sanctuary Addresses ({savedAddresses.length})</span>
            {activeTab === 'addresses' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'profile'
                ? 'text-apsara-espresso font-bold'
                : 'text-apsara-espresso/50 hover:text-apsara-espresso'
            }`}
          >
            <span>Client Profile</span>
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]" />
            )}
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {isLoadingOrders ? (
              <div className="p-12 text-center text-xs uppercase tracking-wider text-apsara-camel">
                Loading Commission Archive...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 bg-[#FAF7F2] border border-apsara-camel/30 text-center space-y-4">
                <Package className="w-10 h-10 text-apsara-camel mx-auto opacity-40" />
                <h3 className="font-serif text-2xl text-apsara-espresso">No Commissions Yet</h3>
                <p className="text-xs text-apsara-espresso/70 max-w-sm mx-auto font-light">
                  You have not reserved any architectural furniture pieces with our atelier yet.
                </p>
                <Button variant="primary" onClick={() => navigate('/catalog')}>
                  Explore Collections
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 bg-[#FAF7F2] border border-apsara-camel/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-apsara-sandstone/60 transition-colors"
                  >
                    {/* Left: Order Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-apsara-espresso">
                          {order.id}
                        </span>
                        <Badge status={order.status} />
                      </div>
                      <p className="text-xs text-apsara-espresso/60 font-light">
                        Placed on {formatDate(order.created_at)} • Payment via {order.payment_method}
                      </p>
                      {order.tracking_number && (
                        <div className="text-[11px] font-mono text-apsara-camel">
                          Logistics Tracking: {order.tracking_number}
                        </div>
                      )}
                    </div>

                    {/* Right: Price & Drawer Action */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-serif text-xl font-medium text-apsara-espresso">
                          {formatCurrency(order.total_amount)}
                        </div>
                        <div className="text-[10px] text-apsara-espresso/60 uppercase">
                          {order.items?.length || 0} Pieces
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Timeline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => generatePrintableInvoice(order)}
                          title="Print Invoice"
                        >
                          Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Sanctuary Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl text-apsara-espresso">
                Saved Sanctuary Addresses
              </h3>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddressModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Residence
              </Button>
            </div>

            {savedAddresses.length === 0 ? (
              <div className="p-12 bg-[#FAF7F2] border border-apsara-camel/30 text-center space-y-3">
                <MapPin className="w-8 h-8 text-apsara-camel mx-auto opacity-40" />
                <h4 className="font-serif text-xl text-apsara-espresso">No Saved Addresses</h4>
                <p className="text-xs text-apsara-espresso/70 font-light">
                  Add your residences for swift concierge scheduling during commissions.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedAddresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-[#FAF7F2] border border-apsara-camel/30 shadow-sm relative group"
                  >
                    <button
                      onClick={() => handleDeleteAddress(idx)}
                      className="absolute top-4 right-4 text-apsara-espresso/40 hover:text-red-700 transition-colors"
                      title="Remove address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-apsara-camel font-semibold mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Residence #{idx + 1}</span>
                    </div>
                    <div className="font-serif text-lg text-apsara-espresso font-normal">
                      {addr.fullName}
                    </div>
                    <div className="text-xs text-apsara-espresso/75 mt-1 font-light space-y-0.5">
                      <div>{addr.street} {addr.apartment}</div>
                      <div>{addr.city}, {addr.state} {addr.postalCode}</div>
                      <div>{addr.country}</div>
                      <div className="pt-2 text-[11px] text-apsara-camel">Tel: {addr.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile Edit */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-[#FAF7F2] border border-apsara-camel/30 p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl text-apsara-espresso">
              Personal Information
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-apsara-espresso/70 mb-1 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  className="w-full bg-white border border-apsara-camel/30 px-3.5 py-2.5 text-xs text-apsara-espresso focus:outline-none focus:border-apsara-sandstone"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-apsara-espresso/70 mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-apsara-cream border border-apsara-camel/30 px-3.5 py-2.5 text-xs text-apsara-espresso/60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-apsara-espresso/70 mb-1 font-medium">
                  Primary Phone
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+1 (555) 019-2831"
                  className="w-full bg-white border border-apsara-camel/30 px-3.5 py-2.5 text-xs text-apsara-espresso focus:outline-none focus:border-apsara-sandstone"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-apsara-espresso/60 backdrop-blur-sm"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="w-screen max-w-lg bg-[#FAF7F2] border-l border-apsara-camel/30 shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-6 border-b border-apsara-camel/20 flex items-center justify-between bg-white/70">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-apsara-espresso">
                        {selectedOrder.id}
                      </span>
                      <Badge status={selectedOrder.status} />
                    </div>
                    <p className="text-[11px] text-apsara-camel mt-0.5">
                      Placed on {formatDate(selectedOrder.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1.5 text-apsara-espresso/60 hover:text-apsara-espresso"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Status Timeline */}
                  <div className="p-4 bg-white border border-apsara-camel/20 shadow-sm">
                    <h4 className="font-serif text-base text-apsara-espresso pb-2 border-b border-apsara-camel/15">
                      Milestone Timeline Progression
                    </h4>
                    <OrderTimeline
                      timeline={selectedOrder.status_timeline}
                      currentStatus={selectedOrder.status}
                    />
                  </div>

                  {/* Items list */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-base text-apsara-espresso">
                      Commissioned Pieces ({selectedOrder.items?.length || 0})
                    </h4>
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-white border border-apsara-camel/20">
                        <img
                          src={item.product_image}
                          alt={item.product_title}
                          className="w-14 h-14 object-cover border border-apsara-camel/20 shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h5 className="font-serif text-sm text-apsara-espresso">{item.product_title}</h5>
                            <p className="text-[10px] text-apsara-camel">Finish: {item.selected_finish}</p>
                          </div>
                          <div className="flex justify-between items-baseline text-xs">
                            <span className="text-apsara-espresso/60">Qty: {item.quantity}</span>
                            <span className="font-semibold text-apsara-espresso">
                              {formatCurrency(item.unit_price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Sanctuary Details */}
                  <div className="p-4 bg-white border border-apsara-camel/20 space-y-2 text-xs">
                    <div className="font-semibold text-[10px] uppercase tracking-wider text-apsara-camel">
                      Delivery Sanctuary
                    </div>
                    <div className="text-apsara-espresso font-medium">{selectedOrder.shipping_address.fullName}</div>
                    <div className="text-apsara-espresso/70">{selectedOrder.shipping_address.street} {selectedOrder.shipping_address.apartment}</div>
                    <div className="text-apsara-espresso/70">{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postalCode}</div>
                    <div className="text-apsara-espresso/70">Tel: {selectedOrder.shipping_address.phone}</div>
                    {selectedOrder.tracking_number && (
                      <div className="pt-2 border-t border-apsara-camel/10 text-[11px] font-mono text-apsara-camel">
                        Tracking: {selectedOrder.tracking_number}
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="p-4 bg-white border border-apsara-camel/20 space-y-1.5 text-xs">
                    <div className="flex justify-between text-apsara-espresso/70">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.subtotal_amount)}</span>
                    </div>
                    <div className="flex justify-between text-apsara-espresso/70">
                      <span>White-Glove Installation</span>
                      <span>{selectedOrder.shipping_fee === 0 ? 'Complimentary' : formatCurrency(selectedOrder.shipping_fee)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-apsara-espresso pt-2 border-t border-apsara-camel/15 font-serif">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total_amount)}</span>
                    </div>
                  </div>

                </div>

                {/* Footer Action */}
                <div className="p-6 bg-white/80 border-t border-apsara-camel/20">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => generatePrintableInvoice(selectedOrder)}
                    className="w-full"
                    leftIcon={<Download className="w-4 h-4" />}
                  >
                    Download Official Atelier Invoice
                  </Button>
                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-apsara-espresso/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#FAF7F2] border border-apsara-camel/30 p-8 shadow-2xl relative">
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-4 right-4 text-apsara-espresso/60 hover:text-apsara-espresso"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl text-apsara-espresso mb-4">
              Add Delivery Sanctuary
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-apsara-espresso/70 mb-1 font-medium">
                  Residence Label / Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  placeholder="e.g. Julian Montgomery (Penthouse)"
                  className="w-full bg-white border border-apsara-camel/30 px-3.5 py-2 text-xs text-apsara-espresso focus:outline-none focus:border-apsara-sandstone"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-apsara-espresso/70 mb-1 font-medium">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  placeholder="e.g. 740 Park Avenue"
                  className="w-full bg-white border border-apsara-camel/30 px-3.5 py-2 text-xs text-apsara-espresso focus:outline-none focus:border-apsara-sandstone"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-apsara-espresso/70 mb-1 font-medium">
                    Suite / Villa
                  </label>
                  <input
                    type="text"
                    value={newAddress.apartment || ''}
                    onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                    placeholder="Suite 12B"
                    className="w-full bg-white border border-apsara-camel/30 px-3.5 py-2 text-xs text-apsara-espresso focus:outline-none focus:border-apsara-sandstone"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-apsara-espresso/70 mb-1 font-medium">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="New York"
                    className="w-full bg-white border border-apsara-camel/30 px-3.5 py-2 text-xs text-apsara-espresso focus:outline-none focus:border-apsara-sandstone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-apsara-espresso/70 mb-1 font-medium">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    placeholder="NY"
                    className="w-full bg-white border border-apsara-camel/30 px-3.5 py-2 text-xs text-apsara-espresso focus:outline-none focus:border-apsara-sandstone"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-apsara-espresso/70 mb-1 font-medium">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    placeholder="10021"
                    className="w-full bg-white border border-apsara-camel/30 px-3.5 py-2 text-xs text-apsara-espresso focus:outline-none focus:border-apsara-sandstone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-apsara-espresso/70 mb-1 font-medium">
                  Contact Telephone *
                </label>
                <input
                  type="tel"
                  required
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="+1 (415) 890-2341"
                  className="w-full bg-white border border-apsara-camel/30 px-3.5 py-2 text-xs text-apsara-espresso focus:outline-none focus:border-apsara-sandstone"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setIsAddressModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Residence
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
