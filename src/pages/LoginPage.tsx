import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { GoogleOAuthModal } from '../components/common/GoogleOAuthModal';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';
  const { login, register, isLoading, error } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [localError, setLocalError] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          const currentUser = useAuthStore.getState().user;
          addToast(`Welcome back, ${currentUser?.full_name || 'Client'}`, 'success');
          navigate(redirectPath);
        }
      } else {
        if (!fullName.trim()) {
          setLocalError('Please provide your full name');
          return;
        }
        const success = await register(email, password, fullName, phone);
        if (success) {
          addToast('Account created successfully. Welcome to APSARA!', 'success');
          navigate(redirectPath);
        }
      }
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Authentication error. Please check your credentials.');
    }
  };

  return (
    <div className="bg-[#EAEBE7] min-h-screen pt-16 pb-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-[#B8754D]/30 shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6 relative">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs text-[#8E7F74] hover:text-[#B8754D] font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                src="/apsara-logo.png"
                alt="APSARA Logo"
                className="w-full h-full object-contain brightness-0"
              />
            </div>
            <span className="font-serif text-xl tracking-[0.2em] font-bold text-[#221A15]">
              APSARA
            </span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#221A15] font-normal">
            {mode === 'login' ? 'Client Sign In' : 'Create Sanctuary Account'}
          </h1>
          <p className="text-xs text-[#756C62]">
            {mode === 'login'
              ? 'Access your private orders, saved addresses, and tailored commissions.'
              : 'Join our patron circle to explore architectural living.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#FAF7F2] rounded-xl p-1 border border-[#B8754D]/25">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLocalError('');
            }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-[#B8754D] text-white shadow-xs'
                : 'text-[#756C62] hover:text-[#221A15]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setLocalError('');
            }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-[#B8754D] text-white shadow-xs'
                : 'text-[#756C62] hover:text-[#221A15]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF7F2] border border-[#B8754D]/35 rounded-xl text-xs font-semibold text-[#221A15] transition-all shadow-xs flex items-center justify-center gap-3 group"
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

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#B8754D]/20 w-full" />
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-[#756C62] shrink-0">
            Or with email
          </span>
          <div className="border-t border-[#B8754D]/20 w-full" />
        </div>

        {/* Error message */}
        {(localError || error) && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {localError || error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#756C62]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#756C62]" />
              <input
                type="email"
                name="page_client_em_field"
                autoComplete="new-password"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#756C62]" />
                <input
                  type="tel"
                  name="page_client_ph_field"
                  autoComplete="new-password"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#756C62]" />
              <input
                type="password"
                name="page_client_pw_field"
                autoComplete="new-password"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>
              {isLoading
                ? 'Authenticating...'
                : mode === 'login'
                ? 'Sign In to Account'
                : 'Complete Registration'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-[#B8754D]/15 text-center">
          {mode === 'login' ? (
            <p className="text-xs text-[#5E554D]">
              New to APSARA?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
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
                onClick={() => setMode('login')}
                className="text-[#B8754D] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>

      {/* Google OAuth Modal */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={() => navigate(redirectPath)}
      />
    </div>
  );
};
