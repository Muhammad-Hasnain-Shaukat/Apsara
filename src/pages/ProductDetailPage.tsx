import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { productsApi } from '../api/client';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';
import { formatCurrency } from '../utils/formatters';
import { ProductCard } from '../components/catalog/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFinishIndex, setSelectedFinishIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'materials' | 'dimensions' | 'craft' | 'shipping'>('materials');

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useUIStore();

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await productsApi.getBySlugOrId(slug);
        setProduct(data.product);
        if (data.related) {
          setRelatedProducts(data.related);
        }
      } catch (err) {
        console.error('Failed to load piece', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-apsara-camel border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen pt-32 pb-24 px-4 text-center text-[#231B15]">
        <h2 className="font-serif text-3xl">Piece Not Found</h2>
        <p className="text-xs text-[#8E7F74] mt-2">The requested furniture item could not be located.</p>
        <Link to="/catalog" className="mt-4 inline-block px-6 py-2.5 bg-apsara-camel text-white text-xs font-semibold rounded-[3px]">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const currentFinish = product.finish_options?.[selectedFinishIndex];
  const activeImage = currentFinish?.image || product.images[selectedImageIndex] || product.images[0];

  const handleAddToCart = () => {
    addItem(product, currentFinish?.label, quantity);
    addToast(`${quantity} × ${product.title} added to bag`, 'success');
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-[#231B15]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Back Link */}
        <div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs text-[#8E7F74] hover:text-apsara-camel font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collections</span>
          </Link>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Gallery */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative aspect-[4/3] bg-white rounded-[8px] border border-[#E8DFD3] p-4 flex items-center justify-center overflow-hidden shadow-sm">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover rounded-[4px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85';
                }}
              />

              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2 rounded-full bg-white shadow-sm border border-[#E8DFD3] transition-all ${
                    isFavorite ? 'text-red-500' : 'text-[#6B5E54] hover:text-apsara-camel'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2.5">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square bg-white rounded-[4px] border overflow-hidden transition-all ${
                    selectedImageIndex === idx
                      ? 'border-apsara-camel ring-1 ring-apsara-camel'
                      : 'border-[#E8DFD3] hover:border-[#D9C8B4]'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=85';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details & Ordering */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-[9.5px] uppercase tracking-widest text-[#8E7F74] font-semibold block">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#231B15] font-normal mt-1">
                {product.title}
              </h1>
              <div className="font-serif text-2xl text-apsara-camel font-bold mt-2">
                {formatCurrency(product.price)}
              </div>
            </div>

            <p className="text-xs text-[#6B5E54] leading-relaxed">
              {product.description}
            </p>

            {/* Finish Options */}
            {product.finish_options && product.finish_options.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-[#E8DFD3]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-[#8E7F74] font-semibold">
                    Finish:
                  </span>
                  <span className="text-[#231B15] font-medium">{currentFinish?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.finish_options.map((finish, idx) => (
                    <button
                      key={finish.label}
                      onClick={() => setSelectedFinishIndex(idx)}
                      className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                        selectedFinishIndex === idx
                          ? 'scale-110 border-apsara-camel ring-2 ring-apsara-camel'
                          : 'border-[#D9C8B4] hover:scale-105'
                      }`}
                      style={{ backgroundColor: finish.hex }}
                      title={finish.label}
                    >
                      {selectedFinishIndex === idx && (
                        <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Bag */}
            <div className="space-y-3 pt-3 border-t border-[#E8DFD3]">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#E8DFD3] bg-white rounded-[3px]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-xs text-[#231B15] hover:bg-[#FAF7F2]"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-mono text-[#231B15]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="px-3 py-2 text-xs text-[#231B15] hover:bg-[#FAF7F2]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-3 bg-[#A66B38] hover:bg-[#8C5627] text-white text-xs font-semibold uppercase tracking-wider rounded-[3px] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
                </button>
              </div>

              {product.stock > 0 && product.stock <= 3 && (
                <p className="text-[11px] text-amber-700 font-medium">
                  ✦ Limited Stock: Only {product.stock} pieces remaining.
                </p>
              )}
            </div>

            {/* Value Guarantees */}
            <div className="p-4 bg-white rounded-[8px] border border-[#E8DFD3] space-y-2 text-xs text-[#6B5E54]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-apsara-camel" />
                <span>Free delivery on orders above Rs. 50,000</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-apsara-camel" />
                <span>10-Year structural heirloom warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-apsara-camel" />
                <span>7-Day easy returns & exchanges</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Info */}
        <div className="p-6 sm:p-8 bg-white rounded-[8px] border border-[#E8DFD3] space-y-6">
          <div className="flex border-b border-[#E8DFD3] gap-6 overflow-x-auto">
            {[
              { id: 'materials', label: 'Materials' },
              { id: 'dimensions', label: 'Dimensions' },
              { id: 'craft', label: 'Craftsmanship' },
              { id: 'shipping', label: 'Delivery & Returns' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === tab.id
                    ? 'text-apsara-camel'
                    : 'text-[#8E7F74] hover:text-[#231B15]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-apsara-camel" />
                )}
              </button>
            ))}
          </div>

          <div>
            {activeTab === 'materials' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#6B5E54] leading-relaxed">
                <div>
                  <h4 className="font-bold text-[#231B15] mb-2">Composed Materials:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {product.materials.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#231B15] mb-2">Care Instructions:</h4>
                  <p>Dust regularly with a soft dry cloth. Keep away from direct excessive moisture.</p>
                </div>
              </div>
            )}

            {activeTab === 'dimensions' && (
              <div className="space-y-2 text-xs text-[#6B5E54]">
                <div className="p-3 bg-[#FAF7F2] rounded-[4px] border border-[#E8DFD3] flex items-center justify-between">
                  <span className="font-bold text-[#231B15]">Dimensions:</span>
                  <span className="font-mono">{product.dimensions}</span>
                </div>
              </div>
            )}

            {activeTab === 'craft' && (
              <div className="text-xs text-[#6B5E54] leading-relaxed">
                <p>Expertly hand-crafted using precision joinery and sustainable timber.</p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="text-xs text-[#6B5E54] leading-relaxed">
                <p>Delivered via our dedicated white-glove logistics team with room placement and packaging removal.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <h3 className="font-serif text-2xl text-[#231B15]">You May Also Like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
