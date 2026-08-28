import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Eye, Compass, Palette, BookOpen, Layers, Check } from 'lucide-react';

export const InspirationPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Living' | 'Dining' | 'Bedroom' | 'Outdoor'>('All');

  const lookbooks = [
    {
      id: 'lb-1',
      title: 'The Kyoto Minimalist Penthouse',
      category: 'Living',
      description: 'Low-profile solid walnut silhouette against raw plaster walls, organic Belgian flax cushions, and warm ambient light.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      featuredPiece: 'The Alabaster Cloud Modular Sofa',
      slug: 'the-alabaster-cloud-modular-sofa',
      price: 'Rs. 89,999',
      palette: ['#2D231E', '#EAEBE7', '#B8754D', '#8C857B'],
    },
    {
      id: 'lb-2',
      title: 'The Milanese Marble & Stone Salon',
      category: 'Dining',
      description: 'Honed Roman travertine dining table with curved bouclé chairs beneath a brushed unlacquered brass chandelier.',
      image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=85',
      featuredPiece: 'The Sculptural Walnut Pedestal Table',
      slug: 'the-sculptural-walnut-pedestal-dining-table',
      price: 'Rs. 64,999',
      palette: ['#EFE7DF', '#5E4B3C', '#B8754D', '#1A1614'],
    },
    {
      id: 'lb-3',
      title: 'The Scandinavian Sanctuary Suite',
      category: 'Bedroom',
      description: 'Fluted American walnut headboard paired with crisp raw linen bedding and brass cantilever nightstand lamps.',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
      featuredPiece: 'The Aethelgard Fluted Walnut Bed',
      slug: 'the-aethelgard-fluted-walnut-bed-frame',
      price: 'Rs. 79,999',
      palette: ['#3A2F28', '#DED6CB', '#B8754D', '#FAF7F2'],
    },
    {
      id: 'lb-4',
      title: 'The Amalfi Coast Sunlit Solarium',
      category: 'Outdoor',
      description: 'Grade-A weatherproof teak daybeds with quick-dry sand cushions and wabi-sabi terracotta vessels.',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
      featuredPiece: 'The Sorrento Teak Daybed Lounge',
      slug: 'the-sorrento-weatherproof-teak-daybed-lounge',
      price: 'Rs. 58,000',
      palette: ['#9C6B48', '#E6DACF', '#7D8B7A', '#F7F4EF'],
    },
    {
      id: 'lb-5',
      title: 'The High-Ceiling Heritage Library',
      category: 'Living',
      description: 'Sculptural curved lounge chairs with hand-woven wool rugs, solid oak credenzas, and floor-to-ceiling bookshelves.',
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=85',
      featuredPiece: 'The Dune Curved Linen Lounge Chair',
      slug: 'the-dune-curved-linen-lounge-chair',
      price: 'Rs. 34,999',
      palette: ['#281E19', '#C2B8AC', '#B8754D', '#E2DCD5'],
    },
    {
      id: 'lb-6',
      title: 'The Contemporary Executive Studio',
      category: 'Living',
      description: 'Monument arch walnut credenza, ribbed travertine pedestals, and muted earth tones designed for deep focus.',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85',
      featuredPiece: 'The Monument Arch Walnut Credenza',
      slug: 'the-monument-arch-walnut-credenza',
      price: 'Rs. 36,999',
      palette: ['#1C1714', '#D4C9BD', '#B8754D', '#85786B'],
    },
  ];

  const filtered = activeFilter === 'All'
    ? lookbooks
    : lookbooks.filter(lb => lb.category === activeFilter);

  return (
    <div className="bg-[#EAEBE7] text-[#221A15] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFE7DF] border border-[#B8754D]/40 text-[#B8754D] text-[10px] font-bold uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3" />
            <span>EDITORIAL LOOKBOOK & INSPIRATION</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#221A15] font-normal leading-tight">
            Curated Architectural <br />
            <span className="italic text-[#B8754D]">Living Spaces</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5E554D] leading-relaxed">
            Explore meticulously styled sanctuaries crafted by leading interior architects. Discover how timeless timbers, tactile textiles, and honed stones harmonize in real spaces.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {(['All', 'Living', 'Dining', 'Bedroom', 'Outdoor'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeFilter === filter
                  ? 'bg-[#B8754D] text-white shadow-md'
                  : 'bg-white text-[#5E554D] hover:bg-[#EFE7DF] border border-[#B8754D]/25'
              }`}
            >
              {filter} Spaces
            </button>
          ))}
        </div>

        {/* Lookbooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border-[1.5px] border-[#B8754D] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Photo */}
              <div className="relative aspect-[16/11] overflow-hidden bg-[#FAF7F2]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85';
                  }}
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-black/65 backdrop-blur-xs text-white text-[9.5px] font-bold uppercase rounded-full tracking-wider">
                  {item.category} Lookbook
                </span>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#221A15] group-hover:text-[#B8754D] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5E554D] leading-relaxed mt-1.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Swatch Palette */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[9.5px] uppercase font-bold tracking-wider text-[#857F78] mr-1">
                    Palette:
                  </span>
                  {item.palette.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                {/* Featured Piece Card */}
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#B8754D]/25 flex items-center justify-between gap-2 mt-2">
                  <div className="overflow-hidden">
                    <span className="text-[9px] uppercase font-bold text-[#B8754D] block">
                      Featured Piece
                    </span>
                    <div className="text-xs font-bold text-[#221A15] truncate">
                      {item.featuredPiece}
                    </div>
                    <div className="text-xs font-bold text-[#B8754D]">
                      {item.price}
                    </div>
                  </div>

                  <Link
                    to={`/products/${item.slug}`}
                    className="px-3 py-1.5 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-[10.5px] font-bold uppercase rounded-lg transition-colors shrink-0 flex items-center gap-1"
                  >
                    <span>View Piece</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#DFE3DC] rounded-2xl border-[1.5px] border-[#B8754D] p-8 sm:p-12 text-center space-y-4 max-w-4xl mx-auto shadow-md">
          <div className="w-12 h-12 rounded-full bg-[#EAEBE7] border border-[#B8754D] flex items-center justify-center text-[#B8754D] mx-auto">
            <Compass className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#221A15] font-normal">
            Need Architectural Interior Consultation?
          </h2>
          <p className="text-xs sm:text-sm text-[#5E554D] max-w-lg mx-auto">
            Our atelier specialists collaborate directly with private homeowners, architects, and interior designers to compose tailored spatial layouts.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="px-7 py-3 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all"
            >
              Book Design Appointment
            </Link>
            <Link
              to="/catalog?custom=true"
              className="px-7 py-3 bg-[#EFE7DF] hover:bg-[#B8754D] text-[#221A15] hover:text-white border border-[#B8754D]/50 text-xs font-bold uppercase tracking-wider rounded-full transition-all"
            >
              Explore Custom Commissions
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
