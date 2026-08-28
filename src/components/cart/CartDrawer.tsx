import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getItemCount,
    getFreeShippingRemaining,
    getFreeShippingProgress,
    getShippingFee,
    getTotal
  } = useCartStore();

  const { isCartDrawerOpen, closeCartDrawer, openAuthModal, addToast } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const remainingForFree = getFreeShippingRemaining();
  const progressPercent = getFreeShippingProgress();
  const shippingFee = getShippingFee();
  const total = getTotal();

  const handleCheckoutClick = () => {
    closeCartDrawer();
    if (!isAuthenticated) {
      addToast('Please sign in or create an account to complete your commission', 'info');
      openAuthModal('login', '/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-[75] overflow-hidden text-[#221A15]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="w-screen max-w-md bg-white border-l border-[#B8754D]/30 shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#B8754D]/20 flex items-center justify-between bg-[#FAF7F2]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#AD6A42]" />
                  <h3 className="font-serif text-lg font-bold text-[#221A15]">
                    Shopping Bag ({itemCount})
                  </h3>
                </div>
                <button
                  onClick={closeCartDrawer}
                  className="p-1.5 text-[#5E554D] hover:text-[#221A15] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                  title="Close Bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Delivery Progress Meter */}
              <div className="p-4 bg-[#FAF7F2] border-b border-[#B8754D]/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#AD6A42] font-semibold">
                    <Truck className="w-4 h-4" />
                    <span>Complimentary Delivery</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#221A15]">
                    {remainingForFree === 0 ? (
                      <span className="text-emerald-700 font-bold">✓ Unlocked</span>
                    ) : (
                      `Add ${formatCurrency(remainingForFree)}`
                    )}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#EAEBE7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#AD6A42] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-[#AD6A42]/40 mx-auto" />
                    <h4 className="font-serif text-xl font-bold text-[#221A15]">Your Bag is Empty</h4>
                    <p className="text-xs text-[#5E554D] max-w-xs mx-auto">
                      Explore our handcrafted luxury furniture collections and add your favorite pieces.
                    </p>
                    <button
                      onClick={() => {
                        closeCartDrawer();
                        navigate('/catalog');
                      }}
                      className="px-6 py-2.5 bg-[#AD6A42] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase tracking-wider rounded-[3px] mt-2 inline-block transition-colors cursor-pointer shadow-sm"
                    >
                      Browse Collections
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={`${item.productId}-${item.selectedFinish}`}
                      className="flex gap-3.5 pb-4 border-b border-[#B8754D]/15"
                    >
                      <div className="w-16 h-16 bg-[#FAF7F2] rounded-[4px] border border-[#B8754D]/25 shrink-0 p-1 overflow-hidden">
                        <img
                          src={item.selectedFinishImage}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-[3px]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=85';
                          }}
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-[#221A15] line-clamp-1">
                              {item.title}
                            </h4>
                            <button
                              onClick={() => removeItem(item.productId, item.selectedFinish)}
                              className="text-[#5E554D] hover:text-red-600 transition-colors p-1 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {item.selectedFinish && (
                            <span className="text-[10.5px] text-[#5E554D] block mt-0.5">
                              Finish: <strong className="text-[#221A15] font-medium">{item.selectedFinish}</strong>
                            </span>
                          )}
                          <span className="text-xs font-bold text-[#AD6A42] mt-0.5 block">
                            {formatCurrency(item.price)}
                          </span>
                        </div>

                        <div className="flex items-center border border-[#B8754D]/30 rounded-[3px] w-fit mt-2 bg-white">
                          <button
                            onClick={() => updateQuantity(item.productId, item.selectedFinish, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs font-bold text-[#221A15] hover:bg-[#FAF7F2] cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-mono font-bold text-[#221A15]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.selectedFinish, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold text-[#221A15] hover:bg-[#FAF7F2] cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Footer */}
              {items.length > 0 && (
                <div className="p-5 bg-[#FAF7F2] border-t border-[#B8754D]/25 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#5E554D]">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#221A15]">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#5E554D]">
                      <span>Delivery</span>
                      <span className="font-bold text-[#AD6A42]">
                        {shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#B8754D]/20 text-[#221A15]">
                      <span>Total</span>
                      <span className="text-[#AD6A42]">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckoutClick}
                    className="w-full py-3.5 bg-[#AD6A42] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase tracking-wider rounded-[3px] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
