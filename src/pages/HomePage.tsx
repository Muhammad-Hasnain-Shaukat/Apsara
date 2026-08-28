import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Armchair,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wrench,
  CheckCircle,
  Truck,
  RotateCcw,
  Headphones,
  Lock,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Layers,
  Leaf,
  Palette,
  Eye,
  Check
} from 'lucide-react';
import { QuickViewModal } from '../components/catalog/QuickViewModal';

export const HomePage: React.FC = () => {
  const [bestSellerIndex, setBestSellerIndex] = useState(0);

  // 6 Categories with ONE large HD photo per card
  const categories = [
    {
      title: 'LIVING ROOM',
      subtitle: 'Sofas, Coffee Tables & Lounge Chairs',
      categoryParam: 'Living',
      mainImage: {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85',
        label: 'Modular Sofas & Lounges'
      },
      icon: (
        <svg className="w-5 h-5 stroke-current stroke-[1.4] fill-none" viewBox="0 0 24 24">
          <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
          <path d="M3 11a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6Z" />
          <path d="M5 19v2" /><path d="M19 19v2" />
        </svg>
      ),
    },
    {
      title: 'BEDROOM',
      subtitle: 'Platform Beds, Nightstands & Wardrobes',
      categoryParam: 'Bedroom',
      mainImage: {
        url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
        label: 'Platform Beds & Suites'
      },
      icon: (
        <svg className="w-5 h-5 stroke-current stroke-[1.4] fill-none" viewBox="0 0 24 24">
          <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
        </svg>
      ),
    },
    {
      title: 'DINING ROOM',
      subtitle: 'Walnut Dining Tables & Curved Chairs',
      categoryParam: 'Dining',
      mainImage: {
        url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=85',
        label: 'Solid Wood Dining Tables'
      },
      icon: (
        <svg className="w-5 h-5 stroke-current stroke-[1.4] fill-none" viewBox="0 0 24 24">
          <path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: 'OFFICE FURNITURE',
      subtitle: 'Executive Desks, Chairs & Credenzas',
      categoryParam: 'Office',
      mainImage: {
        url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85',
        label: 'Executive Workstations'
      },
      icon: (
        <svg className="w-5 h-5 stroke-current stroke-[1.4] fill-none" viewBox="0 0 24 24">
          <rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      title: 'OUTDOOR',
      subtitle: 'Teak Lounges, Patio Sets & Daybeds',
      categoryParam: 'Outdoor',
      mainImage: {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        label: 'All-Weather Teak Lounges'
      },
      icon: (
        <svg className="w-5 h-5 stroke-current stroke-[1.4] fill-none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
        </svg>
      ),
    },
    {
      title: 'ACCESSORIES',
      subtitle: 'Ceramic Vases, Lamps & Mirrors',
      categoryParam: 'Accessories',
      mainImage: {
        url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85',
        label: 'Artisanal Vases & Lamps'
      },
      icon: (
        <svg className="w-5 h-5 stroke-current stroke-[1.4] fill-none" viewBox="0 0 24 24">
          <path d="M9 21h6" /><path d="M12 3v18" /><path d="M6 10l6-7 6 7" /><path d="M8 14h8" />
        </svg>
      ),
    },
  ];

  // 5 Best sellers
  const bestSellers = [
    {
      id: 'bs-1',
      title: 'Luxe Comfort Sofa',
      price: 'Rs. 89,999',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=85',
      slug: 'the-alabaster-cloud-modular-sofa',
    },
    {
      id: 'bs-2',
      title: 'Walnut Dining Table',
      price: 'Rs. 64,999',
      image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=85',
      slug: 'the-sculptural-walnut-pedestal-dining-table',
    },
    {
      id: 'bs-3',
      title: 'Apsara Bed Frame',
      price: 'Rs. 79,999',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=85',
      slug: 'the-aethelgard-fluted-walnut-bed-frame',
    },
    {
      id: 'bs-4',
      title: 'Heritage Lounge Chair',
      price: 'Rs. 34,999',
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=85',
      slug: 'the-dune-curved-linen-lounge-chair',
    },
    {
      id: 'bs-5',
      title: 'Modern TV Unit',
      price: 'Rs. 36,999',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=85',
      slug: 'the-monument-arch-walnut-credenza',
    },
  ];

  return (
    <div className="bg-[#EAEBE7] text-[#221A15] font-sans selection:bg-[#B8754D] selection:text-white overflow-x-hidden w-full max-w-full">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Picture placed right after Crafting Comfort on Mobile)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative px-3 sm:px-6 lg:px-8 pt-5 sm:pt-10 pb-10 sm:pb-16 lg:pb-20 bg-gradient-to-r from-[#D4D9D0] via-[#CCD2C8] to-[#C5CBC1] border-b border-[#B8754D]/30 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 lg:gap-14 items-center">
          
          {/* Left Column (Mobile & Desktop) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 relative z-10 w-full max-w-full">
            
            {/* 1. Modern Light Brown Eyebrow Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#EFE7DF] border border-[#B8754D]/40 shadow-xs max-w-full">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#B8754D] animate-pulse shrink-0" />
              <span className="text-[8.5px] sm:text-[10px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.22em] text-[#B8754D] truncate">
                CRAFTING COMFORT · CREATING MEMORIES
              </span>
            </div>

            {/* 2. High-Contrast Modern Editorial Headline */}
            <h1 className="font-serif text-[28px] sm:text-4xl lg:text-[56px] text-[#221A15] font-normal leading-[1.12] sm:leading-[1.08] tracking-tight">
              Timeless Furniture <br />
              For{' '}
              <span className="italic font-serif font-normal bg-gradient-to-r from-[#B8754D] via-[#BD6F3F] to-[#8E4A22] bg-clip-text text-transparent">
                Every Space
              </span>
            </h1>

            {/* 3. HERO PICTURE ON MOBILE (Placed right after Crafting Comfort / Headline on mobile, hidden on lg desktop) */}
            <div className="block lg:hidden w-full aspect-[16/10] rounded-[14px] overflow-hidden border-[1.5px] border-[#B8754D] shadow-lg my-3">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85"
                alt="Sunlit living room setting with cream sofa and walnut coffee table"
                loading="eager"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85';
                }}
              />
            </div>

            {/* 4. Editorial Lead Subtitle */}
            <p className="text-xs sm:text-sm lg:text-[15px] text-[#4E4740] leading-relaxed max-w-full font-light">
              Discover sculptural silhouettes and architectural living pieces, crafted with century-old walnut, honed travertine and bespoke linen.
            </p>

            {/* 5. Modern Sleek Action Buttons with Arrow Animations */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-1 sm:pt-2 w-full">
              <Link
                to="/catalog"
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-[#B8754D] to-[#8E4A22] text-white text-xs font-bold uppercase tracking-[0.14em] rounded-full shadow-md hover:shadow-xl hover:shadow-[#B8754D]/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>EXPLORE COLLECTIONS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Custom Furniture Button with Warm Light Brown Background */}
              <Link
                to="/catalog?custom=true"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#EFE7DF] hover:bg-[#B8754D] text-[#221A15] hover:text-white border border-[#B8754D]/50 text-xs font-bold uppercase tracking-[0.14em] rounded-full shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>CUSTOM FURNITURE</span>
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </Link>
            </div>

            {/* 6. 3 Modern Trust Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-6 border-t border-[#B8754D]/30 w-full">
              
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#EFE7DF] border border-[#B8754D]/30 backdrop-blur-xs hover:border-[#B8754D]/70 transition-all shadow-xs flex items-center sm:block gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#E6DACF] border border-[#B8754D]/25 flex items-center justify-center text-[#B8754D] sm:mb-2.5 shadow-2xs shrink-0">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-[11.5px] font-bold text-[#221A15]">Premium Quality</div>
                  <div className="text-[9.5px] sm:text-[10px] text-[#70685F] leading-tight mt-0.5">Finest materials crafted to last</div>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#EFE7DF] border border-[#B8754D]/30 backdrop-blur-xs hover:border-[#B8754D]/70 transition-all shadow-xs flex items-center sm:block gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#E6DACF] border border-[#B8754D]/25 flex items-center justify-center text-[#B8754D] sm:mb-2.5 shadow-2xs shrink-0">
                  <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-[11.5px] font-bold text-[#221A15]">Stylish Designs</div>
                  <div className="text-[9.5px] sm:text-[10px] text-[#70685F] leading-tight mt-0.5">Modern & classic styles for you</div>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#EFE7DF] border border-[#B8754D]/30 backdrop-blur-xs hover:border-[#B8754D]/70 transition-all shadow-xs flex items-center sm:block gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#E6DACF] border border-[#B8754D]/25 flex items-center justify-center text-[#B8754D] sm:mb-2.5 shadow-2xs shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-[11.5px] font-bold text-[#221A15]">Trusted Service</div>
                  <div className="text-[9.5px] sm:text-[10px] text-[#70685F] leading-tight mt-0.5">Customer satisfaction priority</div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Hero Image ON DESKTOP ONLY (Hidden on mobile) */}
          <div className="hidden lg:flex lg:col-span-6 relative items-center justify-center">
            <div className="relative w-full aspect-[16/11] rounded-[20px] overflow-hidden border-[1.5px] border-[#B8754D] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85"
                alt="Sunlit living room setting with cream sofa and walnut coffee table"
                loading="eager"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85';
                }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. 6-CATEGORIES CLEAN SINGLE-PHOTO SHOWCASE
         ───────────────────────────────────────────────────────────── */}
      <section className="px-3 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#EAEBE7] border-b border-[#B8754D]/20 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-[1.5px] border-[#B8754D]/30 pb-3">
            <div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8754D] block">
                CURATED SPACES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#221A15] font-normal">
                Explore By Category
              </h2>
            </div>
            <Link
              to="/catalog"
              className="text-xs font-bold text-[#B8754D] hover:text-[#8E4A22] flex items-center gap-1 uppercase tracking-wider transition-colors"
            >
              <span>View All Collections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 6 Category Cards: Single Picture, responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {categories.map((cat) => (
              <Link
                key={cat.title}
                to={`/catalog?category=${cat.categoryParam}`}
                className="bg-white rounded-[16px] sm:rounded-[18px] p-3.5 sm:p-5 border-[1.5px] border-[#B8754D] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 block w-full overflow-hidden"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FAF7F2] border-[1.5px] border-[#B8754D]/40 flex items-center justify-center text-[#B8754D] group-hover:scale-110 transition-transform shrink-0 shadow-2xs">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#221A15] group-hover:text-[#B8754D] transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-[9.5px] sm:text-[10.5px] text-[#857F78] leading-tight">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#B8754D] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>EXPLORE</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </span>
                </div>

                {/* Single Large HD Showcase Picture */}
                <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-[10px] sm:rounded-[12px] overflow-hidden bg-[#FAF7F2] border border-[#B8754D]/20 w-full">
                  <img
                    src={cat.mainImage.url}
                    alt={cat.mainImage.label}
                    loading="eager"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-black/70 backdrop-blur-md text-white text-[9.5px] sm:text-[10.5px] font-medium rounded-[5px] sm:rounded-[6px] shadow-sm">
                    {cat.mainImage.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. EDITORIAL BLOCK 1: Where Design Meets Craftsmanship
         ───────────────────────────────────────────────────────────── */}
      <section className="px-3 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#EAEBE7] border-b border-[#B8754D]/20 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center">
          
          {/* Top/Left: Photo with Exact Slim 1.5px Terracotta Border */}
          <div className="lg:col-span-6 w-full">
            <div className="w-full aspect-[16/10] sm:aspect-[16/11] rounded-[14px] sm:rounded-[18px] overflow-hidden border-[1.5px] border-[#B8754D] shadow-md">
              <img
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=85"
                alt="Where Design Meets Craftsmanship Dining Room Setting"
                loading="eager"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1400&q=85';
                }}
              />
            </div>
          </div>

          {/* Bottom/Right: Text & 4 Feature Badges */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 w-full">
            
            <div className="space-y-2 sm:space-y-3">
              <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8754D]">
                ABOUT APSARA
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#221A15] font-normal leading-tight">
                Where Design Meets <br />
                <span className="text-[#B8754D] font-serif">Craftsmanship</span>
              </h2>

              <p className="text-xs sm:text-xs text-[#5E554D] leading-relaxed">
                At Apsara, we believe furniture is more than just décor - it's a part of your life. Our pieces are thoughtfully designed and meticulously crafted to bring beauty, comfort and functionality to your spaces.
              </p>
            </div>

            {/* 4 Feature Badges in responsive grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-2 border-t border-[#B8754D]/25 w-full">
              
              <div className="flex items-start gap-2 sm:gap-2.5">
                <div className="text-[#B8754D] mt-0.5 shrink-0">
                  <Sparkles className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#221A15]">Elegant Designs</h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-[#857F78]">Timeless pieces</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-2.5">
                <div className="text-[#B8754D] mt-0.5 shrink-0">
                  <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#221A15]">Quality Materials</h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-[#857F78]">Sourced for strength</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-2.5">
                <div className="text-[#B8754D] mt-0.5 shrink-0">
                  <Wrench className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#221A15]">Expert Craft</h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-[#857F78]">Precision detail</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-2.5">
                <div className="text-[#B8754D] mt-0.5 shrink-0">
                  <CheckCircle className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#221A15]">Made for You</h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-[#8E7F74]">Custom solutions</p>
                </div>
              </div>

            </div>

            <div className="pt-1">
              <Link
                to="/story"
                className="inline-block px-5 py-2.5 border-[1.5px] border-[#B8754D] text-[#B8754D] hover:bg-[#B8754D] hover:text-white text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all rounded-[4px]"
              >
                DISCOVER OUR STORY
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. EDITORIAL BLOCK 2: The Art of Custom Living (Alternate Layout)
         ───────────────────────────────────────────────────────────── */}
      <section className="px-3 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#E2E5E0] border-b border-[#B8754D]/20 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center">
          
          {/* Top/Right on Mobile: Living Room Bespoke Photo with Exact 1.5px Terracotta Border */}
          <div className="lg:col-span-6 order-1 lg:order-2 w-full">
            <div className="w-full aspect-[16/10] sm:aspect-[16/11] rounded-[14px] sm:rounded-[18px] overflow-hidden border-[1.5px] border-[#B8754D] shadow-md">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85"
                alt="Custom Atelier Living Room Silhouette"
                loading="eager"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85';
                }}
              />
            </div>
          </div>

          {/* Bottom/Left on Mobile: Text & 4 Bespoke Atelier Badges */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 order-2 lg:order-1 w-full">
            
            <div className="space-y-2 sm:space-y-3">
              <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8754D]">
                CUSTOM ATELIER
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#221A15] font-normal leading-tight">
                Tailored Specifically <br />
                <span className="text-[#B8754D] font-serif">To Your Vision</span>
              </h2>

              <p className="text-xs sm:text-xs text-[#5E554D] leading-relaxed">
                Every space holds a distinct rhythm. Work with our master joiners to customize dimensions, select hand-rubbed timber finishes, and choose from over 80 tactile European textiles.
              </p>
            </div>

            {/* 4 Feature Badges in responsive grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-2 border-t border-[#B8754D]/25 w-full">
              
              <div className="flex items-start gap-2 sm:gap-2.5">
                <div className="text-[#B8754D] mt-0.5 shrink-0">
                  <Compass className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#221A15]">Exact Scale</h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-[#857F78]">Scaled precision</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-2.5">
                <div className="text-[#B8754D] mt-0.5 shrink-0">
                  <Palette className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#221A15]">Curated Finishes</h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-[#857F78]">Hand-rubbed oils</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-2.5">
                <div className="text-[#B8754D] mt-0.5 shrink-0">
                  <Eye className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#221A15]">3D Visualization</h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-[#857F78]">Room render first</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-2.5">
                <div className="text-[#B8754D] mt-0.5 shrink-0">
                  <Check className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#221A15]">White-Glove</h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-[#8E7F74]">Direct room assembly</p>
                </div>
              </div>

            </div>

            <div className="pt-1">
              <Link
                to="/catalog?custom=true"
                className="inline-block px-5 py-2.5 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all rounded-[4px] shadow-sm"
              >
                START BESPOKE COMMISSION
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. EDITORIAL BLOCK 3: Sustainable Materials & Earth-Born Luxury
         ───────────────────────────────────────────────────────────── */}
      <section className="px-3 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#EAEBE7] border-b border-[#B8754D]/20 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center">
          
          {/* Top/Left on Mobile: Bedroom & Natural Oak Photo with Exact 1.5px Terracotta Border */}
          <div className="lg:col-span-6 w-full">
            <div className="w-full aspect-[16/10] sm:aspect-[16/11] rounded-[14px] sm:rounded-[18px] overflow-hidden border-[1.5px] border-[#B8754D] shadow-md">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85"
                alt="Sustainable Materials and Master Craftsmanship"
                loading="eager"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=85';
                }}
              />
            </div>
          </div>

          {/* Bottom/Right on Mobile: Text & 4 Sustainability Badges */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 w-full">
            
            <div className="space-y-2 sm:space-y-3">
              <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8754D]">
                SUSTAINABLE HERITAGE
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#221A15] font-normal leading-tight">
                Earth-Born Luxury, <br />
                <span className="text-[#B8754D] font-serif">Generational Durability</span>
              </h2>

              <p className="text-xs sm:text-xs text-[#5E554D] leading-relaxed">
                We select exclusively FSC-certified American walnut, Roman travertine, and unlacquered raw brass. No synthetic veneers, no toxic adhesives - only authentic heirloom substance designed to outlive trends.
              </p>
            </div>

            {/* 4 Sustainability Badges in responsive grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-2 border-t border-[#B8754D]/25 w-full">
              
              <div className="flex items-start gap-2 sm:gap-2.5">
                <div className="text-[#B8754D] mt-0.5 shrink-0">
                  <Leaf className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#221A15]">FSC Hardwoods</h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-[#857F78]">100% sustainable</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-2.5">
                <div className="text-[#B8754D] mt-0.5 shrink-0">
                  <Layers className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#221A15]">Travertine</h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-[#857F78]">Honed stone</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-2.5">
                <div className="text-[#B8754D] mt-0.5 shrink-0">
                  <Sparkles className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#221A15]">Beeswax Oils</h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-[#857F78]">Zero toxic sealants</p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-2.5">
                <div className="text-[#B8754D] mt-0.5 shrink-0">
                  <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#221A15]">Lifetime Quality</h4>
                  <p className="text-[8.5px] sm:text-[9.5px] text-[#8E7F74]">Generational warranty</p>
                </div>
              </div>

            </div>

            <div className="pt-1">
              <Link
                to="/story"
                className="inline-block px-5 py-2.5 border-[1.5px] border-[#B8754D] text-[#B8754D] hover:bg-[#B8754D] hover:text-white text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all rounded-[4px]"
              >
                OUR MATERIAL PHILOSOPHY
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. BEST SELLERS SECTION
         ───────────────────────────────────────────────────────────── */}
      <section className="px-3 sm:px-6 lg:px-8 py-10 sm:py-12 bg-[#EAEBE7] border-b border-[#B8754D]/20 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
          
          {/* Header with Title & Arrow Buttons */}
          <div className="flex items-center justify-between border-b-[1.5px] border-[#B8754D]/30 pb-2">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-[#221A15]">
              BEST SELLERS
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBestSellerIndex((prev) => Math.max(0, prev - 1))}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-[1.5px] border-[#B8754D]/60 hover:border-[#B8754D] hover:text-[#B8754D] flex items-center justify-center text-[#5E554D] bg-white transition-colors"
                title="Previous"
              >
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <button
                onClick={() => setBestSellerIndex((prev) => Math.min(bestSellers.length - 1, prev + 1))}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-[1.5px] border-[#B8754D]/60 hover:border-[#B8754D] hover:text-[#B8754D] flex items-center justify-center text-[#5E554D] bg-white transition-colors"
                title="Next"
              >
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>

          {/* 5 Product Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 w-full">
            {bestSellers.map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.slug}`}
                className="bg-white rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3 border-[1.5px] border-[#B8754D] hover:shadow-md transition-all duration-300 flex flex-col justify-between group w-full overflow-hidden"
              >
                {/* Photo */}
                <div className="aspect-[4/3] rounded-[8px] sm:rounded-[10px] overflow-hidden bg-[#FAF7F2] mb-2 sm:mb-2.5 w-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="eager"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=85';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="space-y-0.5 sm:space-y-1">
                  <h3 className="text-[11px] sm:text-xs font-bold text-[#221A15] group-hover:text-[#B8754D] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="text-[11px] sm:text-xs font-bold text-[#B8754D]">
                    {item.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. 4-TIER GUARANTEE / TRUST BAR
         ───────────────────────────────────────────────────────────── */}
      <section className="px-3 sm:px-6 lg:px-8 py-6 sm:py-7 bg-[#DFE3DC] border-y-[1.5px] border-[#B8754D]/40 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="text-[#B8754D] shrink-0">
              <Truck className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.5]" />
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#221A15]">FREE DELIVERY</div>
              <div className="text-[8.5px] sm:text-[10px] text-[#857F78]">Orders above Rs. 50k</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="text-[#B8754D] shrink-0">
              <Lock className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.5]" />
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#221A15]">SECURE PAYMENT</div>
              <div className="text-[8.5px] sm:text-[10px] text-[#857F78]">100% secure checkout</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="text-[#B8754D] shrink-0">
              <RotateCcw className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.5]" />
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#221A15]">EASY RETURNS</div>
              <div className="text-[8.5px] sm:text-[10px] text-[#857F78]">Within 7 days</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="text-[#B8754D] shrink-0">
              <Headphones className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.5]" />
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#221A15]">24/7 SUPPORT</div>
              <div className="text-[8.5px] sm:text-[10px] text-[#857F78]">Dedicated team</div>
            </div>
          </div>

        </div>
      </section>

      {/* QuickView Modal */}
      <QuickViewModal />

    </div>
  );
};
