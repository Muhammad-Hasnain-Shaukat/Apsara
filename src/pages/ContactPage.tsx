import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';

export const ContactPage: React.FC = () => {
  const { addToast } = useUIStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Bespoke Custom Furniture Commission',
    message: '',
    showroom: 'Lahore Flagship Atelier',
  });

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('Thank you. Your inquiry has been sent to our private concierge.', 'success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'Bespoke Custom Furniture Commission',
        message: '',
        showroom: 'Lahore Flagship Atelier',
      });
    }, 1000);
  };

  const showrooms = [
    {
      city: 'Lahore Flagship Atelier',
      address: '14-C, Main Boulevard, Gulberg III, Lahore',
      phone: '+92 42 3578 9900',
      hours: 'Mon – Sat: 11:00 AM – 9:00 PM (Sunday by Appointment)',
      status: 'Open Today',
    },
    {
      city: 'Karachi Waterfront Salon',
      address: 'Plot 8, Marine Drive, Clifton Block 4, Karachi',
      phone: '+92 21 3587 4422',
      hours: 'Mon – Sat: 11:30 AM – 9:30 PM',
      status: 'Open Today',
    },
    {
      city: 'Islamabad Executive Studio',
      address: 'Suites 4-5, Beverly Centre, Blue Area, Islamabad',
      phone: '+92 51 2801 7733',
      hours: 'Mon – Sat: 10:30 AM – 8:30 PM',
      status: 'Open Today',
    },
  ];

  const faqs = [
    {
      q: 'How does the bespoke custom furniture commission process work?',
      a: 'We begin with a personal consultation to understand your architectural requirements and room dimensions. Our master joiners provide 3D spatial renders, wood species swatches (American Walnut, European Oak, Ash), and textile selections before handcrafting your piece.',
    },
    {
      q: 'What is the standard lead time for custom and made-to-order pieces?',
      a: 'In-stock collection pieces are delivered within 3–5 business days. Custom bespoke commissions typically require 3–4 weeks for timber seasoning, precision mortise joinery, hand-rubbed organic oil finishing, and white-glove setup.',
    },
    {
      q: 'Do you offer white-glove delivery and assembly across Pakistan?',
      a: 'Yes. Every order above Rs. 50,000 includes complimentary white-glove room-of-choice placement, packaging unboxing, structural leveling, and complete assembly by our certified technicians.',
    },
    {
      q: 'Can I request fabric swatches and timber material samples?',
      a: 'Yes. Contact our concierge or visit any of our 3 ateliers in Lahore, Karachi, or Islamabad to receive our curated Material Box featuring Belgian flax bouclés, full-grain Italian leathers, and hand-rubbed timber swatches.',
    },
  ];

  return (
    <div className="bg-[#EAEBE7] text-[#221A15] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFE7DF] border border-[#B8754D]/40 text-[#B8754D] text-[10px] font-bold uppercase tracking-[0.2em]">
            <MessageSquare className="w-3 h-3" />
            <span>ATELIER CONCIERGE & SHOWROOMS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#221A15] font-normal leading-tight">
            Connect With Our <br />
            <span className="italic text-[#B8754D]">Design Specialists</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5E554D] leading-relaxed">
            Whether inquiring about a bespoke commission, scheduling a private showroom appointment, or seeking architectural advice, our concierge team is dedicated to your service.
          </p>
        </div>

        {/* Main 2-Column: Inquiry Form + Showrooms */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Concierge Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border-[1.5px] border-[#B8754D] p-6 sm:p-8 shadow-sm">
            <div className="space-y-1 pb-4 border-b border-[#B8754D]/25 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8754D]">
                Direct Message
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#221A15]">
                Send an Atelier Inquiry
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold block mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold block mb-1">
                    Nearest Showroom
                  </label>
                  <select
                    value={formData.showroom}
                    onChange={(e) => setFormData({ ...formData, showroom: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] focus:outline-none focus:border-[#B8754D]"
                  >
                    <option value="Lahore Flagship Atelier">Lahore Flagship Atelier</option>
                    <option value="Karachi Waterfront Salon">Karachi Waterfront Salon</option>
                    <option value="Islamabad Executive Studio">Islamabad Executive Studio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold block mb-1">
                  Inquiry Topic
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Custom Dining Room Commission"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
                />
              </div>

              <div>
                <label className="text-[10.5px] uppercase tracking-wider text-[#221A15] font-bold block mb-1">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide any details about your room dimensions, desired materials, or project timeline..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#B8754D]/30 rounded-xl text-xs text-[#221A15] placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending to Concierge...' : 'Submit Atelier Inquiry'}</span>
              </button>
            </form>
          </div>

          {/* Right: Showroom Details & VIP Contacts */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Showrooms List */}
            <div className="bg-white rounded-2xl border-[1.5px] border-[#B8754D] p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#B8754D]/25">
                <h3 className="font-serif text-xl font-bold text-[#221A15]">
                  Our Showroom Ateliers
                </h3>
                <span className="text-[10px] font-bold text-[#B8754D] uppercase">
                  Pakistan
                </span>
              </div>

              <div className="space-y-4">
                {showrooms.map((room) => (
                  <div
                    key={room.city}
                    className="p-4 rounded-xl bg-[#FAF7F2] border border-[#B8754D]/30 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#221A15]">
                        {room.city}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                        {room.status}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-[#5E554D]">
                      <MapPin className="w-3.5 h-3.5 text-[#B8754D] shrink-0 mt-0.5" />
                      <span>{room.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#5E554D]">
                      <Phone className="w-3.5 h-3.5 text-[#B8754D] shrink-0" />
                      <span>{room.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10.5px] text-[#857F78]">
                      <Clock className="w-3.5 h-3.5 text-[#B8754D] shrink-0" />
                      <span>{room.hours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Concierge Card */}
            <div className="bg-[#1E1916] text-white rounded-2xl border-[1.5px] border-[#B8754D] p-6 space-y-3 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8754D] block">
                Instant VIP Assistance
              </span>
              <h4 className="font-serif text-lg font-normal text-white">
                Live WhatsApp Concierge
              </h4>
              <p className="text-xs text-[#A89F91]">
                Speak directly with an interior curator for immediate pricing, stock availability, or high-res video walkthroughs.
              </p>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase rounded-lg shadow-sm transition-all"
              >
                <span>Chat On WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-2xl border-[1.5px] border-[#B8754D] p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="text-center space-y-1 pb-4 border-b border-[#B8754D]/25">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8754D]">
              Frequently Asked Questions
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#221A15]">
              Everything You Need to Know
            </h3>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#B8754D]/30 overflow-hidden bg-[#FAF7F2]"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#221A15] hover:text-[#B8754D] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#B8754D] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#5E554D] leading-relaxed border-t border-[#B8754D]/15 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
