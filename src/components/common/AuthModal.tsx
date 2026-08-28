import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Mail, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthModal } from './GoogleOAuthModal';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, authRedirectPath, closeAuthModal, addToast } = useUIStore();
  const { login, register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [localError, setLocalError] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  React.useEffect(() => {
    if (authModalMode) {
      setActiveTab(authModalMode);
    }
    setLocalError('');
    clearError();
  }, [authModalMode, isAuthModalOpen, clearError]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    try {
      if (activeTab === 'login') {
        const success = await login(email, password);
        if (success) {
          const currentUser = useAuthStore.getState().user;
          addToast(`Welcome back, ${currentUser?.full_name || 'Client'}`, 'success');
          closeAuthModal();
          if (authRedirectPath) navigate(authRedirectPath);
        }
      } else {
        const success = await register(email, password, fullName, phone);
        if (success) {
          addToast('Account registered successfully. Welcome to APSARA!', 'success');
          closeAuthModal();
          if (authRedirectPath) navigate(authRedirectPath);
        }
      }
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Authentication error. Please check your credentials.');
    }
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-[#221A15]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-white rounded-2xl border border-[#B8754D]/30 shadow-2xl p-6 sm:p-8 z-10 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-[#756C62] hover:text-[#221A15] p-1.5 rounded-full hover:bg-[#FAF7F2] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Brand Header */}
            <div className="text-center space-y-1.5 mb-5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8754D] font-bold block">
                APSARA SANCTUARY
              </span>
              <h3 className="font-serif text-2xl font-normal text-[#221A15]">
                {activeTab === 'login' ? 'Client Sign In' : 'Create Account'}
              </h3>
              <p className="text-xs text-[#5E554D]">
                {activeTab === 'login'
                  ? 'Access your private commissions, order status, and saved pieces.'
                  : 'Join APSARA to place bespoke commissions and receive white-glove delivery.'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-[#B8754D]/25 mb-5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setLocalError('');
                }}
                className={`flex-1 py-2 text-xs uppercase tracking-wider font-bold transition-all border-b-2 ${
                  activeTab === 'login'
                    ? 'border-[#B8754D] text-[#B8754D]'
                    : 'border-transparent text-[#756C62] hover:text-[#221A15]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setLocalError('');
                }}
                className={`flex-1 py-2 text-xs uppercase tracking-wider font-bold transition-all border-b-2 ${
                  activeTab === 'register'
                    ? 'border-[#B8754D] text-[#B8754D]'
                    : 'border-transparent text-[#756C62] hover:text-[#221A15]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF7F2] border border-[#B8754D]/35 rounded-xl text-xs font-semibold text-[#221A15] transition-all shadow-xs flex items-center justify-center gap-3 mb-4 group"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-[#B8754D]/20 w-full" />
              <span className="bg-white px-3 text-[10px] uppercase font-bold text-[#756C62] shrink-0">
                Or with email
              </span>
              <div className="border-t border-[#B8754D]/20 w-full" />
            </div>

            {/* Error message */}
            {(localError || error) && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {localError || error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {activeTab === 'register' && (
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#756C62]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#756C62]" />
                  <input
                    type="email"
                    name="client_em_field"
                    autoComplete="new-password"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
                  />
                </div>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#756C62]" />
                    <input
                      type="tel"
                      name="client_ph_field"
                      autoComplete="new-password"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#756C62]" />
                  <input
                    type="password"
                    name="client_pw_field"
                    autoComplete="new-password"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>
                  {isLoading
                    ? 'Authenticating...'
                    : activeTab === 'login'
                    ? 'Sign In to Account'
                    : 'Complete Registration'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-[#B8754D]/15 text-center">
              {activeTab === 'login' ? (
                <p className="text-xs text-[#5E554D]">
                  New to APSARA?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-[#B8754D] font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              ) : (
                <p className="text-xs text-[#5E554D]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-[#B8754D] font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Google OAuth Screen */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={() => {
          closeAuthModal();
          if (authRedirectPath) navigate(authRedirectPath);
        }}
      />
    </>
  );
};
