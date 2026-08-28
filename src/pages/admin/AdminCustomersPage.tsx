import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  MapPin,
  ChevronRight,
  Shield,
  Clock,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { analyticsApi } from '../../api/client';
import { CustomerRecord } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useUIStore } from '../../store/uiStore';

export const AdminCustomersPage: React.FC = () => {
  const { addToast } = useUIStore();
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await analyticsApi.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers', err);
      addToast('Failed to load customer records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.full_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  const totalClients = customers.length;
  const totalClientSpend = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalClientOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto text-[#EAEBE7]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#B8754D]/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#B8754D] font-bold">
              APSARA EXECUTIVE ATELIER
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#B8754D]/20 text-[#B8754D] text-[9px] font-bold">
              Confidential
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal mt-1">
            Client & Customer Records
          </h1>
          <p className="text-xs text-[#A89F91]">
            Comprehensive registry of registered private clients, order volumes, and lifetime commission values.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-[#2A2420] hover:bg-[#B8754D] text-white border border-[#B8754D]/40 rounded-[6px] text-xs font-semibold uppercase tracking-wider transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#1A1614] border border-[#B8754D]/30 shadow-md">
          <div className="flex items-center justify-between text-[#B8754D] mb-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#A89F91]">Total Clients</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-serif font-bold text-white">{totalClients}</div>
          <div className="text-[10px] text-[#A89F91] mt-1">Registered patron accounts</div>
        </div>

        <div className="p-4 rounded-xl bg-[#1A1614] border border-[#B8754D]/30 shadow-md">
          <div className="flex items-center justify-between text-[#B8754D] mb-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#A89F91]">Lifetime Client Value</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-400">{formatCurrency(totalClientSpend)}</div>
          <div className="text-[10px] text-[#A89F91] mt-1">Total revenue from registered accounts</div>
        </div>

        <div className="p-4 rounded-xl bg-[#1A1614] border border-[#B8754D]/30 shadow-md">
          <div className="flex items-center justify-between text-[#B8754D] mb-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#A89F91]">Commissions Placed</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-2xl font-serif font-bold text-amber-300">{totalClientOrders} Orders</div>
          <div className="text-[10px] text-[#A89F91] mt-1">Delivered & active client orders</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8754D]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by client name, email address, or phone number..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#1A1614] border border-[#B8754D]/30 rounded-lg text-xs text-white placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
        />
      </div>

      {/* Customer Records Table */}
      <div className="bg-[#141210] rounded-xl border border-[#B8754D]/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1F1A17] border-b border-[#B8754D]/30 text-[#B8754D] uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B8754D]/15">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#A89F91]">
                    No client records found matching your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((client) => {
                  const initials = client.full_name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr key={client.id} className="hover:bg-[#1E1916] transition-colors group">
                      
                      {/* Name with initials avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#B8754D] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-[#B8754D] transition-colors">
                              {client.full_name}
                            </div>
                            <div className="text-[10px] text-[#756C62]">ID: {client.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-white/90">
                            <Mail className="w-3 h-3 text-[#B8754D]" />
                            <span>{client.email}</span>
                          </div>
                          {client.phone && (
                            <div className="flex items-center gap-1.5 text-[#A89F91]">
                              <Phone className="w-3 h-3 text-[#B8754D]/70" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 text-[#A89F91]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#B8754D]" />
                          <span>{formatDate(client.created_at)}</span>
                        </div>
                      </td>

                      {/* Total Orders */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#2A2420] text-amber-200 font-bold text-[11px] border border-[#B8754D]/30">
                          {client.totalOrders} {client.totalOrders === 1 ? 'Order' : 'Orders'}
                        </span>
                      </td>

                      {/* Lifetime Spend */}
                      <td className="py-3.5 px-4 font-semibold text-emerald-400">
                        {formatCurrency(client.totalSpent)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedCustomer(client)}
                          className="px-3 py-1.5 bg-[#2A2420] hover:bg-[#B8754D] text-white text-[10.5px] font-bold uppercase rounded-[4px] border border-[#B8754D]/40 transition-all"
                        >
                          View Details
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer/Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#1A1614] border border-[#B8754D] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between border-b border-[#B8754D]/30 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B8754D] font-bold block">
                  Client Profile
                </span>
                <h3 className="font-serif text-xl text-white font-bold mt-0.5">
                  {selectedCustomer.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-[#A89F91] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#141210] rounded-lg border border-[#B8754D]/20">
                <div className="text-[10px] text-[#A89F91] uppercase font-bold">Email Address</div>
                <div className="text-white font-medium truncate mt-0.5">{selectedCustomer.email}</div>
              </div>
              <div className="p-3 bg-[#141210] rounded-lg border border-[#B8754D]/20">
                <div className="text-[10px] text-[#A89F91] uppercase font-bold">Phone Number</div>
                <div className="text-white font-medium truncate mt-0.5">{selectedCustomer.phone || 'N/A'}</div>
              </div>
              <div className="p-3 bg-[#141210] rounded-lg border border-[#B8754D]/20">
                <div className="text-[10px] text-[#A89F91] uppercase font-bold">Total Orders</div>
                <div className="text-amber-300 font-bold mt-0.5">{selectedCustomer.totalOrders} Orders</div>
              </div>
              <div className="p-3 bg-[#141210] rounded-lg border border-[#B8754D]/20">
                <div className="text-[10px] text-[#A89F91] uppercase font-bold">Total Spent</div>
                <div className="text-emerald-400 font-bold mt-0.5">{formatCurrency(selectedCustomer.totalSpent)}</div>
              </div>
            </div>

            {/* Registered Date & Addresses */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#A89F91]">
                <Clock className="w-3.5 h-3.5 text-[#B8754D]" />
                <span>Patron since {formatDate(selectedCustomer.created_at)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#B8754D]/30 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase rounded-[4px] transition-colors"
              >
                Close Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
