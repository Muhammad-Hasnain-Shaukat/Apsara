import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SecretAdminModal } from '../common/SecretAdminModal';

export const Footer: React.FC = () => {
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);

  return (
    <footer className="bg-[#DFE3DC] text-[#221A15] pt-14 pb-8 border-t border-[#B8754D]/30 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-[#B8754D]/25">
          
          {/* Brand Column (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img
                  src="/apsara-logo.png"
                  alt="APSARA Logo"
                  className="w-full h-full object-contain brightness-0"
                />
              </div>
              <span className="font-serif text-lg tracking-[0.2em] uppercase font-bold text-[#221A15]">
                APSARA
              </span>
            </div>

            <p className="text-xs text-[#5E554D] leading-relaxed max-w-sm">
              Discover Pakistan's finest solid wood and luxury furniture atelier. From bespoke handcrafted sofas to master dining sets, crafted for timeless living.
            </p>

            <div className="space-y-1 text-xs text-[#5E554D]">
              <p>📍 Main Boulevard, Gulberg III, Lahore, Pakistan</p>
              <p>📞 +92 42 3578 9900 | ✉️ atelier@apsara.com</p>
            </div>
          </div>

          {/* Quick Links (Col 5-6) */}
          <div className="lg:col-span-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#AD6A42] mb-3">
              EXPLORE
            </h5>
            <ul className="space-y-2 text-xs text-[#5E554D]">
              <li><Link to="/catalog" className="hover:text-[#AD6A42] transition-colors">All Furniture</Link></li>
              <li><Link to="/catalog?featured=true" className="hover:text-[#AD6A42] transition-colors">Best Sellers</Link></li>
              <li><Link to="/catalog?sort=newest" className="hover:text-[#AD6A42] transition-colors">New Arrivals</Link></li>
              <li><Link to="/catalog?custom=true" className="hover:text-[#AD6A42] transition-colors">Custom Designs</Link></li>
              <li><Link to="/inspiration" className="hover:text-[#AD6A42] transition-colors">Lookbook</Link></li>
            </ul>
          </div>

          {/* Customer Care (Col 7-8) */}
          <div className="lg:col-span-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#AD6A42] mb-3">
              CLIENT CARE
            </h5>
            <ul className="space-y-2 text-xs text-[#5E554D]">
              <li><Link to="/contact" className="hover:text-[#AD6A42] transition-colors">Showrooms</Link></li>
              <li><Link to="/contact" className="hover:text-[#AD6A42] transition-colors">Bespoke Inquiries</Link></li>
              <li><Link to="/story" className="hover:text-[#AD6A42] transition-colors">Artisan Heritage</Link></li>
              <li><Link to="/contact" className="hover:text-[#AD6A42] transition-colors">Delivery & FAQ</Link></li>
            </ul>
          </div>

          {/* Categories (Col 9-10) */}
          <div className="lg:col-span-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#AD6A42] mb-3">
              COLLECTIONS
            </h5>
            <ul className="space-y-2 text-xs text-[#5E554D]">
              <li><Link to="/catalog?category=Living" className="hover:text-[#AD6A42] transition-colors">Living Room</Link></li>
              <li><Link to="/catalog?category=Bedroom" className="hover:text-[#AD6A42] transition-colors">Bedroom</Link></li>
              <li><Link to="/catalog?category=Dining" className="hover:text-[#AD6A42] transition-colors">Dining Room</Link></li>
              <li><Link to="/catalog?category=Office" className="hover:text-[#AD6A42] transition-colors">Office</Link></li>
              <li><Link to="/catalog?category=Outdoor" className="hover:text-[#AD6A42] transition-colors">Outdoor</Link></li>
            </ul>
          </div>

          {/* Newsletter (Col 11-12) */}
          <div className="lg:col-span-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#AD6A42] mb-2">
              NEWSLETTER
            </h5>
            <p className="text-[11px] text-[#5E554D] mb-3">
              Subscribe to receive exclusive lookbooks and new collection debuts.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to APSARA newsletter.');
              }}
              className="space-y-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-white border border-[#AD6A42]/40 px-3 py-2 text-xs text-[#221A15] placeholder-[#857F78] focus:outline-none focus:border-[#AD6A42] rounded-[3px]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#AD6A42] hover:bg-[#8E4A22] text-white text-[11px] font-bold uppercase tracking-wider transition-colors rounded-[3px] shadow-sm"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Natural text with inlined black secret symbol */}
        <div className="pt-6 text-center text-xs text-[#5E554D] select-none">
          <span>© {new Date().getFullYear()} APSARA Luxury Furniture. All Rights Reserved. </span>
          <span
            onClick={() => setIsSecretModalOpen(true)}
            className="text-black font-serif text-sm cursor-pointer select-none hover:opacity-75 transition-opacity ml-0.5 inline-block"
            title=""
          >
            ⟡
          </span>
        </div>

      </div>

      {/* Secret Master Admin Authentication Modal */}
      <SecretAdminModal
        isOpen={isSecretModalOpen}
        onClose={() => setIsSecretModalOpen(false)}
      />
    </footer>
  );
};
