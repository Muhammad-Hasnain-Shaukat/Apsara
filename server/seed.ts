import bcrypt from 'bcryptjs';
import { db, User, Product, Order, OrderItem, DatabaseState } from './db.js';

export async function seedDatabase() {
  console.log('🌱 Seeding APSARA Luxury Database...');

  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);
  const customerPasswordHash = await bcrypt.hash('Customer123!', 10);

  const users: User[] = [
    {
      id: 'usr-admin-01',
      email: 'admin@apsara.com',
      password_hash: adminPasswordHash,
      full_name: 'Genevieve Vance',
      phone: '+1 (415) 890-2341',
      role: 'admin',
      saved_addresses: [
        JSON.stringify({
          fullName: 'Genevieve Vance',
          street: '740 Park Avenue, Penthouse B',
          city: 'New York',
          state: 'NY',
          postalCode: '10021',
          country: 'United States',
          phone: '+1 (415) 890-2341'
        })
      ],
      created_at: new Date('2025-01-10T10:00:00Z').toISOString()
    },
    {
      id: 'usr-cust-01',
      email: 'customer@apsara.com',
      password_hash: customerPasswordHash,
      full_name: 'Julian Montgomery',
      phone: '+1 (310) 650-8912',
      role: 'customer',
      saved_addresses: [
        JSON.stringify({
          fullName: 'Julian Montgomery',
          street: '10880 Wilshire Blvd, Residence 14',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90024',
          country: 'United States',
          phone: '+1 (310) 650-8912'
        }),
        JSON.stringify({
          fullName: 'Julian Montgomery',
          street: '45 Ocean Drive, Villa Alabaster',
          city: 'Miami',
          state: 'FL',
          postalCode: '33139',
          country: 'United States',
          phone: '+1 (310) 650-8912'
        })
      ],
      created_at: new Date('2025-01-15T14:30:00Z').toISOString()
    }
  ];

  const products: Product[] = [
    {
      id: 'prod-01',
      title: 'The Alabaster Cloud Modular Sofa',
      slug: 'the-alabaster-cloud-modular-sofa',
      description: 'An architectural statement composed of cloud-soft feather-down cushions upholstered in bespoke Nordic bouclé, supported by a low-slung, floating American walnut plinth.',
      story: 'Sculpted in our northern atelier over 120 hours. Each modular section floats imperceptibly 2 inches above the ground, creating an ethereal anti-gravity posture inspired by monolithic desert pavilions.',
      price: 6400,
      category: 'Living',
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85'
      ],
      materials: ['Nordic Bouclé Fabric', 'Solid American Walnut', 'Goose Down Blend', 'Cold-Cured Foam'],
      dimensions: 'W 320cm × D 110cm × H 72cm',
      weight: '94 kg',
      stock: 6,
      is_featured: true,
      finish_options: [
        { label: 'Oatmeal Bouclé', hex: '#EBE4D8', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85' },
        { label: 'Smoked Charcoal Wool', hex: '#343231', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=85' },
        { label: 'Camel Cashmere Blend', hex: '#B8976C', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85' }
      ],
      created_at: new Date('2025-01-01T12:00:00Z').toISOString()
    },
    {
      id: 'prod-02',
      title: 'The Sculptural Walnut Pedestal Dining Table',
      slug: 'the-sculptural-walnut-pedestal-dining-table',
      description: 'Carved from century-old sustainably harvested American black walnut with a cantilevered oval top resting atop dual monolithic fluted pedestals.',
      story: 'The dual pedestals are turned by hand on a custom lathe before receiving six coats of hand-rubbed organic beeswax oil that deepens the grain into rich espresso tones.',
      price: 4850,
      category: 'Dining',
      images: [
        'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1600&q=85'
      ],
      materials: ['FSC-Certified American Black Walnut', 'Concealed Steel Core', 'Hand-Rubbed Beeswax Oil'],
      dimensions: 'W 240cm × D 115cm × H 76cm',
      weight: '112 kg',
      stock: 4,
      is_featured: true,
      finish_options: [
        { label: 'Espresso Walnut', hex: '#2D231E', image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1600&q=85' },
        { label: 'Natural White Oak', hex: '#D2B48C', image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1600&q=85' },
        { label: 'Ebonized Black Walnut', hex: '#181513', image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1600&q=85' }
      ],
      created_at: new Date('2025-01-02T12:00:00Z').toISOString()
    },
    {
      id: 'prod-03',
      title: 'The Solstice Travertine Low Table',
      slug: 'the-solstice-travertine-low-table',
      description: 'Raw Roman travertine quarried from Tuscany, honed to a velvety matte texture and paired with a subtle, unlacquered brushed brass shadow line.',
      story: 'Every slab exhibits geological veins formed over millennia. The table appears to levitate above its stepped sand plinth, grounding the living space with timeless tranquility.',
      price: 2900,
      category: 'Living',
      images: [
        'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85'
      ],
      materials: ['Tuscan Roman Travertine', 'Solid Brushed Brass Inlay', 'Felt Floor Glides'],
      dimensions: 'W 140cm × D 90cm × H 32cm',
      weight: '82 kg',
      stock: 8,
      is_featured: true,
      finish_options: [
        { label: 'Beige Roman Travertine', hex: '#E2D5C3', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1600&q=85' },
        { label: 'Silver Persian Travertine', hex: '#BDBAB5', image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1600&q=85' }
      ],
      created_at: new Date('2025-01-03T12:00:00Z').toISOString()
    },
    {
      id: 'prod-04',
      title: 'The Dune Curved Linen Lounge Chair',
      slug: 'the-dune-curved-linen-lounge-chair',
      description: 'Organic, sweeping contours wrapped in heavy-weight textured Belgian linen with a hidden 360-degree silent swivel mechanism.',
      story: 'Designed to evoke the wind-swept sand dunes of the Sahara. The chair wraps around the human posture in a warm embrace of acoustic stillness.',
      price: 2200,
      category: 'Living',
      images: [
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1580481077195-c26685f4fa64?auto=format&fit=crop&w=1600&q=85'
      ],
      materials: ['100% Belgian Flax Linen', 'Internal Steel Subframe', 'High-Resilience Memory Foam'],
      dimensions: 'W 98cm × D 94cm × H 78cm',
      weight: '34 kg',
      stock: 12,
      is_featured: true,
      finish_options: [
        { label: 'Alabaster Linen', hex: '#F7F3EE', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=85' },
        { label: 'Camel Tan Suede', hex: '#B8976C', image: 'https://images.unsplash.com/photo-1580481077195-c26685f4fa64?auto=format&fit=crop&w=1600&q=85' }
      ],
      created_at: new Date('2025-01-04T12:00:00Z').toISOString()
    },
    {
      id: 'prod-05',
      title: 'The Aethelgard Fluted Walnut Bed Frame',
      slug: 'the-aethelgard-fluted-walnut-bed-frame',
      description: 'An architectural platform bed featuring an extended fluted walnut headboard with integrated floating nightstand shelves and soft ambient under-glow.',
      story: 'Precision milled from solid timber with traditional Japanese mortise-and-tenon joints, requiring zero metallic fasteners for supreme acoustic silence.',
      price: 5600,
      category: 'Bedroom',
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=85'
      ],
      materials: ['American Black Walnut', 'Italian Saddle Leather Pillows', 'Solid Slat Foundation'],
      dimensions: 'W 235cm × L 225cm × H 110cm (King)',
      weight: '128 kg',
      stock: 5,
      is_featured: true,
      finish_options: [
        { label: 'Smoked Walnut', hex: '#2D231E', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85' },
        { label: 'Bleached Ash Wood', hex: '#EAE5DB', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=85' }
      ],
      created_at: new Date('2025-01-05T12:00:00Z').toISOString()
    },
    {
      id: 'prod-06',
      title: 'The Aurelia Amber Glass Pendant Chandelier',
      slug: 'the-aurelia-amber-glass-pendant-chandelier',
      description: 'Hand-blown Murano-style amber fluted glass orbs suspended from architectural champagne gold armature, casting warm, hypnotic caustic patterns.',
      story: 'Each glass sphere is mouth-blown in small batches by master glassmakers. The brass armature undergoes hand brushing and satin anodization.',
      price: 1750,
      category: 'Lighting',
      images: [
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1600&q=85'
      ],
      materials: ['Hand-Blown Amber Borosilicate Glass', 'Solid Brushed Brass', 'Warm 2400K Dimmable LEDs'],
      dimensions: 'Dia 85cm × H 120cm (Adjustable drop)',
      weight: '14 kg',
      stock: 9,
      is_featured: false,
      finish_options: [
        { label: 'Warm Amber & Brass', hex: '#D4AF37', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=85' },
        { label: 'Smoked Glass & Matte Black', hex: '#262423', image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1600&q=85' }
      ],
      created_at: new Date('2025-01-06T12:00:00Z').toISOString()
    },
    {
      id: 'prod-07',
      title: 'The Monument Arch Walnut Credenza',
      slug: 'the-monument-arch-walnut-credenza',
      description: 'Subtle arched fluting carved into four soft-close push-latch doors with a monolithic Calacatta gold marble inset top.',
      story: 'Constructed to showcase the beauty of continuous vertical grain matching across all front panels. Houses integrated media ventilation and cord pass-throughs.',
      price: 4300,
      category: 'Storage',
      images: [
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85'
      ],
      materials: ['American Black Walnut', 'Honed Calacatta Marble Top', 'Blum Soft-Close Hardware'],
      dimensions: 'W 200cm × D 48cm × H 75cm',
      weight: '98 kg',
      stock: 3,
      is_featured: false,
      finish_options: [
        { label: 'Walnut & Calacatta Marble', hex: '#2D231E', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=85' },
        { label: 'Smoked Oak & Nero Marquina', hex: '#181513', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85' }
      ],
      created_at: new Date('2025-01-07T12:00:00Z').toISOString()
    },
    {
      id: 'prod-08',
      title: 'The Atelier Minimalist Executive Desk',
      slug: 'the-atelier-minimalist-executive-desk',
      description: 'A monolithic cantilevered desk crafted from quarter-sawn white oak with an inlaid saddle-stitched camel leather writing blotter and magnetic wire routing.',
      story: 'Created for clarity of thought. The asymmetric drawer block appears detached from the desktop, creating a sense of weightlessness.',
      price: 3800,
      category: 'Office',
      images: [
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=85'
      ],
      materials: ['Quarter-Sawn White Oak', 'Full-Grain Tuscan Saddle Leather', 'Solid Brass Cable Ports'],
      dimensions: 'W 180cm × D 80cm × H 75cm',
      weight: '68 kg',
      stock: 7,
      is_featured: false,
      finish_options: [
        { label: 'Natural Oak & Camel Leather', hex: '#D2B48C', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1600&q=85' },
        { label: 'Ebonized Ash & Black Leather', hex: '#1F1A17', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=85' }
      ],
      created_at: new Date('2025-01-08T12:00:00Z').toISOString()
    },
    {
      id: 'prod-09',
      title: 'The Kyoto Floating Nightstand Pair',
      slug: 'the-kyoto-floating-nightstand-pair',
      description: 'Wall-mounted floating bedside tables with beveled edge detailing, concealed soft-touch drawer, and recessed brass tray.',
      story: 'Inspired by traditional machiya architecture in Kyoto. Mounts invisibly to drywall or masonry to preserve floor continuity.',
      price: 1650,
      category: 'Bedroom',
      images: [
        'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=85'
      ],
      materials: ['Solid American Walnut', 'Solid Cast Brass Tray', 'Heavy-Duty French Cleat System'],
      dimensions: 'W 50cm × D 38cm × H 18cm (Each)',
      weight: '16 kg (Set)',
      stock: 14,
      is_featured: false,
      finish_options: [
        { label: 'Espresso Walnut', hex: '#2D231E', image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=1600&q=85' },
        { label: 'Alabaster White Oak', hex: '#EAE5DB', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=85' }
      ],
      created_at: new Date('2025-01-09T12:00:00Z').toISOString()
    },
    {
      id: 'prod-10',
      title: 'The Obelisk Fluted Floor Lamp',
      slug: 'the-obelisk-fluted-floor-lamp',
      description: 'A statuesque floor lamp with an alabaster cylinder body illuminated internally, complemented by a tapered raw linen shade.',
      story: 'Mined from Spanish Aragonite alabaster with crystalline veins that softly diffuse light into an atmospheric golden aura.',
      price: 1400,
      category: 'Lighting',
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=85'
      ],
      materials: ['Spanish Aragonite Alabaster', 'Natural Raw Flax Linen', 'Antiqued Brass Fittings'],
      dimensions: 'Dia 42cm × H 165cm',
      weight: '22 kg',
      stock: 11,
      is_featured: false,
      finish_options: [
        { label: 'Translucent White Alabaster', hex: '#F7F3EE', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1600&q=85' },
        { label: 'Honey Amber Onyx', hex: '#D4AF37', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=85' }
      ],
      created_at: new Date('2025-01-10T12:00:00Z').toISOString()
    }
  ];

  const orders: Order[] = [
    {
      id: 'APS-94812',
      user_id: 'usr-cust-01',
      customer_name: 'Julian Montgomery',
      customer_email: 'customer@apsara.com',
      status: 'delivered',
      status_timeline: [
        {
          step: 'pending',
          title: 'Order Reserved in Atelier',
          timestamp: '2025-01-18T14:20:00Z',
          note: 'Deposit confirmed. Bespoke production queued in Northern Atelier.',
          completed: true
        },
        {
          step: 'processing',
          title: 'Handcrafted by Master Artisans',
          timestamp: '2025-01-22T09:15:00Z',
          note: 'Travertine precision honed and linen upholstery tailored.',
          completed: true
        },
        {
          step: 'shipped',
          title: 'Dispatched via White-Glove Logistics',
          timestamp: '2025-01-28T11:00:00Z',
          note: 'Consigned to private climate-controlled transport. Tracking: APS-EXP-9921',
          completed: true
        },
        {
          step: 'delivered',
          title: 'White-Glove Installed in Sanctuary',
          timestamp: '2025-02-02T16:45:00Z',
          note: 'Delivered and assembled in client residence with full packaging reclamation.',
          completed: true
        }
      ],
      total_amount: 7300,
      subtotal_amount: 7300,
      shipping_fee: 0,
      tax_amount: 0,
      shipping_address: {
        fullName: 'Julian Montgomery',
        street: '10880 Wilshire Blvd, Residence 14',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90024',
        country: 'United States',
        phone: '+1 (310) 650-8912'
      },
      payment_method: 'Concierge Bank Wire',
      tracking_number: 'APS-WG-889104',
      special_instructions: 'Please coordinate with residence concierge 24 hours prior to arrival.',
      created_at: '2025-01-18T14:20:00Z'
    },
    {
      id: 'APS-95104',
      user_id: 'usr-cust-01',
      customer_name: 'Julian Montgomery',
      customer_email: 'customer@apsara.com',
      status: 'shipped',
      status_timeline: [
        {
          step: 'pending',
          title: 'Order Reserved in Atelier',
          timestamp: '2025-02-10T10:05:00Z',
          note: 'Reservation secured.',
          completed: true
        },
        {
          step: 'processing',
          title: 'Handcrafted by Master Artisans',
          timestamp: '2025-02-14T08:30:00Z',
          note: 'Solid walnut lathe turning completed; six beeswax coats applied.',
          completed: true
        },
        {
          step: 'shipped',
          title: 'Dispatched via White-Glove Logistics',
          timestamp: '2025-02-24T13:40:00Z',
          note: 'In transit via luxury freight carrier. Expected delivery in 3 business days.',
          completed: true
        },
        {
          step: 'delivered',
          title: 'White-Glove Installed in Sanctuary',
          timestamp: '',
          note: '',
          completed: false
        }
      ],
      total_amount: 4850,
      subtotal_amount: 4850,
      shipping_fee: 0,
      tax_amount: 0,
      shipping_address: {
        fullName: 'Julian Montgomery',
        street: '10880 Wilshire Blvd, Residence 14',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90024',
        country: 'United States',
        phone: '+1 (310) 650-8912'
      },
      payment_method: 'Credit Card (Amex Centurion)',
      tracking_number: 'APS-WG-910244',
      special_instructions: 'Fragile solid timber freight. Requires 2-person delivery team.',
      created_at: '2025-02-10T10:05:00Z'
    },
    {
      id: 'APS-95320',
      user_id: 'usr-cust-01',
      customer_name: 'Julian Montgomery',
      customer_email: 'customer@apsara.com',
      status: 'processing',
      status_timeline: [
        {
          step: 'pending',
          title: 'Order Reserved in Atelier',
          timestamp: '2025-02-25T17:12:00Z',
          note: 'Order confirmed and registered in production roster.',
          completed: true
        },
        {
          step: 'processing',
          title: 'Handcrafted by Master Artisans',
          timestamp: '2025-02-26T09:00:00Z',
          note: 'Mouth-blown amber glass orbs undergoing annealing and brass polishing.',
          completed: true
        },
        {
          step: 'shipped',
          title: 'Dispatched via White-Glove Logistics',
          timestamp: '',
          note: '',
          completed: false
        },
        {
          step: 'delivered',
          title: 'White-Glove Installed in Sanctuary',
          timestamp: '',
          note: '',
          completed: false
        }
      ],
      total_amount: 1750,
      subtotal_amount: 1750,
      shipping_fee: 0,
      tax_amount: 0,
      shipping_address: {
        fullName: 'Julian Montgomery',
        street: '45 Ocean Drive, Villa Alabaster',
        city: 'Miami',
        state: 'FL',
        postalCode: '33139',
        country: 'United States',
        phone: '+1 (310) 650-8912'
      },
      payment_method: 'Credit Card',
      tracking_number: 'APS-PENDING',
      special_instructions: 'Deliver to rear guest house entrance.',
      created_at: '2025-02-25T17:12:00Z'
    }
  ];

  const orderItems: OrderItem[] = [
    // Order 1 items
    {
      id: 'item-01',
      order_id: 'APS-94812',
      product_id: 'prod-03',
      product_title: 'The Solstice Travertine Low Table',
      product_image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1600&q=85',
      quantity: 1,
      unit_price: 2900,
      selected_finish: 'Beige Roman Travertine'
    },
    {
      id: 'item-02',
      order_id: 'APS-94812',
      product_id: 'prod-04',
      product_title: 'The Dune Curved Linen Lounge Chair',
      product_image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=85',
      quantity: 2,
      unit_price: 2200,
      selected_finish: 'Alabaster Linen'
    },
    // Order 2 items
    {
      id: 'item-03',
      order_id: 'APS-95104',
      product_id: 'prod-02',
      product_title: 'The Sculptural Walnut Pedestal Dining Table',
      product_image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1600&q=85',
      quantity: 1,
      unit_price: 4850,
      selected_finish: 'Espresso Walnut'
    },
    // Order 3 items
    {
      id: 'item-04',
      order_id: 'APS-95320',
      product_id: 'prod-06',
      product_title: 'The Aurelia Amber Glass Pendant Chandelier',
      product_image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=85',
      quantity: 1,
      unit_price: 1750,
      selected_finish: 'Warm Amber & Brass'
    }
  ];

  const seedState: DatabaseState = {
    users,
    products,
    orders,
    order_items: orderItems
  };

  db.resetWithSeed(seedState);
  console.log('✅ Database seeded with Admin, Demo Customer, 10 Luxury Products, and 3 Sample Orders.');
}

// Execute directly if run via script
if (process.argv[1]?.includes('seed')) {
  seedDatabase();
}
