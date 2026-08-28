import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  avatarBg: string;
  initial: string;
}

const DETECTED_GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    id: 'g-1',
    name: 'Zainab Malik',
    email: 'zainab.malik@gmail.com',
    avatarBg: 'bg-[#673ab7]',
    initial: 'Z',
  },
  {
    id: 'g-2',
    name: 'Hamza Tariq',
    email: 'hamza.tariq@gmail.com',
    avatarBg: 'bg-[#00897b]',
    initial: 'H',
  },
];

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginWithGoogle } = useAuthStore();
  const { addToast } = useUIStore();

  const [step, setStep] = useState<'chooser' | 'custom_email' | 'password' | 'loading'>('chooser');
  const [selectedAccount, setSelectedAccount] = useState<GoogleAccount | null>(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setStep('chooser');
      setSelectedAccount(null);
      setCustomEmail('');
      setCustomName('');
      setPassword('');
      setShowPassword(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle selecting an existing Google account from device list
  const handleSelectExistingAccount = (account: GoogleAccount) => {
    setSelectedAccount(account);
    setPassword('');
    setError('');
    setStep('password');
  };

  // Handle submitting a custom Google email
  const handleCustomEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const clean = customEmail.trim().toLowerCase();
    if (!clean) {
      setError('Enter an email or phone number');
      return;
    }

    // Validate Google email domain format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clean)) {
      setError('Enter a valid email address');
      return;
    }

    // Reject fake / invalid domains
    if (clean.includes('@jmail.com') || clean.includes('@gmai.com') || (!clean.endsWith('@gmail.com') && !clean.endsWith('@googlemail.com') && !clean.includes('.edu') && !clean.includes('.org') && !clean.includes('.com'))) {
      setError("Couldn't find your Google Account. Please check the spelling.");
      return;
    }

    const derivedName = customName.trim() || clean.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());

    setSelectedAccount({
      id: `g-custom-${Date.now()}`,
      name: derivedName,
      email: clean,
      avatarBg: 'bg-[#1a73e8]',
      initial: derivedName.charAt(0).toUpperCase() || 'G',
    });
    setPassword('');
    setStep('password');
  };

  // Handle final Google Password verification & sign in
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    if (!password.trim()) {
      setError('Enter your Google password');
      return;
    }

    // Google minimum password check simulation
    if (password.trim().length < 6) {
      setError('Wrong password. Try again or click Forgot password to reset it.');
      return;
    }

    setError('');
    setStep('loading');

    try {
      // Simulate authentic Google OAuth network handshake
      await new Promise(resolve => setTimeout(resolve, 800));

      await loginWithGoogle({
        email: selectedAccount.email,
        full_name: selectedAccount.name,
      });

      addToast(`Signed in with Google as ${selectedAccount.name}`, 'success');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setStep('password');
      setError(err.response?.data?.message || 'Google verification failed. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Google OAuth Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-[440px] bg-white rounded-3xl border border-gray-200 shadow-2xl z-10 overflow-hidden text-gray-800 p-8 sm:p-9 font-sans"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Google Official Header */}
          <div className="text-center space-y-1.5 mb-6">
            <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
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
            </div>

            {step === 'chooser' && (
              <>
                <h2 className="text-xl font-normal text-gray-900">
                  Choose an account
                </h2>
                <p className="text-xs text-gray-500">
                  to continue to <span className="font-medium text-[#B8754D]">APSARA Luxury Furniture</span>
                </p>
              </>
            )}

            {step === 'custom_email' && (
              <>
                <h2 className="text-xl font-normal text-gray-900">
                  Sign in
                </h2>
                <p className="text-xs text-gray-500">
                  with your Google Account
                </p>
              </>
            )}

            {(step === 'password' || step === 'loading') && selectedAccount && (
              <>
                <h2 className="text-xl font-normal text-gray-900">
                  Welcome
                </h2>
                {/* Account selector pill */}
                <div
                  onClick={() => setStep('chooser')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer max-w-full"
                >
                  <div className={`w-5 h-5 rounded-full ${selectedAccount.avatarBg} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}>
                    {selectedAccount.initial}
                  </div>
                  <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]">
                    {selectedAccount.email}
                  </span>
                  <span className="text-[10px] text-gray-400">▼</span>
                </div>
              </>
            )}
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <span className="font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Account Chooser */}
          {step === 'chooser' && (
            <div className="space-y-2">
              {DETECTED_GOOGLE_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleSelectExistingAccount(acc)}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-left group cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-full ${acc.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}>
                    {acc.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {acc.email}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5 bg-gray-100 rounded-full">
                    Signed in
                  </span>
                </button>
              ))}

              {/* Use another account */}
              <button
                onClick={() => {
                  setError('');
                  setStep('custom_email');
                }}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-dashed border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all text-left group cursor-pointer mt-1"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    Use another account
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Sign in with any other Google account
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* STEP 2: Custom Google Email Input */}
          {step === 'custom_email' && (
            <form onSubmit={handleCustomEmailNext} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email or phone
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Your Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep('chooser');
                  }}
                  className="inline-flex items-center gap-1 text-xs text-[#1a73e8] hover:text-[#1558b3] font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to accounts</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1558b3] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Google Password Verification */}
          {step === 'password' && selectedAccount && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <p className="text-xs text-gray-600">
                To continue, first verify it's you
              </p>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => alert('Please enter your password to continue to APSARA Luxury Furniture.')}
                  className="text-[#1a73e8] hover:text-[#1558b3] font-medium cursor-pointer"
                >
                  Forgot password?
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setStep('chooser');
                    }}
                    className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1558b3] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Next
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 4: Animated Google Authentication Handshake */}
          {step === 'loading' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium text-gray-700">
                Signing in with Google...
              </p>
              <p className="text-[11px] text-gray-400">
                Securely connecting to APSARA Luxury Furniture
              </p>
            </div>
          )}

          {/* Bottom Security Footer */}
          <div className="mt-8 pt-4 border-t border-gray-100 text-[10.5px] text-gray-400 text-center leading-relaxed">
            To continue, Google will share your name, email address, and profile with <strong className="text-gray-600">APSARA</strong>.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
