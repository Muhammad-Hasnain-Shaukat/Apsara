import { Router, Request, Response } from 'express';
import { db, Product } from '../db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Helper to generate slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

// Get all products with rich filtering and sorting
router.get('/', (req: Request, res: Response): void => {
  try {
    let products = db.getProducts();

    const {
      category,
      material,
      minPrice,
      maxPrice,
      inStock,
      featured,
      search,
      sort
    } = req.query;

    // Filter by Category
    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }

    // Filter by Material
    if (material && material !== 'All') {
      products = products.filter(p => 
        p.materials.some(m => m.toLowerCase().includes((material as string).toLowerCase()))
      );
    }

    // Filter by Price range
    if (minPrice) {
      const min = parseFloat(minPrice as string);
      if (!isNaN(min)) {
        products = products.filter(p => p.price >= min);
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      if (!isNaN(max)) {
        products = products.filter(p => p.price <= max);
      }
    }

    // Filter by In-Stock
    if (inStock === 'true') {
      products = products.filter(p => p.stock > 0);
    }

    // Filter by Featured
    if (featured === 'true') {
      products = products.filter(p => p.is_featured);
    }

    // Filter by Search Query
    if (search) {
      const q = (search as string).toLowerCase().trim();
      products = products.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.materials.some(m => m.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === 'featured') {
      products.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    res.json({
      total: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error retrieving furniture pieces' });
  }
});

// Get categories & available filter tags
router.get('/meta/filters', (_req: Request, res: Response): void => {
  const products = db.getProducts();
  const categories = ['Living', 'Dining', 'Bedroom', 'Storage', 'Lighting', 'Office'];
  
  const materialSet = new Set<string>();
  products.forEach(p => p.materials.forEach(m => materialSet.add(m)));

  res.json({
    categories,
    materials: Array.from(materialSet),
    priceRange: {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price))
    }
  });
});

// Get single product by slug or ID
router.get('/:slugOrId', (req: Request, res: Response): void => {
  const { slugOrId } = req.params;
  const product = db.getProductBySlug(slugOrId) || db.getProductById(slugOrId);

  if (!product) {
    res.status(404).json({ message: 'Furniture piece not found' });
    return;
  }

  // Related products from same category
  const related = db.getProducts()
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  res.json({ product, related });
});

// Admin: Create new product
router.post('/', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const {
      title,
      description,
      story,
      price,
      category,
      images,
      materials,
      dimensions,
      weight,
      stock,
      is_featured,
      finish_options
    } = req.body;

    if (!title || !price || !category) {
      res.status(400).json({ message: 'Title, price, and category are required' });
      return;
    }

    const id = `prod-${Date.now()}`;
    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (db.getProductBySlug(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newProduct: Product = {
      id,
      title,
      slug,
      description: description || '',
      story: story || 'Handcrafted in limited atelier editions.',
      price: Number(price),
      category,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85'],
      materials: Array.isArray(materials) ? materials : ['American Walnut', 'Linen'],
      dimensions: dimensions || 'Custom Architectural Dimensions',
      weight: weight || '45 kg',
      stock: Number(stock ?? 5),
      is_featured: Boolean(is_featured),
      finish_options: Array.isArray(finish_options) && finish_options.length > 0 ? finish_options : [
        { label: 'Natural Walnut', hex: '#2D231E', image: images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85' }
      ],
      created_at: new Date().toISOString()
    };

    db.createProduct(newProduct);

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create piece' });
  }
});

// Admin: Update product
router.put('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const existing = db.getProductById(id);

    if (!existing) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const updates: Partial<Product> = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);
    if (updates.is_featured !== undefined) updates.is_featured = Boolean(updates.is_featured);

    const updated = db.updateProduct(id, updates);
    res.json({ message: 'Product updated successfully', product: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update piece' });
  }
});

// Admin: Toggle or set stock
router.patch('/:id/stock', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const { stock } = req.body;

  const existing = db.getProductById(id);
  if (!existing) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const newStock = typeof stock === 'number' ? stock : (existing.stock > 0 ? 0 : 5);
  const updated = db.updateProduct(id, { stock: newStock });
  res.json({ message: 'Stock updated', product: updated });
});

// Admin: Delete product
router.delete('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const success = db.deleteProduct(id);

  if (!success) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  res.json({ message: 'Product removed from atelier catalog' });
});

export default router;
