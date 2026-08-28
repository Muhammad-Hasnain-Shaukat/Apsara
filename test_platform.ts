import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Full-Stack APSARA Platform Verification Suite...\n');
  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition: boolean, name: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      testsPassed++;
    } else {
      console.error(`  ❌ [FAIL] ${name}`);
      testsFailed++;
    }
  }

  try {
    // 1. Health check
    console.log('1. Health Check & Core Server:');
    const healthRes = await axios.get(`${API_BASE}/health`);
    assert(healthRes.status === 200 && healthRes.data.brand === 'APSARA Luxury Atelier', 'Health endpoint responds with brand metadata');

    // 2. Authentication: Customer Login
    console.log('\n2. Authentication System:');
    const custLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'customer@apsara.com',
      password: 'Customer123!',
    });
    assert(custLoginRes.status === 200 && custLoginRes.data.user.role === 'customer', 'Customer login authenticates successfully');
    const custToken = custLoginRes.data.token;

    // 3. Authentication: Admin Login
    const adminLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@apsara.com',
      password: 'AdminPass123!',
    });
    assert(adminLoginRes.status === 200 && adminLoginRes.data.user.role === 'admin', 'Admin login authenticates with admin privileges');
    const adminToken = adminLoginRes.data.token;

    // 4. Products: List & Filtering
    console.log('\n3. Storefront Catalog & Multi-Filters:');
    const allProductsRes = await axios.get(`${API_BASE}/products`);
    assert(allProductsRes.status === 200 && allProductsRes.data.products.length >= 10, `Retrieved ${allProductsRes.data.products.length} luxury furniture pieces`);

    const livingRes = await axios.get(`${API_BASE}/products?category=Living`);
    assert(livingRes.data.products.every((p: any) => p.category === 'Living'), 'Category filter correctly isolates Living pieces');

    const filterMetaRes = await axios.get(`${API_BASE}/products/meta/filters`);
    assert(filterMetaRes.data.categories.length === 6 && filterMetaRes.data.materials.length > 0, 'Filter metadata returns rooms and material lists');

    const singleProdRes = await axios.get(`${API_BASE}/products/the-alabaster-cloud-modular-sofa`);
    assert(singleProdRes.data.product.title === 'The Alabaster Cloud Modular Sofa', 'Product detail retrieval by slug succeeds');

    // 5. Customer Order Creation Flow
    console.log('\n4. Customer Checkout & Order Creation:');
    const targetProduct = singleProdRes.data.product;
    const initialStock = targetProduct.stock;

    const createOrderRes = await axios.post(
      `${API_BASE}/orders`,
      {
        items: [
          {
            productId: targetProduct.id,
            quantity: 1,
            selectedFinish: 'Oatmeal Bouclé',
            selectedFinishImage: targetProduct.images[0],
          },
        ],
        shipping_address: {
          fullName: 'Julian Montgomery',
          street: '10880 Wilshire Blvd',
          apartment: 'Residence 14',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90024',
          country: 'United States',
          phone: '+1 (310) 650-8912',
        },
        payment_method: 'Credit Card (Centurion)',
        special_instructions: 'Handle with extreme white-glove care.',
      },
      {
        headers: { Authorization: `Bearer ${custToken}` },
      }
    );

    assert(createOrderRes.status === 201 && createOrderRes.data.order.id.startsWith('APS-'), `Order created successfully with ID: ${createOrderRes.data.order.id}`);
    const createdOrderId = createOrderRes.data.order.id;

    // Verify stock decrease
    const updatedProdRes = await axios.get(`${API_BASE}/products/${targetProduct.id}`);
    assert(updatedProdRes.data.product.stock === initialStock - 1, `Product inventory accurately decremented from ${initialStock} to ${updatedProdRes.data.product.stock}`);

    // 6. Customer Order History
    console.log('\n5. Customer Account & Order Tracking:');
    const myOrdersRes = await axios.get(`${API_BASE}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${custToken}` },
    });
    assert(myOrdersRes.data.orders.some((o: any) => o.id === createdOrderId), 'Customer order history includes newly created commission');

    // 7. Admin Orders & Status Progression
    console.log('\n6. Admin Portal Operations:');
    const adminOrdersRes = await axios.get(`${API_BASE}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminOrdersRes.data.orders.length > 0, `Admin successfully retrieved ${adminOrdersRes.data.orders.length} total orders`);

    // Update status to shipped
    const statusUpdateRes = await axios.patch(
      `${API_BASE}/orders/admin/${createdOrderId}/status`,
      {
        status: 'shipped',
        note: 'Dispatched via private freight logistics.',
        tracking_number: 'APS-WG-778899',
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    assert(statusUpdateRes.data.order.status === 'shipped', 'Admin successfully updated order status to shipped');

    // 8. Admin Analytics
    console.log('\n7. Executive Analytics & KPIs:');
    const analyticsRes = await axios.get(`${API_BASE}/admin/analytics/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      analyticsRes.data.metrics.totalRevenue > 0 &&
      analyticsRes.data.metrics.totalOrders >= 4 &&
      analyticsRes.data.recentOrders.length > 0,
      `Analytics overview computed: Total Revenue = $${analyticsRes.data.metrics.totalRevenue.toLocaleString()}, Total Commissions = ${analyticsRes.data.metrics.totalOrders}`
    );

    // 9. Admin Inventory CRUD
    console.log('\n8. Admin Inventory Management:');
    const newPiece = await axios.post(
      `${API_BASE}/products`,
      {
        title: 'The Kyoto Minimalist Credenza',
        category: 'Storage',
        price: 5200,
        stock: 3,
        materials: ['Solid Smoked Walnut', 'Calacatta Marble'],
        dimensions: 'W 200cm × D 50cm × H 70cm',
        description: 'Architectural credenza with fluted push-latch walnut doors.',
        images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=85'],
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    assert(newPiece.status === 201, `Admin created new piece: "${newPiece.data.product.title}"`);

    // Toggle stock
    const toggled = await axios.patch(
      `${API_BASE}/products/${newPiece.data.product.id}/stock`,
      { stock: 0 },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(toggled.data.product.stock === 0, 'Admin stock adjuster successfully updated piece to out-of-stock');

    // Clean up created test piece
    const deleted = await axios.delete(`${API_BASE}/products/${newPiece.data.product.id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(deleted.status === 200, 'Admin successfully removed piece from catalog');

    console.log(`\n🎉 Verification Suite Complete! Tests Passed: ${testsPassed} | Tests Failed: ${testsFailed}\n`);
  } catch (err: any) {
    console.error('Test execution error:', err.response?.data || err.message);
    testsFailed++;
  }
}

runTests();
