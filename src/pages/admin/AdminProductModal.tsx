import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Sparkles, Image as ImageIcon, Upload, Link as LinkIcon, Check } from 'lucide-react';
import { Product, ProductCategory, FinishOption } from '../../types';
import { productsApi } from '../../api/client';
import { Button } from '../../components/common/Button';
import { useUIStore } from '../../store/uiStore';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: Product) => void;
  productToEdit?: Product | null;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
}) => {
  const { addToast } = useUIStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Living');
  const [price, setPrice] = useState<number>(35000);
  const [stock, setStock] = useState<number>(5);
  const [dimensions, setDimensions] = useState('W 220cm × D 95cm × H 76cm');
  const [weight, setWeight] = useState('65 kg');
  const [materialsInput, setMaterialsInput] = useState('American Black Walnut, Belgian Linen');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Image upload tab & list
  const [imageUploadMode, setImageUploadMode] = useState<'upload' | 'url'>('upload');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Finish options list
  const [finishOptions, setFinishOptions] = useState<FinishOption[]>([
    { label: 'Natural Walnut', hex: '#2D231E', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85' },
  ]);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setStock(productToEdit.stock);
      setDimensions(productToEdit.dimensions);
      setWeight(productToEdit.weight || '50 kg');
      setMaterialsInput(productToEdit.materials.join(', '));
      setDescription(productToEdit.description);
      setStory(productToEdit.story);
      setIsFeatured(productToEdit.is_featured);
      setImages(productToEdit.images.length > 0 ? productToEdit.images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85']);
      setFinishOptions(productToEdit.finish_options.length > 0 ? productToEdit.finish_options : []);
    } else {
      setTitle('');
      setCategory('Living');
      setPrice(45000);
      setStock(5);
      setDimensions('W 220cm × D 95cm × H 76cm');
      setWeight('65 kg');
      setMaterialsInput('American Black Walnut, Belgian Linen');
      setDescription('An architectural statement sculpted for pure sanctuary serenity.');
      setStory('Handcrafted in limited atelier batches with precision joinery.');
      setIsFeatured(false);
      setImages(['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85']);
      setFinishOptions([
        { label: 'Natural Walnut', hex: '#2D231E', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85' },
      ]);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle local file upload from PC
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    addToast(`Added image(s) from PC`, 'info');
    e.target.value = '';
  };

  // Handle paste URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
    addToast('Image URL linked', 'info');
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Product title is required', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const materials = materialsInput
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);

      const finalImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85'];

      const payload: Partial<Product> = {
        title,
        category,
        price: Number(price),
        stock: Number(stock),
        dimensions,
        weight,
        materials,
        description,
        story,
        is_featured: isFeatured,
        images: finalImages,
        finish_options: finishOptions.length > 0 ? finishOptions : [
          { label: 'Natural Walnut', hex: '#2D231E', image: finalImages[0] }
        ],
      };

      let resultProduct: Product;
      if (productToEdit) {
        resultProduct = await productsApi.update(productToEdit.id, payload);
        addToast('Furniture piece updated in catalog', 'success');
      } else {
        resultProduct = await productsApi.create(payload);
        addToast('New piece crafted & published to catalog', 'success');
      }

      onSuccess(resultProduct);
      onClose();
    } catch (err: any) {
      console.error('Save product error:', err);
      addToast(err.response?.data?.message || 'Failed to save furniture piece', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#1A1614] border border-[#B8754D] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#B8754D]/30 bg-[#141210]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#B8754D] font-bold block">
              Atelier Inventory Control
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mt-0.5">
              {productToEdit ? 'Edit Furniture Piece' : 'Craft & Publish New Piece'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#A89F91] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#B8754D] font-bold block mb-1">
                Piece Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Alabaster Cloud Modular Sofa"
                className="w-full px-3.5 py-2 bg-[#120F0D] border border-[#B8754D]/30 rounded-lg text-xs text-white placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#B8754D] font-bold block mb-1">
                Sanctuary Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2 bg-[#120F0D] border border-[#B8754D]/30 rounded-lg text-xs text-white focus:outline-none focus:border-[#B8754D]"
              >
                <option value="Living">Living Room</option>
                <option value="Dining">Dining Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Storage">Storage & Credenzas</option>
                <option value="Lighting">Lighting</option>
                <option value="Office">Office Furniture</option>
                <option value="Outdoor">Outdoor Collection</option>
                <option value="Accessories">Accessories & Décor</option>
              </select>
            </div>
          </div>

          {/* Row 2: Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#B8754D] font-bold block mb-1">
                Price (PKR / Rs.) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#120F0D] border border-[#B8754D]/30 rounded-lg text-xs text-white focus:outline-none focus:border-[#B8754D]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#B8754D] font-bold block mb-1">
                Available Stock
              </label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#120F0D] border border-[#B8754D]/30 rounded-lg text-xs text-white focus:outline-none focus:border-[#B8754D]"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="relative flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-[#B8754D] text-[#B8754D] focus:ring-0 accent-[#B8754D]"
                />
                <span className="text-xs text-white font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#B8754D]" />
                  <span>Feature on Homepage</span>
                </span>
              </label>
            </div>
          </div>

          {/* Row 3: Dimensions & Materials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#B8754D] font-bold block mb-1">
                Architectural Dimensions
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="W 220cm × D 95cm × H 76cm"
                className="w-full px-3.5 py-2 bg-[#120F0D] border border-[#B8754D]/30 rounded-lg text-xs text-white placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#B8754D] font-bold block mb-1">
                Materials (comma-separated)
              </label>
              <input
                type="text"
                value={materialsInput}
                onChange={(e) => setMaterialsInput(e.target.value)}
                placeholder="Solid Walnut, Honed Travertine, Belgian Flax"
                className="w-full px-3.5 py-2 bg-[#120F0D] border border-[#B8754D]/30 rounded-lg text-xs text-white placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
              />
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              IMAGE MANAGEMENT: Dual Mode (Upload PC or Paste Links)
             ───────────────────────────────────────────────────────────── */}
          <div className="space-y-3 p-4 bg-[#141210] rounded-xl border border-[#B8754D]/30">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider text-[#B8754D] font-bold block">
                Product Photography ({images.length} added)
              </label>
              
              {/* Dual Mode Switch */}
              <div className="flex bg-[#1E1916] rounded-lg p-0.5 border border-[#B8754D]/30">
                <button
                  type="button"
                  onClick={() => setImageUploadMode('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-[10.5px] font-bold uppercase rounded-md transition-all ${
                    imageUploadMode === 'upload'
                      ? 'bg-[#B8754D] text-white shadow-xs'
                      : 'text-[#A89F91] hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload from PC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImageUploadMode('url')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-[10.5px] font-bold uppercase rounded-md transition-all ${
                    imageUploadMode === 'url'
                      ? 'bg-[#B8754D] text-white shadow-xs'
                      : 'text-[#A89F91] hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Paste Image Link</span>
                </button>
              </div>
            </div>

            {/* Upload from PC Input */}
            {imageUploadMode === 'upload' ? (
              <label className="border-2 border-dashed border-[#B8754D]/40 hover:border-[#B8754D] bg-[#191512] rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#201B17] group">
                <Upload className="w-7 h-7 text-[#B8754D] group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-bold text-white">Click to browse or drop images from your computer</span>
                <span className="text-[10px] text-[#A89F91] mt-1">Supports JPG, PNG, WEBP, HD Photography</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            ) : (
              /* Paste Image Link Input */
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or direct image URL"
                  className="flex-1 px-3.5 py-2 bg-[#120F0D] border border-[#B8754D]/30 rounded-lg text-xs text-white placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase rounded-lg transition-colors shrink-0"
                >
                  Add URL
                </button>
              </div>
            )}

            {/* Image Previews Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#B8754D]/40 bg-black group">
                    <img
                      src={img}
                      alt={`Product preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=85';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[#B8754D] text-white text-[8px] font-bold uppercase rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description & Narrative */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#B8754D] font-bold block mb-1">
                Editorial Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the architectural form, curvature, and comfort..."
                className="w-full px-3.5 py-2 bg-[#120F0D] border border-[#B8754D]/30 rounded-lg text-xs text-white placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#B8754D] font-bold block mb-1">
                Atelier Story & Provenance
              </label>
              <textarea
                rows={2}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Story behind the design and timber craftsmanship..."
                className="w-full px-3.5 py-2 bg-[#120F0D] border border-[#B8754D]/30 rounded-lg text-xs text-white placeholder-[#756C62] focus:outline-none focus:border-[#B8754D]"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#B8754D]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-[#A89F91] hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-transparent hover:border-[#B8754D]/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#B8754D] hover:bg-[#8E4A22] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Piece...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{productToEdit ? 'Save Changes' : 'Publish to Catalog'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
