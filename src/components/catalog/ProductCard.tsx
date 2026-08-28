import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useUIStore } from '../../store/uiStore';
import { formatCurrency } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToast, openCartDrawer } = useUIStore();

  const [selectedFinishIndex, setSelectedFinishIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const currentFinish = product.finish_options?.[selectedFinishIndex];
  const activeImage = currentFinish?.image || (isHovered && product.images[1] ? product.images[1] : product.images[0]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, currentFinish?.label, 1);
    setAddedAnimation(true);
    addToast(`${product.title} added to bag`, 'success');
    openCartDrawer();
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isFavorite) {
      addToast(`${product.title} added to wishlist`, 'info');
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-[8px] border border-[#E8DFD3] hover:border-apsara-camel hover:shadow-clean-hover transition-all duration-300 flex flex-col justify-between group overflow-hidden"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F2] p-3 flex items-center justify-center">
        
        {/* Main Photo */}
        <Link to={`/products/${product.slug}`} className="w-full h-full flex items-center justify-center">
          <img
            src={activeImage}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85';
            }}
          />
        </Link>

        {/* Top Left Status Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {product.is_featured && (
            <span className="px-2 py-0.5 bg-apsara-camel text-white text-[8px] uppercase tracking-wider font-bold rounded-[2px]">
              Best Seller
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="px-2 py-0.5 bg-[#FAF7F2] text-amber-700 text-[8px] uppercase tracking-wider font-semibold border border-amber-300 rounded-[2px]">
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
          <button
            onClick={handleWishlist}
            className={`p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all ${
              isFavorite
                ? 'text-red-500 bg-red-50'
                : 'text-[#6B5E54] hover:text-apsara-camel'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#6B5E54] hover:text-apsara-camel opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hidden sm:block"
              title="Quick Preview"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Hover Quick Add */}
        <div className="absolute bottom-2 left-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className="w-full py-2 bg-[#A66B38] hover:bg-[#8C5627] text-white text-[10px] uppercase tracking-wider font-bold rounded-[3px] shadow-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Card Body */}
      <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-[#8E7F74] font-semibold block">
            {product.category}
          </span>

          <Link to={`/products/${product.slug}`} className="group-hover:text-apsara-camel transition-colors">
            <h3 className="text-xs font-bold text-[#231B15] line-clamp-1 mt-0.5">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Finish Swatches & Price */}
        <div className="pt-2 border-t border-[#E8DFD3]/60 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {product.finish_options?.slice(0, 3).map((finish, idx) => (
              <button
                key={finish.label}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedFinishIndex(idx);
                }}
                className={`w-3 h-3 rounded-full border transition-all ${
                  selectedFinishIndex === idx
                    ? 'scale-125 border-apsara-camel ring-1 ring-apsara-camel'
                    : 'border-[#D9C8B4] hover:scale-110'
                }`}
                style={{ backgroundColor: finish.hex }}
                title={finish.label}
              />
            ))}
          </div>

          <span className="text-xs font-bold text-apsara-camel">
            {formatCurrency(product.price)}
          </span>
        </div>

      </div>
    </div>
  );
};
