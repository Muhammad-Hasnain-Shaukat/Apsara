import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-[#B8976C] shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto flex items-center justify-between gap-3 p-4 bg-apsara-espresso text-apsara-alabaster border border-[#B8976C]/40 shadow-2xl rounded-none text-xs font-medium"
          >
            <div className="flex items-center gap-3">
              {getIcon(toast.type)}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-apsara-champagne/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
