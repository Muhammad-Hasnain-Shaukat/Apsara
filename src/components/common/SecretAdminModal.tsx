import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

interface SecretAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecretAdminModal: React.FC<SecretAdminModalProps> = ({ isOpen, onClose }) => {
  const { adminLogin, isLoading } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const emailInputRef = useRef<HTMLInputElement>(null);

  // Strictly reset any inputs or errors whenever modal is toggled
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both administrator email and password.');
      return;
    }

    const success = await adminLogin(email.trim(), password.trim());
    if (success) {
      addToast('Master Administrator Identity Verified. Access Granted.', 'success');
      onClose();
      setEmail('');
      setPassword('');
      navigate('/admin');
    } else {
      setError('Access Denied: Unrecognized administrator credentials.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
        {/* Darkened Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Executive Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#181411] text-white rounded-2xl border border-[#B8754D]/50 shadow-2xl p-6 sm:p-8 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#B8754D]/20 border border-[#B8754D] flex items-center justify-center text-[#B8754D] mx-auto shadow-inner">
              <Shield className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8754D] block">
              CONFIDENTIAL RESTRICTED ACCESS
            </span>
            <h3 className="font-serif text-2xl font-normal text-white">
              Master Atelier Gateway
            </h3>
            <p className="text-xs text-white/60">
              Authorized personnel only. Please verify your administrative credentials.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-950/70 border border-red-500/50 text-red-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Form with zero autofill */}
          <form onSubmit={handleAdminSubmit} autoComplete="off" className="space-y-4">
            <div>
              <label className="block text-[10.5px] uppercase tracking-wider text-white/80 font-bold mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input
                  ref={emailInputRef}
                  type="email"
                  name="adm_sec_email_field"
                  autoComplete="new-password"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter administrator email"
                  className="secret-admin-input w-full pl-9 pr-3.5 py-2.5 bg-[#181411] border border-[#B8754D]/40 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#B8754D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] uppercase tracking-wider text-white/80 font-bold mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input
                  type="password"
                  name="adm_sec_pass_field"
                  autoComplete="new-password"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="secret-admin-input w-full pl-9 pr-3.5 py-2.5 bg-[#181411] border border-[#B8754D]/40 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#B8754D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>{isLoading ? 'Verifying Identity...' : 'Authenticate & Enter Suite'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-3 border-t border-white/10 text-center text-[10px] text-white/40">
            Secure 256-bit Encrypted Master Management Console
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
