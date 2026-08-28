import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/formatters';

export const QuickViewModal: React.FC = () => {
  const { isQuickViewOpen, quickViewProduct, closeQuickView, addToast } = useUIStore();
  const { addItem } = useCartStore();

  const [selectedFinishIndex, setSelectedFinishIndex] = useState(0);

  if (!isQuickViewOpen || !quickViewProduct) return null;

  const currentFinish = quickViewProduct.finish_options?.[selectedFinishIndex];
  const activeImage = currentFinish?.image || quickViewProduct.images[0];

  const handleAdd = () => {
    addItem(quickViewProduct, currentFinish?.label, 1);
    addToast(`${quickViewProduct.title} added to your bag`, 'success');
    closeQuickView();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white rounded-[10px] border border-[#E8DFD3] shadow-2xl z-10 overflow-hidden my-8 text-[#231B15]"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-3.5 right-3.5 z-20 p-1.5 text-[#8E7F74] hover:text-[#231B15] bg-white/80 rounded-full shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Image View */}
            <div className="relative aspect-square bg-[#FAF7F2] p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E8DFD3]">
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
                <span className="text-[9px] uppercase tracking-widest text-apsara-camel font-bold block mb-1">
                  {quickViewProduct.category}
                </span>
                <h3 className="font-serif text-2xl text-[#231B15] font-normal">
                  {quickViewProduct.title}
                </h3>
                <div className="font-serif text-xl text-apsara-camel mt-2 font-bold">
                  {formatCurrency(quickViewProduct.price)}
                </div>

                <p className="text-xs text-[#6B5E54] mt-3 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Materials Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {quickViewProduct.materials.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 bg-[#FAF7F2] border border-[#E8DFD3] text-[9.5px] text-[#6B5E54] rounded-[2px]"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                {/* Finish Selector */}
                {quickViewProduct.finish_options && quickViewProduct.finish_options.length > 0 && (
                  <div className="mt-5">
                    <label className="block text-[10px] uppercase tracking-wider text-[#8E7F74] font-semibold mb-1.5">
                      Finish: <span className="text-[#231B15] font-normal">{currentFinish?.label}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {quickViewProduct.finish_options.map((finish, idx) => (
                        <button
                          key={finish.label}
                          onClick={() => setSelectedFinishIndex(idx)}
                          className={`w-6 h-6 rounded-full border transition-all relative flex items-center justify-center ${
                            selectedFinishIndex === idx
                              ? 'scale-110 border-apsara-camel ring-1 ring-apsara-camel'
                              : 'border-[#D9C8B4] hover:scale-105'
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

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-[#E8DFD3] space-y-2">
                <button
                  onClick={handleAdd}
                  disabled={quickViewProduct.stock === 0}
                  className="w-full py-2.5 bg-apsara-camel hover:bg-[#8C5627] text-white text-xs font-semibold uppercase tracking-wider rounded-[3px] transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{quickViewProduct.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
                </button>

                <Link
                  to={`/products/${quickViewProduct.slug}`}
                  onClick={closeQuickView}
                  className="w-full py-1 text-center text-xs text-apsara-camel hover:underline font-semibold flex items-center justify-center gap-1"
                >
                  <span>View Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
