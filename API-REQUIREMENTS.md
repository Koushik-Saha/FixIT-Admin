# API Requirements for FixIt Admin Panel

## Critical Endpoints (Implement First)

### Products API ⚠️ REQUIRED
These endpoints are critical for the admin panel to function:

```typescript
// Get all products with filters
GET /api/admin/products
Query params: ?search=text&category=cat&brand=brand&status=active&stock=low

Response: Product[]

// Get single product
GET /api/admin/products/:id
Response: Product

// Create product
POST /api/admin/products
Body: Product (without id)
Response: Product

// Update product
PUT /api/admin/products/:id
Body: Partial<Product>
Response: Product

// Delete product
DELETE /api/admin/products/:id
Response: { success: true }

// Bulk import
POST /api/admin/products/bulk-import
Body: { products: Product[] }
Response: { imported: number, failed: number }
```

---

## Secondary Endpoints (Implement Next)

### Customers API ⚠️ MOCK (needs implementation)

```typescript
// Get all customers with filters
GET /api/admin/customers
Query params: ?search=text&role=customer&wholesaleStatus=approved
Response: Customer[]

// Get customer profile
GET /api/admin/customers/:id
Response: Customer

// Update customer
PUT /api/admin/customers/:id
Body: Partial<Customer>
Response: Customer

// Block/Unblock customer
POST /api/admin/customers/:id/block
Body: { blocked: boolean }
Response: { success: true }

// Send password reset email
POST /api/admin/customers/:id/reset-password
Response: { success: true }
```

### Coupons API ⚠️ MOCK (needs implementation)

```typescript
// Get all coupons
GET /api/admin/coupons
Query params: ?status=active&type=percentage
Response: Coupon[]

// Get single coupon
GET /api/admin/coupons/:id
Response: Coupon

// Create coupon
POST /api/admin/coupons
Body: Coupon (without id, usageCount)
Response: Coupon

// Update coupon
PUT /api/admin/coupons/:id
Body: Partial<Coupon>
Response: Coupon

// Delete coupon
DELETE /api/admin/coupons/:id
Response: { success: true }
```

### Banners API ⚠️ MOCK (needs implementation)

```typescript
// Get all banners
GET /api/admin/banners
Response: Banner[]

// Get single banner
GET /api/admin/banners/:id
Response: Banner

// Create banner
POST /api/admin/banners
Body: Banner (without id)
Response: Banner

// Update banner
PUT /api/admin/banners/:id
Body: Partial<Banner>
Response: Banner

// Delete banner
DELETE /api/admin/banners/:id
Response: { success: true }
```

---

## Extended Wholesale API

```typescript
// Get single wholesale application (extend existing)
GET /api/wholesale/applications/:id
Response: WholesaleApplication

// Review application (more detailed than approve)
POST /api/wholesale/applications/:id/review
Body: {
  status: "approved" | "rejected",
  tier?: "tier1" | "tier2" | "tier3",
  notes?: string
}
Response: WholesaleApplication
```

---

## Already Implemented ✅

These endpoints are already available in your frontend:

### Dashboard & Analytics
```typescript
GET /api/admin/dashboard
GET /api/admin/analytics
```

### Inventory
```typescript
GET /api/admin/inventory
POST /api/admin/inventory
GET /api/admin/inventory/users
```

### Orders
```typescript
GET /api/orders
GET /api/orders/:id
PUT /api/orders/:id
```

### Wholesale Applications
```typescript
GET /api/wholesale/applications
POST /api/wholesale/approve/:id
```

### Repair Tickets
```typescript
GET /api/repairs
GET /api/repairs/:id
PATCH /api/repairs/:id
```

---

## Type Definitions

All types are defined in `src/lib/types.ts`. Here are the key ones:

### Product
```typescript
type Product = {
    id: string;
    name: string;
    sku: string;
    slug: string;
    category: string;
    brand: string;
    model?: string;
    productType?: string;
    basePrice: number;
    costPrice?: number;
    wholesaleDiscounts?: {
        tier1?: number;
        tier2?: number;
        tier3?: number;
    };
    stock: number;
    lowStockThreshold?: number;
    images?: string[];
    thumbnail?: string;
    description?: string;
    specifications?: Record<string, any>;
    metaTitle?: string;
    metaDescription?: string;
    isActive: boolean;
    isFeatured?: boolean;
    isNew?: boolean;
    isBestseller?: boolean;
    createdAt?: string;
    updatedAt?: string;
};
```

### Customer
```typescript
type Customer = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: "customer" | "wholesale" | "admin";
    ordersCount: number;
    totalSpent: number;
    wholesaleStatus?: "pending" | "approved" | "rejected";
    wholesaleTier?: string;
    addresses?: Address[];
    adminNotes?: string;
    isBlocked: boolean;
    createdAt: string;
};
```

### Coupon
```typescript
type Coupon = {
    id: string;
    code: string;
    description: string;
    type: "percentage" | "fixed";
    value: number;
    restrictions: {
        minPurchase?: number;
        maxDiscount?: number;
        maxUsesTotal?: number;
        maxUsesPerUser?: number;
        appliesTo: "all" | "products" | "categories";
        productIds?: string[];
        categoryIds?: string[];
        userRestriction: "all" | "new" | "wholesale" | "retail";
    };
    startDate: string;
    endDate?: string;
    usageCount: number;
    status: "active" | "inactive" | "expired";
    createdAt: string;
};
```

---

## Implementation Priority

### Phase 1 - Critical (Implement First)
1. ✅ Products API - **REQUIRED** for basic admin functionality
2. ✅ Extended Wholesale Application API - Complete the review flow

### Phase 2 - Important
3. ✅ Customers API - Customer management
4. ✅ Coupons API - Marketing functionality

### Phase 3 - Nice to Have
5. ✅ Banners API - Homepage management
6. ✅ Stock Adjustment API - Enhanced inventory

---

## Quick Start Implementation

### 1. Create API Route Structure

In your FixItUp-Frontend project:
```
src/app/api/
├── admin/
│   ├── products/
│   │   ├── route.ts              # GET, POST
│   │   ├── [id]/route.ts         # GET, PUT, DELETE
│   │   └── bulk-import/route.ts  # POST
│   ├── customers/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       ├── block/route.ts
│   │       └── reset-password/route.ts
│   ├── coupons/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── banners/
│       ├── route.ts
│       └── [id]/route.ts
```

### 2. Example Implementation (Products)

```typescript
// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  let query = supabase.from("products").select("*");

  if (search) {
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
  }
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("products")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

### 3. Database Schema (Supabase)

Make sure your Supabase database has these tables:
- `products` - Matches Product type
- `customers` / `users` - Matches Customer type
- `coupons` - Matches Coupon type
- `banners` - Matches Banner type

---

## Testing Endpoints

Once implemented, test with:

```bash
# Test products list
curl http://localhost:3001/api/admin/products

# Test product create
curl -X POST http://localhost:3001/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","sku":"TEST-001","basePrice":99.99,"stock":10,"isActive":true}'

# Test product update
curl -X PUT http://localhost:3001/api/admin/products/123 \
  -H "Content-Type: application/json" \
  -d '{"stock":20}'
```

---

## Error Handling

All API endpoints should return consistent error responses:

```typescript
{
  "error": "Error message here",
  "status": 400 // or 401, 404, 500, etc.
}
```

The admin panel will display these errors to the user using Ant Design message components.

---

## Authentication

**Important:** Add authentication middleware to all `/api/admin/*` routes to ensure only authorized users can access admin functions.

Example middleware:
```typescript
// Check if user has admin role
const user = await getCurrentUser(request);
if (user.role !== "admin") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

This completes the API requirements documentation. Focus on implementing the Products API first, as it's critical for basic admin functionality!
