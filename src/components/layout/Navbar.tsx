import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, ChevronDown, Menu, X, Shield, LogOut, ChevronRight, LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { openAuthModal, openCartDrawer, addToast } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);

  // Secret Triple-Click Trigger
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastClickTime < 700) {
      const newCount = logoClickCount + 1;
      if (newCount >= 3) {
        e.preventDefault();
        setLogoClickCount(0);
        navigate('/admin');
        addToast('Secret Atelier Admin Portal Unlocked', 'info');
        return;
      }
      setLogoClickCount(newCount);
    } else {
      setLogoClickCount(1);
    }
    setLastClickTime(now);
  };

  const cartCount = getItemCount();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/story' },
    {
      label: 'Collections',
      href: '/catalog?category=Living',
      hasDropdown: true,
      subItems: [
        { label: 'Living Room', href: '/catalog?category=Living' },
        { label: 'Bedroom', href: '/catalog?category=Bedroom' },
        { label: 'Dining Room', href: '/catalog?category=Dining' },
        { label: 'Office Furniture', href: '/catalog?category=Office' },
        { label: 'Outdoor', href: '/catalog?category=Outdoor' },
        { label: 'Accessories', href: '/catalog?category=Accessories' },
      ],
    },
    {
      label: 'Shop',
      href: '/catalog',
      hasDropdown: true,
      subItems: [
        { label: 'All Furniture', href: '/catalog' },
        { label: 'Best Sellers', href: '/catalog?featured=true' },
        { label: 'New Arrivals', href: '/catalog?sort=newest' },
      ],
    },
    { label: 'Custom Furniture', href: '/catalog?custom=true' },
    { label: 'Inspiration', href: '/inspiration' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#B8754D] text-white transition-all duration-300 shadow-md w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 w-full">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18 w-full">
          
          {/* Brand Logo with Secret Triple-Click Portal Activation */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-1.5 group shrink-0 py-1 select-none cursor-pointer"
            title="APSARA Luxury Furniture (Triple-click for Atelier Portal)"
          >
            {/* White Sofa Icon */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center shrink-0">
              <img
                src="/apsara-logo.png"
                alt="APSARA Logo"
                className="w-full h-full object-contain brightness-0 invert group-hover:scale-105 transition-transform"
              />
            </div>

            {/* APSARA Typography */}
            <span className="font-serif text-base sm:text-lg lg:text-xl tracking-[0.18em] sm:tracking-[0.22em] text-white uppercase font-bold leading-none pl-0.5">
              APSARA
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-6">
            {navLinks.map((link) => {
              // Exact active link condition (prevent duplicate active underlines)
              const isPathMatch = location.pathname === link.href.split('?')[0];
              const isQueryMatch = link.href.includes('?') 
                ? location.search === `?${link.href.split('?')[1]}`
                : !location.search;
              
              const isActive = isPathMatch && isQueryMatch;
              const isDropdownVisible = openDropdown === link.label;

              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={link.href}
                    onClick={() => {
                      if (link.hasDropdown) {
                        setOpenDropdown((prev) => (prev === link.label ? null : link.label));
                      }
                    }}
                    className={`text-[12px] uppercase tracking-wider font-semibold transition-all py-2.5 flex items-center gap-1 cursor-pointer relative ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-white/85 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown && (
                      <ChevronDown
                        className={`w-3 h-3 text-white/75 transition-transform duration-200 ${
                          isDropdownVisible ? 'rotate-180 text-white' : ''
                        }`}
                      />
                    )}

                    {/* Clean Subtle Active Indicator Bar */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
                    )}
                  </Link>

                  {/* Submenu Dropdown Container (Full Display with bridge padding) */}
                  {link.hasDropdown && link.subItems && (
                    <div
                      className={`absolute left-0 top-full pt-2 w-56 z-50 transition-all duration-150 ${
                        isDropdownVisible ? 'block opacity-100' : 'hidden'
                      }`}
                    >
                      <div className="bg-white text-[#221A15] border border-[#B8754D]/30 shadow-2xl rounded-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                        {link.subItems.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.href}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-2.5 text-xs font-medium text-[#5E554D] hover:bg-[#EFE7DF] hover:text-[#B8754D] transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3.5 text-white shrink-0">
            
            {/* Search Icon */}
            <Link
              to="/catalog"
              className="p-1.5 hover:text-white/80 transition-colors flex items-center justify-center"
              title="Search Catalog"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.8]" />
            </Link>

            {/* Desktop User Account Profile */}
            {isAuthenticated && user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="p-1.5 hover:text-white/80 transition-colors flex items-center gap-1"
                >
                  <User className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.8]" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white text-[#221A15] border border-[#B8754D]/30 shadow-xl rounded-md py-1.5 z-50">
                    <div className="px-3.5 py-1.5 border-b border-[#B8754D]/20">
                      <p className="text-[11px] font-semibold text-[#221A15] truncate">{user.full_name}</p>
                      <p className="text-[9.5px] text-[#857F78] truncate">{user.email}</p>
                    </div>

                    {user.role === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-1.5 text-[11px] text-[#B8754D] font-bold hover:bg-[#FAF7F2]"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Admin Control Suite</span>
                      </Link>
                    ) : (
                      <Link
                        to="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-1.5 text-[11px] text-[#5E554D] hover:bg-[#FAF7F2] hover:text-[#B8754D]"
                      >
                        <User className="w-3 h-3" />
                        <span>My Account & Orders</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-1.5 text-[11px] text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden md:flex p-1.5 hover:text-white/80 transition-colors"
                title="Account Login"
              >
                <User className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.8]" />
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={openCartDrawer}
              className="relative p-1.5 hover:text-white/80 transition-colors flex items-center justify-center"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.8]" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white text-[#B8754D] text-[8px] sm:text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-white hover:text-white/80 transition-transform active:scale-95 flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 stroke-[2]" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/20 space-y-2 bg-[#B8754D] animate-in slide-in-from-top-2 duration-200">
            
            {/* User Account / Login Row in Mobile Drawer */}
            <div className="bg-black/15 rounded-lg p-3 mb-3">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{user.full_name}</p>
                      <p className="text-[10px] text-white/70">{user.email}</p>
                    </div>
                    <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded font-bold uppercase">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                    {user.role === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[11px] text-amber-200 hover:text-white underline font-bold"
                      >
                        Admin Control Suite
                      </Link>
                    ) : (
                      <Link
                        to="/account"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[11px] text-white/90 hover:text-white underline"
                      >
                        My Orders & Account
                      </Link>
                    )}
                    <span className="text-white/40">·</span>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        navigate('/');
                      }}
                      className="text-[11px] text-red-200 hover:text-white underline"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white text-[#B8754D] text-xs font-bold uppercase rounded-md shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>SIGN IN / CREATE ACCOUNT</span>
                </button>
              )}
            </div>

            {/* Navigation Links */}
            {navLinks.map((link) => {
              const isExpanded = mobileExpandedSection === link.label;

              return (
                <div key={link.label} className="border-b border-white/10 pb-2">
                  <div className="flex items-center justify-between">
                    <Link
                      to={link.href}
                      onClick={() => !link.hasDropdown && setIsMobileMenuOpen(false)}
                      className="block py-1.5 text-xs uppercase tracking-wider text-white font-bold"
                    >
                      {link.label}
                    </Link>

                    {link.hasDropdown && (
                      <button
                        onClick={() =>
                          setMobileExpandedSection((prev) => (prev === link.label ? null : link.label))
                        }
                        className="p-2 text-white/80 hover:text-white"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Sub-items for mobile */}
                  {link.hasDropdown && link.subItems && isExpanded && (
                    <div className="pl-3 pt-1 pb-1 space-y-1 bg-black/10 rounded-lg mt-1">
                      {link.subItems.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 px-3 text-[11.5px] text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        >
                          <span>{sub.label}</span>
                          <ChevronRight className="w-3 h-3 text-white/60" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};
