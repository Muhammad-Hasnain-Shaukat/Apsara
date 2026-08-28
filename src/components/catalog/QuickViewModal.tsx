import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/formatters';

export const QuickViewModal: React.FC = () => {
  const { isQuickViewOpen, quickViewProduct, closeQuickView, addToast, openCartDrawer } = useUIStore();
  const { addItem } = useCartStore();

  const [selectedFinishIndex, setSelectedFinishIndex] = useState(0);

  if (!isQuickViewOpen || !quickViewProduct) return null;

  const currentFinish = quickViewProduct.finish_options?.[selectedFinishIndex];
  const activeImage = currentFinish?.image || quickViewProduct.images[0];

  const handleAdd = () => {
    addItem(quickViewProduct, currentFinish?.label, 1);
    addToast(`${quickViewProduct.title} added to bag`, 'success');
    closeQuickView();
    openCartDrawer();
  };

  return (
    <AnimatePresence>
      {isQuickViewOpen && quickViewProduct && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-3xl bg-white rounded-[10px] border border-[#B8754D]/30 shadow-2xl z-10 overflow-hidden my-8 text-[#221A15]"
          >
            {/* Close button */}
            <button
              onClick={closeQuickView}
              className="absolute top-3.5 right-3.5 z-20 p-1.5 text-[#5E554D] hover:text-[#221A15] bg-white/90 rounded-full shadow-sm cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Left Image View */}
              <div className="relative aspect-square bg-[#FAF7F2] p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#B8754D]/20">
                <img
                  src={activeImage}
                  alt={quickViewProduct.title}
                  className="w-full h-full object-cover rounded-[6px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85';
                  }}
                />
              </div>

              {/* Right Details */}
              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#AD6A42] font-bold block mb-1">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="font-serif text-2xl text-[#221A15] font-bold">
                    {quickViewProduct.title}
                  </h3>
                  <div className="font-serif text-xl text-[#AD6A42] mt-2 font-bold">
                    {formatCurrency(quickViewProduct.price)}
                  </div>

                  <p className="text-xs text-[#5E554D] mt-3 leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  {/* Materials Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {quickViewProduct.materials.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 bg-[#FAF7F2] border border-[#B8754D]/25 text-[9.5px] text-[#5E554D] rounded-[2px]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Finish Selector */}
                  {quickViewProduct.finish_options && quickViewProduct.finish_options.length > 0 && (
                    <div className="mt-5">
                      <label className="block text-[10px] uppercase tracking-wider text-[#5E554D] font-semibold mb-1.5">
                        Finish: <span className="text-[#221A15] font-bold">{currentFinish?.label}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {quickViewProduct.finish_options.map((finish, idx) => (
                          <button
                            key={finish.label}
                            onClick={() => setSelectedFinishIndex(idx)}
                            className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                              selectedFinishIndex === idx
                                ? 'scale-110 border-[#AD6A42] ring-2 ring-[#AD6A42]'
                                : 'border-[#B8754D]/40 hover:scale-105'
                            }`}
                            style={{ backgroundColor: finish.hex }}
                            title={finish.label}
                          >
                            {selectedFinishIndex === idx && (
                              <Check className="w-3 h-3 text-white mix-blend-difference" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 border-t border-[#B8754D]/20 mt-6 space-y-2.5">
                  <button
                    onClick={handleAdd}
                    className="w-full py-3 bg-[#AD6A42] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase tracking-wider rounded-[3px] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  <Link
                    to={`/products/${quickViewProduct.slug}`}
                    onClick={closeQuickView}
                    className="w-full py-2.5 bg-[#FAF7F2] hover:bg-[#EAEBE7] text-[#221A15] text-xs font-semibold rounded-[3px] transition-colors flex items-center justify-center gap-1.5 border border-[#B8754D]/30"
                  >
                    <span>View Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
