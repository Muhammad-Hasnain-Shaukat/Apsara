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

  if (!isCartDrawerOpen) return null;

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const remainingForFree = getFreeShippingRemaining();
  const progressPercent = getFreeShippingProgress();
  const shippingFee = getShippingFee();
  const total = getTotal();

  const handleCheckoutClick = () => {
    closeCartDrawer();
    if (!isAuthenticated) {
      addToast('Please sign in or create an account to proceed to checkout', 'info');
      openAuthModal('login', '/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden text-[#231B15]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCartDrawer}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white border-l border-[#E8DFD3] shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#E8DFD3] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-apsara-camel" />
                <h3 className="font-serif text-xl text-[#231B15]">
                  Shopping Bag ({itemCount})
                </h3>
              </div>
              <button
                onClick={closeCartDrawer}
                className="p-1 text-[#8E7F74] hover:text-[#231B15] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Delivery Progress Meter */}
            <div className="p-4 bg-[#FAF7F2] border-b border-[#E8DFD3] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-apsara-camel font-medium">
                  <Truck className="w-4 h-4" />
                  <span>Free Delivery Tier</span>
                </div>
                <span className="text-[11px] font-bold text-[#231B15]">
                  {remainingForFree === 0 ? (
                    <span className="text-emerald-600">Unlocked</span>
                  ) : (
                    `Add ${formatCurrency(remainingForFree)}`
                  )}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E8DFD3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-apsara-camel transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-[#D9C8B4] mx-auto" />
                  <h4 className="font-serif text-xl text-[#231B15]">Your Bag is Empty</h4>
                  <p className="text-xs text-[#8E7F74] max-w-xs mx-auto">
                    Explore our furniture collections and add your favorite pieces.
                  </p>
                  <button
                    onClick={() => {
                      closeCartDrawer();
                      navigate('/catalog');
                    }}
                    className="px-6 py-2.5 bg-apsara-camel text-white text-xs font-semibold uppercase tracking-wider rounded-[3px] mt-2 inline-block"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedFinish}`}
                    className="flex gap-3 pb-4 border-b border-[#E8DFD3]"
                  >
                    <div className="w-16 h-16 bg-[#FAF7F2] rounded-[4px] border border-[#E8DFD3] shrink-0 p-1">
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
                          <h4 className="text-xs font-bold text-[#231B15] line-clamp-1">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => removeItem(item.productId, item.selectedFinish)}
                            className="text-[#8E7F74] hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.selectedFinish && (
                          <span className="text-[10px] text-[#8E7F74] block">
                            Finish: {item.selectedFinish}
                          </span>
                        )}
                        <span className="text-xs font-bold text-apsara-camel mt-0.5 block">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      <div className="flex items-center border border-[#E8DFD3] rounded-[3px] w-fit mt-1">
                        <button
                          onClick={() => updateQuantity(item.productId, item.selectedFinish, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#231B15] hover:bg-[#FAF7F2]"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-mono text-[#231B15]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.selectedFinish, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#231B15] hover:bg-[#FAF7F2]"
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
              <div className="p-5 bg-[#FAF7F2] border-t border-[#E8DFD3] space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#6B5E54]">
                    <span>Subtotal:</span>
                    <span className="font-bold text-[#231B15]">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B5E54]">
                    <span>Delivery:</span>
                    <span className="font-bold text-apsara-camel">
                      {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#E8DFD3] text-[#231B15]">
                    <span>Total:</span>
                    <span className="text-apsara-camel">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 bg-[#A66B38] hover:bg-[#8C5627] text-white text-xs font-bold uppercase tracking-wider rounded-[3px] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
