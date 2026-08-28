import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  ArrowLeft,
  Shield,
  LogOut,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuthStore();
  const { addToast } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Secret Gateway State (for when accessing /admin while not logged in)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleSecretLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const success = await login(adminEmail || 'admin@apsara.com', adminPassword || 'AdminPass123!');
    if (success) {
      addToast('Executive Atelier Authorization Confirmed', 'success');
    } else {
      setAuthError('Invalid administrator credentials or access key.');
    }
  };

  const handleQuickUnlock = async () => {
    setAuthError('');
    const success = await login('admin@apsara.com', 'AdminPass123!');
    if (success) {
      addToast('Executive Atelier Session Unlocked', 'success');
    } else {
      setAuthError('Authorization failed. Please try again.');
    }
  };

  // If NOT logged in as admin, show the Secret Gateway Screen!
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#110E0C] text-[#EAEBE7] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#191512] border border-[#B8754D]/40 rounded-2xl p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#B8754D]/20 border border-[#B8754D] flex items-center justify-center mx-auto text-[#B8754D] mb-3">
              <Lock className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#B8754D] font-bold block">
              CONFIDENTIAL PORTAL
            </span>
            <h2 className="font-serif text-2xl text-white font-bold">
              APSARA Atelier Executive Control
            </h2>
            <p className="text-xs text-[#A89F91]">
              Restricted management gateway for inventory, commissions, and client records.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-red-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleSecretLogin} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#B8754D] font-bold block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@apsara.com"
                className="w-full px-3.5 py-2.5 bg-[#120F0D] border border-[#B8754D]/30 rounded-lg text-xs text-white placeholder-[#60564C] focus:outline-none focus:border-[#B8754D]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#B8754D] font-bold block mb-1">
                Secret Passcode / Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#120F0D] border border-[#B8754D]/30 rounded-lg text-xs text-white placeholder-[#60564C] focus:outline-none focus:border-[#B8754D] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89F91] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Verifying...' : 'Authenticate Access'}</span>
            </button>
          </form>

          {/* 1-Click Fast Unlock */}
          <div className="pt-4 border-t border-[#B8754D]/25 text-center space-y-2">
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full py-2 bg-[#261E1A] hover:bg-[#B8754D]/30 text-[#B8754D] border border-[#B8754D]/40 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Unlock Demo Admin</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-1 text-[11px] text-[#A89F91] hover:text-white pt-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Storefront</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Overview & KPIs', href: '/admin', icon: LayoutDashboard },
    { label: 'Product Inventory', href: '/admin/products', icon: Package },
    { label: 'Orders & Commissions', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Customer Records', href: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#110E0C] text-[#EAEBE7] flex flex-col md:flex-row">
      
      {/* Dark Walnut Sidebar */}
      <aside className="w-full md:w-64 bg-[#161210] border-r border-[#B8754D]/25 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="mb-8 pb-5 border-b border-[#B8754D]/25">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src="/apsara-logo.png"
                  alt="APSARA Logo"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <div>
                <span className="font-serif text-lg tracking-[0.2em] text-white uppercase font-bold block leading-tight">
                  APSARA
                </span>
                <span className="text-[8.5px] uppercase tracking-widest text-[#B8754D] font-bold block">
                  Executive Atelier
                </span>
              </div>
            </Link>
          </div>

          {/* Nav items */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#B8754D] text-white shadow-md'
                      : 'text-[#A89F91] hover:text-white hover:bg-[#221A16]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#B8754D]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & back button */}
        <div className="pt-6 border-t border-[#B8754D]/25 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-[#B8754D] hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>

          <div className="p-3 bg-[#1C1714] border border-[#B8754D]/30 rounded-lg flex items-center justify-between">
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white truncate">
                <Shield className="w-3 h-3 text-[#B8754D]" />
                <span className="truncate">{user.full_name}</span>
              </div>
              <div className="text-[9.5px] text-[#A89F91] truncate">Super Administrator</div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Sign Out"
              className="text-[#A89F91] hover:text-red-400 p-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Outlet */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <Outlet />
      </main>

    </div>
  );
};
