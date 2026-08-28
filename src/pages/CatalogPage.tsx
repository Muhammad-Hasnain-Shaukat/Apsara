import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, X, Sparkles, Filter } from 'lucide-react';
import { Product, FilterState, ProductCategory } from '../types';
import { productsApi } from '../api/client';
import { ProductCard } from '../components/catalog/ProductCard';
import { FilterSidebar } from '../components/catalog/FilterSidebar';
import { QuickViewModal } from '../components/catalog/QuickViewModal';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: wishlistItems } = useWishlistStore();
  const { openQuickView } = useUIStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([
    'Living',
    'Dining',
    'Bedroom',
    'Storage',
    'Lighting',
    'Office',
    'Outdoor',
    'Accessories',
  ]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Parse all query params
  const categoryParam = searchParams.get('category') || 'All';
  const isWishlistMode = searchParams.get('wishlist') === 'true';
  const isFeaturedMode = searchParams.get('featured') === 'true';
  const isCustomMode = searchParams.get('custom') === 'true';
  const sortParam = (searchParams.get('sort') as FilterState['sort']) || (isFeaturedMode ? 'featured' : 'featured');
  const searchParam = searchParams.get('q') || '';

  const [filters, setFilters] = useState<FilterState>({
    category: categoryParam,
    material: 'All',
    minPrice: 0,
    maxPrice: 100000,
    inStock: false,
    search: searchParam,
    sort: sortParam,
  });

  // Sync state whenever URL searchParams change
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const sort = (searchParams.get('sort') as FilterState['sort']) || 'featured';
    const q = searchParams.get('q') || '';
    setFilters((prev) => ({
      ...prev,
      category: cat,
      sort: sort,
      search: q,
    }));
  }, [searchParams]);

  useEffect(() => {
    async function loadCatalog() {
      setIsLoading(true);
      try {
        const [metaData, prodData] = await Promise.all([
          productsApi.getFilterMeta(),
          productsApi.getAll(),
        ]);
        if (metaData) {
          setCategories(metaData.categories as ProductCategory[]);
          setMaterials(metaData.materials);
        }
        if (prodData && prodData.products) {
          setProducts(prodData.products);
        }
      } catch (err) {
        console.error('Failed to load catalog', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      if (updates.category !== undefined) {
        if (updates.category === 'All') {
          searchParams.delete('category');
        } else {
          searchParams.set('category', updates.category);
        }
        setSearchParams(searchParams);
      }
      if (updates.sort !== undefined) {
        if (updates.sort === 'featured') {
          searchParams.delete('sort');
        } else {
          searchParams.set('sort', updates.sort);
        }
        setSearchParams(searchParams);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setFilters({
      category: 'All',
      material: 'All',
      minPrice: 0,
      maxPrice: 100000,
      inStock: false,
      search: '',
      sort: 'featured',
    });
  };

  const filteredProducts = useMemo(() => {
    let list = isWishlistMode ? wishlistItems : products;

    // Search query filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.materials.some((m) => m.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filters.category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Best Sellers / Featured filter
    if (isFeaturedMode) {
      list = list.filter((p) => p.is_featured);
    }

    // Custom Furniture filter (pieces with customizable finishes)
    if (isCustomMode) {
      list = list.filter((p) => p.finish_options && p.finish_options.length > 0);
    }

    // Material filter
    if (filters.material !== 'All') {
      list = list.filter((p) =>
        p.materials.some((m) => m.toLowerCase().includes(filters.material.toLowerCase()))
      );
    }

    // In Stock filter
    if (filters.inStock) {
      list = list.filter((p) => p.stock > 0);
    }

    // Price range filter
    list = list.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    // Sorting
    const sorted = [...list];
    if (filters.sort === 'price_asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price_desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'newest') {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (filters.sort === 'featured') {
      sorted.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return sorted;
  }, [products, wishlistItems, isWishlistMode, isFeaturedMode, isCustomMode, filters]);

  // Page Title Helper
  const getPageTitle = () => {
    if (isWishlistMode) return 'Saved Pieces';
    if (isFeaturedMode) return 'Best Sellers';
    if (isCustomMode) return 'Custom Furniture';
    if (filters.category !== 'All') return `${filters.category} Collection`;
    if (filters.sort === 'newest') return 'New Arrivals';
    return 'All Furniture';
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-[#231B15]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-[#B8754D] font-bold block">
            {isWishlistMode ? 'Wishlist' : 'APSARA ATELIER'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#231B15]">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-[#786E65] leading-relaxed max-w-md mx-auto">
            {isCustomMode
              ? 'Handcrafted bespoke pieces with tailored finish options, made to order by master artisans.'
              : isFeaturedMode
              ? 'Our most coveted, signature silhouettes designed for timeless architectural living.'
              : 'Sculptural silhouettes and timeless heirlooms crafted from premium sustainably harvested hardwoods.'}
          </p>
        </div>

        {/* Search & Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
          
          {/* Quick Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E7F74]" />
            <input
              type="text"
              placeholder="Search by title, wood, fabric..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full pl-10 pr-8 py-2 bg-white border border-[#E8E2D8] rounded-full text-xs placeholder-[#A5998E] focus:outline-none focus:border-[#B8754D] transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange({ search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E7F74] hover:text-[#231B15]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Category Tabs for Instant Switching */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => handleFilterChange({ category: 'All' })}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all ${
                filters.category === 'All' && !isFeaturedMode && !isCustomMode
                  ? 'bg-[#B8754D] text-white shadow-xs'
                  : 'bg-white text-[#5E554D] hover:bg-[#EFE7DF] hover:text-[#B8754D] border border-[#E8E2D8]'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange({ category: cat })}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  filters.category.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#B8754D] text-white shadow-xs'
                    : 'bg-white text-[#5E554D] hover:bg-[#EFE7DF] hover:text-[#B8754D] border border-[#E8E2D8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Action: Mobile Filter Toggle & Sort Selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2D8] rounded-full text-xs font-semibold hover:border-[#B8754D]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8E7F74] hidden sm:inline">Sort:</span>
              <select
                value={filters.sort}
                onChange={(e) =>
                  handleFilterChange({ sort: e.target.value as FilterState['sort'] })
                }
                className="bg-white border border-[#E8E2D8] rounded-full px-3.5 py-1.5 text-xs text-[#231B15] focus:outline-none focus:border-[#B8754D]"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="newest">New Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Active Filter Chips */}
        {(filters.category !== 'All' || filters.material !== 'All' || isFeaturedMode || isCustomMode || filters.inStock) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-[#8E7F74]">Active Filters:</span>
            {filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFE7DF] border border-[#B8754D]/30 rounded-full text-[11px] font-semibold text-[#B8754D]">
                Category: {filters.category}
                <button onClick={() => handleFilterChange({ category: 'All' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {isFeaturedMode && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFE7DF] border border-[#B8754D]/30 rounded-full text-[11px] font-semibold text-[#B8754D]">
                Best Sellers
                <Link to="/catalog">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {isCustomMode && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFE7DF] border border-[#B8754D]/30 rounded-full text-[11px] font-semibold text-[#B8754D]">
                Custom Furniture
                <Link to="/catalog">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {filters.material !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFE7DF] border border-[#B8754D]/30 rounded-full text-[11px] font-semibold text-[#B8754D]">
                Material: {filters.material}
                <button onClick={() => handleFilterChange({ material: 'All' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#B8754D] hover:underline font-semibold ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Main Grid & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              filters={filters}
              categories={categories}
              materials={materials}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Product Gallery Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl p-4 border border-[#E8E2D8] animate-pulse space-y-4"
                  >
                    <div className="aspect-[4/3] bg-[#E8E2D8] rounded-xl" />
                    <div className="h-4 bg-[#E8E2D8] rounded w-3/4" />
                    <div className="h-3 bg-[#E8E2D8] rounded w-1/2" />
                    <div className="h-5 bg-[#E8E2D8] rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E2D8] space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center mx-auto text-[#8E7F74]">
                  <Grid className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-lg text-[#231B15]">No pieces found</h3>
                <p className="text-xs text-[#786E65] max-w-sm mx-auto">
                  Try adjusting your search criteria or resetting filters to explore our full collection.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-block px-6 py-2.5 bg-[#B8754D] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#8E4A22] transition-colors"
                >
                  View All Pieces
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#786E65]">
                  <span>Showing {filteredProducts.length} unique pieces</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onQuickView={openQuickView}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
              <h3 className="font-serif text-lg">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-[#8E7F74] hover:text-[#231B15]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              categories={categories}
              materials={materials}
              onFilterChange={(u) => {
                handleFilterChange(u);
                setIsMobileFilterOpen(false);
              }}
              onReset={() => {
                handleResetFilters();
                setIsMobileFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* QuickView Modal */}
      <QuickViewModal />

    </div>
  );
};
