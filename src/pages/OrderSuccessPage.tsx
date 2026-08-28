import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, ArrowRight, Truck, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { ordersApi } from '../api/client';
import { Order } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generatePrintableInvoice } from '../utils/invoice';
import { OrderTimeline } from '../components/orders/OrderTimeline';
import { Button } from '../components/common/Button';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory luxury gold confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#B8976C', '#1F1A17', '#E5D3B3'],
    });

    async function loadOrder() {
      if (!orderId) return;
      try {
        const data = await ordersApi.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load confirmed order', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-apsara-alabaster flex items-center justify-center pt-24">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-apsara-camel border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-apsara-camel">Confirming Atelier Commission...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-apsara-alabaster min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Success Banner */}
        <div className="text-center space-y-4 bg-gradient-to-b from-[#FAF7F2] to-[#F5EFEB] border border-apsara-camel/30 p-10 shadow-pedestal relative overflow-hidden">
          
          {/* Subtle gold flare line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          <div className="w-16 h-16 rounded-full bg-apsara-espresso text-apsara-sandstone flex items-center justify-center mx-auto shadow-md border border-apsara-camel/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] uppercase tracking-widest-luxury text-apsara-camel font-semibold block">
            Commission Registered
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl text-apsara-espresso font-normal">
            Your Sanctuary is Being Sculpted
          </h1>

          <p className="text-xs sm:text-sm text-apsara-espresso/70 max-w-lg mx-auto font-light leading-relaxed">
            Thank you for commissioning APSARA. Order identifier <strong className="font-mono text-apsara-espresso">{order.id}</strong> has been assigned to our master woodturners and stone masons.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => generatePrintableInvoice(order)}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Official Atelier Invoice
            </Button>
            <Link to="/account">
              <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View in Private Sanctuary Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Details & Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Summary & Items (7 Columns) */}
          <div className="md:col-span-7 bg-[#FAF7F2] border border-apsara-camel/30 p-8 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-apsara-camel/20">
              <h3 className="font-serif text-xl text-apsara-espresso">
                Commissioned Pieces
              </h3>
              <span className="text-xs font-mono text-apsara-camel font-semibold">
                {order.items?.length || 0} Items
              </span>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-white border border-apsara-camel/20">
                  <img
                    src={item.product_image}
                    alt={item.product_title}
                    className="w-16 h-16 object-cover bg-apsara-frosted-sand shrink-0 border border-apsara-camel/20"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-base text-apsara-espresso leading-tight">
                        {item.product_title}
                      </h4>
                      <p className="text-[11px] text-apsara-camel mt-0.5">
                        Finish: {item.selected_finish}
                      </p>
                    </div>
                    <div className="flex justify-between items-baseline text-xs pt-2">
                      <span className="text-apsara-espresso/60">Qty: {item.quantity}</span>
                      <span className="font-semibold text-apsara-espresso">
                        {formatCurrency(item.unit_price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-4 border-t border-apsara-camel/20 space-y-1.5 text-xs">
              <div className="flex justify-between text-apsara-espresso/70">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal_amount)}</span>
              </div>
              <div className="flex justify-between text-apsara-espresso/70">
                <span>White-Glove Installation</span>
                <span>{order.shipping_fee === 0 ? 'Complimentary' : formatCurrency(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-apsara-espresso pt-2 border-t border-apsara-camel/20 font-serif">
                <span>Total Investment</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </div>

          </div>

          {/* Right Live Logistics Progression & Address (5 Columns) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Status Timeline */}
            <div className="bg-[#FAF7F2] border border-apsara-camel/30 p-6 shadow-sm">
              <h4 className="font-serif text-lg text-apsara-espresso pb-3 border-b border-apsara-camel/20">
                Crafting & Logistics Timeline
              </h4>
              <OrderTimeline
                timeline={order.status_timeline}
                currentStatus={order.status}
              />
            </div>

            {/* Destination Address */}
            <div className="bg-[#FAF7F2] border border-apsara-camel/30 p-6 shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-2 text-apsara-camel font-semibold uppercase tracking-wider text-[10px]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Sanctuary Delivery Destination</span>
              </div>
              <div className="text-apsara-espresso font-medium">
                <div>{order.shipping_address.fullName}</div>
                <div className="text-apsara-espresso/70">{order.shipping_address.street} {order.shipping_address.apartment}</div>
                <div className="text-apsara-espresso/70">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}</div>
                <div className="text-apsara-espresso/70">Tel: {order.shipping_address.phone}</div>
              </div>
              {order.tracking_number && (
                <div className="pt-2 border-t border-apsara-camel/15 text-[11px] font-mono text-apsara-camel">
                  Tracking: {order.tracking_number}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
