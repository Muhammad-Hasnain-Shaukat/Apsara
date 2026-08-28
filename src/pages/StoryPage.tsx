import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Layers, ShieldCheck, Compass, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const StoryPage: React.FC = () => {
  return (
    <div className="bg-apsara-alabaster min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-20">
        
        {/* Story Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[11px] uppercase tracking-widest-luxury text-apsara-camel font-semibold block">
            The Atelier Monograph
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-apsara-espresso font-normal leading-tight">
            Sculpting Gravitational Equilibrium
          </h1>
          <p className="text-sm sm:text-base text-apsara-espresso/70 font-light leading-relaxed">
            APSARA was founded on a singular architectural conviction: that furniture should feel detached from the weight of the physical earth, elevating human dwellings into meditative sanctuaries.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] bg-apsara-frosted-sand border border-apsara-camel/30 shadow-pedestal overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
            alt="APSARA Architectural Pavilion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-apsara-espresso/60 via-transparent to-transparent flex items-end p-8 text-white">
            <span className="text-xs uppercase tracking-widest text-apsara-sandstone font-medium">
              The Northern Atelier Sanctuary • 2025
            </span>
          </div>
        </div>

        {/* Section 1: The Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          <div className="p-8 bg-[#FAF7F2] border border-apsara-camel/30 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-none bg-apsara-espresso text-apsara-sandstone flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-apsara-espresso">
              Geological Time
            </h3>
            <p className="text-xs text-apsara-espresso/70 font-light leading-relaxed">
              We harvest unhurried stones. Tuscan travertine formed across hydrothermal cascades over 50,000 years, honed by hand to retain tactile porosity.
            </p>
          </div>

          <div className="p-8 bg-[#FAF7F2] border border-apsara-camel/30 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-none bg-apsara-espresso text-apsara-sandstone flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-apsara-espresso">
              Master Joinery
            </h3>
            <p className="text-xs text-apsara-espresso/70 font-light leading-relaxed">
              Every timber join is sculpted using classical mortise-and-tenon principles. Zero visible fasteners, allowing solid walnut to expand and breathe through seasons.
            </p>
          </div>

          <div className="p-8 bg-[#FAF7F2] border border-apsara-camel/30 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-none bg-apsara-espresso text-apsara-sandstone flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-apsara-espresso">
              Centennial Heirlooms
            </h3>
            <p className="text-xs text-apsara-espresso/70 font-light leading-relaxed">
              Constructed to outlive generations. We back each architectural commission with an unconditional 10-year structural integrity guarantee.
            </p>
          </div>
        </div>

        {/* Section 2: Narrative Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8 border-t border-apsara-camel/20">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-widest text-apsara-camel font-semibold block">
              The Alchemy of Anti-Gravity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-apsara-espresso font-normal leading-snug">
              Cantilevers, Negative Space & Atmospheric Light
            </h2>
            <p className="text-xs sm:text-sm text-apsara-espresso/75 font-light leading-relaxed">
              By recessing pedestals by precise geometric increments and carving subtle shadow reveals, our dining tables, credenzas, and sofas appear detached from the floor plane.
            </p>
            <p className="text-xs sm:text-sm text-apsara-espresso/75 font-light leading-relaxed">
              This anti-gravity posture creates acoustic stillness, allowing light to flow beneath furniture and creating an aura of expansive tranquility in any interior space.
            </p>
            <div className="pt-2">
              <Link to="/catalog">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore the Commissions
                </Button>
              </Link>
            </div>
          </div>

          <div className="aspect-square bg-[#FAF7F2] border border-apsara-camel/30 p-4 shadow-pedestal">
            <img
              src="https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=85"
              alt="Atelier Precision Woodworking"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
