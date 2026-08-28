import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Lock,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Truck,
  Sparkles,
  LogIn
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { ordersApi } from '../api/client';
import { formatCurrency } from '../utils/formatters';
import { GoogleOAuthModal } from '../components/common/GoogleOAuthModal';

export const CheckoutPage: React.FC = () => {
  const { items, getSubtotal, getShippingFee, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { openAuthModal, addToast } = useUIStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.full_name || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan',
    phone: user?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Direct Bank Wire' | 'Cash on Delivery'>('Credit Card');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.full_name,
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  const subtotal = getSubtotal();
  const deliveryFee = getShippingFee();
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-24 px-4 text-center text-[#231B15]">
        <h2 className="font-serif text-3xl">Your Bag is Empty</h2>
        <p className="text-xs text-[#8E7F74] mt-2">Add items from the catalog to proceed with checkout.</p>
        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-2.5 bg-[#B8754D] text-white text-xs font-semibold rounded-[3px] mt-4"
        >
          Explore Collections
        </button>
      </div>
    );
  }

  // Enforce customer authentication
  if (!isAuthenticated) {
    return (
      <div className="bg-[#EAEBE7] min-h-screen py-16 px-4 flex items-center justify-center text-[#221A15]">
        <div className="max-w-md w-full bg-white rounded-2xl border-[1.5px] border-[#B8754D] p-8 shadow-2xl space-y-6 text-center">
          
          <div className="w-12 h-12 rounded-full bg-[#EFE7DF] border border-[#B8754D] flex items-center justify-center text-[#B8754D] mx-auto">
            <Lock className="w-6 h-6 stroke-[1.8]" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8754D] block">
              PATRON AUTHENTICATION REQUIRED
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#221A15] font-normal">
              Sign In to Place Order
            </h2>
            <p className="text-xs text-[#5E554D] leading-relaxed">
              To guarantee white-glove logistics dispatch, warranty registration, and private commission tracking, every order must be attached to a verified patron account.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Google OAuth 2.0 */}
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full py-3 px-4 bg-white hover:bg-[#FAF7F2] border border-[#B8754D]/40 rounded-xl text-xs font-bold text-[#221A15] transition-all shadow-xs flex items-center justify-center gap-3"
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

            {/* Email Sign In / Sign Up */}
            <button
              onClick={() => openAuthModal('login', '/checkout')}
              className="w-full py-3 px-4 bg-[#B8754D] hover:bg-[#8E4A22] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Create Account with Email</span>
            </button>
          </div>

          <div className="pt-2 text-[11px] text-[#756C62]">
            Need help? Contact concierge at <span className="font-semibold text-[#B8754D]">+92 42 3578 9900</span>
          </div>

          {/* Google Modal */}
          <GoogleOAuthModal
            isOpen={isGoogleModalOpen}
            onClose={() => setIsGoogleModalOpen(false)}
          />
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
      addToast('Please complete all required shipping fields', 'warning');
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await ordersApi.createOrder({
        items,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        special_instructions: specialInstructions,
      });

      clearCart();
      addToast('Commission registered successfully! Preparing white-glove dispatch.', 'success');
      navigate(`/order-success/${order.id}`, { state: { order } });
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to place order. Please verify your details.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-[#231B15]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest text-[#8E7F74] font-bold block">
            Bespoke Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#231B15] font-normal">
            Complete Your Commission
          </h1>
          <p className="text-xs text-[#5E554D]">
            Ordering as <strong className="text-[#B8754D]">{user?.full_name}</strong> ({user?.email})
          </p>
        </div>

        {/* Steps bar */}
        <div className="flex items-center justify-center max-w-md mx-auto">
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() => setStep(1)}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                step >= 1 ? 'border-[#B8754D] text-[#B8754D]' : 'border-[#E8DFD3] text-[#8E7F74]'
              }`}
            >
              1. Delivery Address
            </button>
            <button
              onClick={() => setStep(2)}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                step === 2 ? 'border-[#B8754D] text-[#B8754D]' : 'border-[#E8DFD3] text-[#8E7F74]'
              }`}
            >
              2. Payment & Review
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form */}
          <div className="lg:col-span-7">
            {step === 1 ? (
              <div className="bg-white rounded-2xl border border-[#E8DFD3] p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex items-center gap-2 border-b border-[#E8DFD3] pb-3">
                  <MapPin className="w-4 h-4 text-[#B8754D]" />
                  <h3 className="font-serif text-lg text-[#231B15]">Shipping & Residence Address</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#8E7F74] font-bold mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD3] rounded-[4px] text-xs text-[#231B15] focus:outline-none focus:border-[#B8754D]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#8E7F74] font-bold mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      placeholder="Street address, house or building number"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD3] rounded-[4px] text-xs text-[#231B15] focus:outline-none focus:border-[#B8754D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8E7F74] font-bold mb-1">
                      Apartment / Suite / Villa (Optional)
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.apartment}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, apartment: e.target.value })}
                      placeholder="Apartment, suite, unit (optional)"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD3] rounded-[4px] text-xs text-[#231B15] focus:outline-none focus:border-[#B8754D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8E7F74] font-bold mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="City"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD3] rounded-[4px] text-xs text-[#231B15] focus:outline-none focus:border-[#B8754D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8E7F74] font-bold mb-1">
                      Province / State
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="State / Province"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD3] rounded-[4px] text-xs text-[#231B15] focus:outline-none focus:border-[#B8754D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8E7F74] font-bold mb-1">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      placeholder="Postal / ZIP Code"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD3] rounded-[4px] text-xs text-[#231B15] focus:outline-none focus:border-[#B8754D]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#8E7F74] font-bold mb-1">
                      Phone Number (For Delivery Coordination) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      placeholder="Phone number"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD3] rounded-[4px] text-xs text-[#231B15] focus:outline-none focus:border-[#B8754D]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
                        addToast('Please fill out all required shipping fields', 'warning');
                        return;
                      }
                      setStep(2);
                    }}
                    className="px-6 py-3 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E8DFD3] p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center gap-2 border-b border-[#E8DFD3] pb-3">
                  <CreditCard className="w-4 h-4 text-[#B8754D]" />
                  <h3 className="font-serif text-lg text-[#231B15]">Payment Method</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'Credit Card', label: 'Credit / Debit Card (Visa, Mastercard, PayPak)' },
                    { id: 'Direct Bank Wire', label: 'Private Bank Wire / IBFT (Concierge Invoice)' },
                    { id: 'Cash on Delivery', label: 'Cash on Delivery (White-Glove Handover)' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-[#B8754D] bg-[#FAF7F2] ring-1 ring-[#B8754D]'
                          : 'border-[#E8DFD3] hover:border-[#D9C8B4]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id as any)}
                        className="text-[#B8754D] focus:ring-[#B8754D]"
                      />
                      <span className="text-xs font-bold text-[#231B15]">{method.label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8E7F74] font-bold mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Elevator dimensions, specific gate code, room placement notes..."
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl text-xs text-[#231B15] focus:outline-none focus:border-[#B8754D]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-[#8E7F74] hover:text-[#231B15] font-semibold underline"
                  >
                    Back to Address
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="px-8 py-3.5 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Securing Commission...' : `Confirm & Place Order (${formatCurrency(total)})`}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8DFD3] p-6 space-y-5 shadow-xs">
            <h3 className="font-serif text-lg text-[#231B15] border-b border-[#E8DFD3] pb-3">
              Commission Summary ({items.length} {items.length === 1 ? 'Piece' : 'Pieces'})
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.selectedFinish}`} className="flex gap-3 pb-3 border-b border-[#E8DFD3]/60">
                  <div className="w-14 h-14 bg-[#FAF7F2] rounded-[4px] border border-[#E8DFD3] shrink-0 p-1">
                    <img
                      src={item.selectedFinishImage}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-[3px]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=85';
                      }}
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="font-serif font-bold text-[#231B15]">{item.title}</div>
                    {item.selectedFinish && (
                      <div className="text-[10.5px] text-[#8E7F74]">Finish: {item.selectedFinish}</div>
                    )}
                    <div className="text-[11px] text-[#5E554D] mt-0.5">
                      {item.quantity} × {formatCurrency(item.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E8DFD3] text-xs">
              <div className="flex justify-between text-[#5E554D]">
                <span>Subtotal</span>
                <span className="font-bold text-[#231B15]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#5E554D]">
                <span>White-Glove Delivery</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-700">Complimentary</strong> : formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-[#5E554D]">
                <span>Estimated Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#231B15] pt-2 border-t border-[#E8DFD3]">
                <span>Total Due</span>
                <span className="font-serif text-lg text-[#B8754D]">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#E8DFD3] space-y-1.5 text-[10.5px] text-[#5E554D]">
              <div className="flex items-center gap-1.5 font-bold text-[#231B15]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B8754D]" />
                <span>10-Year Master Structural Guarantee</span>
              </div>
              <p>Every APSARA piece includes certified room-of-choice setup, packaging unboxing, and structural warranty.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
