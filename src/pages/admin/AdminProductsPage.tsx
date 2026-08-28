import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Package,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Sparkles,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../api/client';
import { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { AdminProductModal } from './AdminProductModal';
import { Button } from '../../components/common/Button';
import { useUIStore } from '../../store/uiStore';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Delete confirmation dialog state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addToast } = useUIStore();

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productsApi.getAll();
      setProducts(data.products);
    } catch (err) {
      console.error('Failed to load products', err);
      addToast('Failed to retrieve inventory', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStockToggle = async (product: Product) => {
    try {
      const newStock = product.stock > 0 ? 0 : 5;
      const updated = await productsApi.updateStock(product.id, newStock);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      addToast(`${product.title} stock set to ${newStock}`, 'info');
    } catch (err) {
      console.error('Failed to toggle stock', err);
      addToast('Failed to update stock count', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productsApi.delete(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      addToast(`${productToDelete.title} removed from atelier catalog`, 'success');
      setProductToDelete(null);
    } catch (err) {
      console.error('Failed to delete product', err);
      addToast('Failed to remove furniture piece', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.materials.some((m) => m.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8 lg:p-12 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-apsara-camel/20">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-apsara-camel font-semibold block mb-1">
            Atelier Curated Inventory
          </span>
          <h1 className="font-serif text-3xl text-white font-normal">
            Product Inventory Management
          </h1>
        </div>

        <Button
          variant="gold"
          size="md"
          onClick={() => {
            setProductToEdit(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Piece
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-[#141210] border border-apsara-camel/25 shadow-admin-card">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-apsara-camel absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search piece title or material..."
            className="w-full bg-[#1E1916] border border-apsara-camel/30 pl-9 pr-3 py-2 text-xs text-white placeholder-apsara-champagne/40 focus:outline-none focus:border-apsara-sandstone"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['All', 'Living', 'Dining', 'Bedroom', 'Storage', 'Lighting', 'Office'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-apsara-sandstone text-apsara-espresso font-bold shadow-sm'
                  : 'bg-[#1E1916] text-apsara-champagne/70 hover:text-white border border-apsara-camel/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-[#141210] border border-apsara-camel/25 shadow-admin-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs uppercase tracking-widest text-apsara-camel">
            Loading Catalog Inventory...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-apsara-champagne/60 font-light">
            No furniture pieces found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-apsara-camel/20 text-[10px] uppercase tracking-wider text-apsara-camel font-semibold bg-[#1A1613]">
                  <th className="p-4">Piece</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Atelier Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apsara-camel/10 text-apsara-champagne/80">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    
                    {/* Thumbnail & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-12 h-12 object-cover border border-apsara-camel/20 shrink-0 bg-[#1E1916]"
                        />
                        <div>
                          <div className="font-serif text-sm font-medium text-white line-clamp-1">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-apsara-champagne/50 truncate max-w-[200px]">
                            {p.materials.join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-[11px] text-apsara-camel">
                      {p.category}
                    </td>

                    <td className="p-4 font-serif text-sm text-white font-medium">
                      {formatCurrency(p.price)}
                    </td>

                    {/* Stock Count */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-semibold ${p.stock === 0 ? 'text-red-400' : 'text-white'}`}>
                          {p.stock} units
                        </span>
                        <button
                          onClick={() => handleStockToggle(p)}
                          className="text-apsara-camel hover:text-white transition-colors"
                          title={p.stock > 0 ? 'Mark Out of Stock' : 'Replenish 5 Units'}
                        >
                          {p.stock > 0 ? (
                            <ToggleRight className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-red-400" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Featured / Live */}
                    <td className="p-4">
                      {p.is_featured ? (
                        <span className="px-2 py-0.5 bg-apsara-sandstone/20 text-apsara-sandstone border border-apsara-sandstone/40 text-[9px] uppercase font-bold">
                          Hero Featured
                        </span>
                      ) : (
                        <span className="text-[10px] text-apsara-champagne/40 uppercase">
                          Standard
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 bg-[#1E1916] text-apsara-champagne/70 hover:text-white border border-apsara-camel/20"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => {
                            setProductToEdit(p);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 bg-[#1E1916] text-apsara-champagne/70 hover:text-apsara-sandstone border border-apsara-camel/20"
                          title="Edit Piece"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 bg-[#1E1916] text-apsara-champagne/70 hover:text-red-400 border border-apsara-camel/20"
                          title="Remove from Catalog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSuccess={(saved) => {
          if (productToEdit) {
            setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
          } else {
            setProducts((prev) => [saved, ...prev]);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#141210] border border-red-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif text-xl text-white">Remove Piece from Catalog?</h3>
            </div>
            <p className="text-xs text-apsara-champagne/70 leading-relaxed font-light">
              Are you sure you want to remove <strong>"{productToDelete.title}"</strong>? This will permanently retire the item from active client storefront browsing.
            </p>
            <div className="pt-4 flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setProductToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isDeleting}
                onClick={handleConfirmDelete}
                className="bg-red-900 text-white hover:bg-red-800 border-red-700"
              >
                Confirm Removal
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
