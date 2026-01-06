# Complete API Endpoint List - FixIt Admin Panel

## Status Legend
- ✅ **Available** - Already implemented in frontend
- ⚠️ **Required** - Needs implementation (critical)
- 📋 **Optional** - Needs implementation (nice to have)

---

## 1. Dashboard & Analytics

### Dashboard Stats
```
GET /api/admin/dashboard
Status: ✅ Available
Response: DashboardStats
```

### Analytics Data
```
GET /api/admin/analytics
Status: ✅ Available
Response: Analytics data
```

---

## 2. Products

### List Products
```
GET /api/admin/products
Status: ⚠️ Required
Query Parameters:
  - search: string (searches name, SKU, brand, model)
  - category: string
  - brand: string
  - status: "active" | "inactive"
  - stock: "in-stock" | "low-stock" | "out-of-stock"
Response: Product[]
```

### Get Single Product
```
GET /api/admin/products/:id
Status: ⚠️ Required
Response: Product
```

### Create Product
```
POST /api/admin/products
Status: ⚠️ Required
Body: {
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
}
Response: Product
```

### Update Product
```
PUT /api/admin/products/:id
Status: ⚠️ Required
Body: Partial<Product>
Response: Product
```

### Delete Product
```
DELETE /api/admin/products/:id
Status: ⚠️ Required
Response: { success: boolean }
```

### Bulk Import Products
```
POST /api/admin/products/bulk-import
Status: ⚠️ Required
Body: {
  products: Product[]
}
Response: {
  imported: number;
  failed: number;
  errors?: string[];
}
```

---

## 3. Orders

### List Orders
```
GET /api/orders
Status: ✅ Available
Query Parameters:
  - search: string (searches order#, customer name, email)
  - status: "processing" | "shipped" | "delivered" | "cancelled"
  - paymentStatus: "pending" | "paid" | "refunded" | "failed"
  - customerType: "retail" | "wholesale"
  - startDate: string (YYYY-MM-DD)
  - endDate: string (YYYY-MM-DD)
  - customerId: string
Response: Order[]
```

### Get Order Details
```
GET /api/orders/:id
Status: ✅ Available
Response: Order
```

### Update Order
```
PUT /api/orders/:id
Status: ✅ Available
Body: {
  status?: "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  carrier?: string;
  adminNotes?: string;
  sendEmail?: boolean;
}
Response: Order
```

---

## 4. Customers

### List Customers
```
GET /api/admin/customers
Status: ⚠️ Required
Query Parameters:
  - search: string (searches name, email, phone)
  - role: "customer" | "wholesale" | "admin"
  - wholesaleStatus: "pending" | "approved" | "rejected"
Response: Customer[]
```

### Get Customer Profile
```
GET /api/admin/customers/:id
Status: ⚠️ Required
Response: Customer
```

### Update Customer
```
PUT /api/admin/customers/:id
Status: ⚠️ Required
Body: {
  name?: string;
  email?: string;
  phone?: string;
  role?: "customer" | "wholesale" | "admin";
  wholesaleTier?: string;
  adminNotes?: string;
}
Response: Customer
```

### Block/Unblock Customer
```
POST /api/admin/customers/:id/block
Status: ⚠️ Required
Body: {
  blocked: boolean
}
Response: { success: boolean }
```

### Reset Customer Password
```
POST /api/admin/customers/:id/reset-password
Status: ⚠️ Required
Response: { success: boolean; message: string }
```

---

## 5. Wholesale Applications

### List Wholesale Applications
```
GET /api/wholesale/applications
Status: ✅ Available
Query Parameters:
  - search: string (searches business name, email)
  - status: "pending" | "approved" | "rejected"
Response: WholesaleApplication[]
```

### Get Application Details
```
GET /api/wholesale/applications/:id
Status: 📋 Optional (extend existing)
Response: WholesaleApplication
```

### Approve/Reject Application (Simple)
```
POST /api/wholesale/approve/:id
Status: ✅ Available
Body: {
  approved: boolean
}
Response: WholesaleApplication
```

### Review Application (Detailed)
```
POST /api/wholesale/applications/:id/review
Status: 📋 Optional
Body: {
  status: "approved" | "rejected";
  tier?: "tier1" | "tier2" | "tier3";
  notes?: string;
}
Response: WholesaleApplication
```

---

## 6. Repair Tickets

### List Repair Tickets
```
GET /api/repairs
Status: ✅ Available
Query Parameters:
  - search: string (searches ticket#, customer, device)
  - status: "new" | "in_progress" | "awaiting_parts" | "completed" | "cancelled"
  - priority: "low" | "medium" | "high" | "urgent"
  - store: string
  - technician: string
  - customerId: string
Response: RepairTicket[]
```

### Get Repair Ticket Details
```
GET /api/repairs/:id
Status: ✅ Available
Response: RepairTicket
```

### Update Repair Ticket
```
PATCH /api/repairs/:id
Status: ✅ Available
Body: {
  status?: "new" | "in_progress" | "awaiting_parts" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  assignment?: {
    store?: string;
    technician?: string;
    appointment?: string;
  };
  costs?: {
    estimated?: number;
    actual?: number;
    parts?: number;
    labor?: number;
  };
  notes?: {
    customer?: string;
    technician?: string;
    internal?: string;
  };
}
Response: RepairTicket
```

---

## 7. Inventory

### Get Inventory
```
GET /api/admin/inventory
Status: ✅ Available
Query Parameters:
  - store: string
  - category: string
  - stock: "in-stock" | "low-stock" | "out-of-stock"
Response: InventoryItem[]
```

### Update Inventory
```
POST /api/admin/inventory
Status: ✅ Available
Body: {
  productId: string;
  store: string;
  stock: number;
}
Response: InventoryItem
```

### Get User Inventory
```
GET /api/admin/inventory/users
Status: ✅ Available
Response: InventoryItem[]
```

### Stock Adjustment
```
POST /api/admin/inventory/adjust
Status: 📋 Optional
Body: {
  productId: string;
  store: string;
  currentStock: number;
  adjustmentType: "add" | "remove" | "set" | "transfer";
  amount: number;
  reason: "restock" | "damage" | "correction" | "transfer" | "sale" | "return";
  notes?: string;
  transferTo?: string;
}
Response: { success: boolean; newStock: number }
```

---

## 8. Coupons

### List Coupons
```
GET /api/admin/coupons
Status: ⚠️ Required
Query Parameters:
  - status: "active" | "inactive" | "expired"
  - type: "percentage" | "fixed"
Response: Coupon[]
```

### Get Single Coupon
```
GET /api/admin/coupons/:id
Status: ⚠️ Required
Response: Coupon
```

### Create Coupon
```
POST /api/admin/coupons
Status: ⚠️ Required
Body: {
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
  status: "active" | "inactive";
}
Response: Coupon
```

### Update Coupon
```
PUT /api/admin/coupons/:id
Status: ⚠️ Required
Body: Partial<Coupon>
Response: Coupon
```

### Delete Coupon
```
DELETE /api/admin/coupons/:id
Status: ⚠️ Required
Response: { success: boolean }
```

---

## 9. Homepage Banners

### List Banners
```
GET /api/admin/banners
Status: 📋 Optional
Response: Banner[]
```

### Get Single Banner
```
GET /api/admin/banners/:id
Status: 📋 Optional
Response: Banner
```

### Create Banner
```
POST /api/admin/banners
Status: 📋 Optional
Body: {
  title: string;
  subtitle?: string;
  imageDesktop: string;
  imageMobile?: string;
  linkUrl?: string;
  linkText?: string;
  colors?: {
    background?: string;
    text?: string;
  };
  displayOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}
Response: Banner
```

### Update Banner
```
PUT /api/admin/banners/:id
Status: 📋 Optional
Body: Partial<Banner>
Response: Banner
```

### Delete Banner
```
DELETE /api/admin/banners/:id
Status: 📋 Optional
Response: { success: boolean }
```

---

## Summary by Status

### ✅ Already Available (11 endpoints)
1. `GET /api/admin/dashboard`
2. `GET /api/admin/analytics`
3. `GET /api/admin/inventory`
4. `POST /api/admin/inventory`
5. `GET /api/admin/inventory/users`
6. `GET /api/orders`
7. `GET /api/orders/:id`
8. `PUT /api/orders/:id`
9. `GET /api/wholesale/applications`
10. `POST /api/wholesale/approve/:id`
11. `GET /api/repairs`
12. `GET /api/repairs/:id`
13. `PATCH /api/repairs/:id`

### ⚠️ Required - Implement First (16 endpoints)
**Products (6):**
1. `GET /api/admin/products`
2. `GET /api/admin/products/:id`
3. `POST /api/admin/products`
4. `PUT /api/admin/products/:id`
5. `DELETE /api/admin/products/:id`
6. `POST /api/admin/products/bulk-import`

**Customers (5):**
7. `GET /api/admin/customers`
8. `GET /api/admin/customers/:id`
9. `PUT /api/admin/customers/:id`
10. `POST /api/admin/customers/:id/block`
11. `POST /api/admin/customers/:id/reset-password`

**Coupons (5):**
12. `GET /api/admin/coupons`
13. `GET /api/admin/coupons/:id`
14. `POST /api/admin/coupons`
15. `PUT /api/admin/coupons/:id`
16. `DELETE /api/admin/coupons/:id`

### 📋 Optional - Implement Later (7 endpoints)
**Banners (5):**
1. `GET /api/admin/banners`
2. `GET /api/admin/banners/:id`
3. `POST /api/admin/banners`
4. `PUT /api/admin/banners/:id`
5. `DELETE /api/admin/banners/:id`

**Extended (2):**
6. `GET /api/wholesale/applications/:id`
7. `POST /api/wholesale/applications/:id/review`

**Inventory (1):**
8. `POST /api/admin/inventory/adjust`

---

## Total Endpoints: 37

- ✅ **Available**: 13 (35%)
- ⚠️ **Required**: 16 (43%)
- 📋 **Optional**: 8 (22%)

---

## Implementation Order (Recommended)

### Phase 1 - Core Functionality
1. Products API (6 endpoints) - **CRITICAL**
2. Customers API (5 endpoints)
3. Coupons API (5 endpoints)

### Phase 2 - Enhanced Features
4. Extended Wholesale (2 endpoints)
5. Banners API (5 endpoints)
6. Stock Adjustments (1 endpoint)

---

## Quick Copy-Paste List

```
# Already Available ✅
GET    /api/admin/dashboard
GET    /api/admin/analytics
GET    /api/admin/inventory
POST   /api/admin/inventory
GET    /api/admin/inventory/users
GET    /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id
GET    /api/wholesale/applications
POST   /api/wholesale/approve/:id
GET    /api/repairs
GET    /api/repairs/:id
PATCH  /api/repairs/:id

# Required Implementation ⚠️
GET    /api/admin/products
GET    /api/admin/products/:id
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
POST   /api/admin/products/bulk-import

GET    /api/admin/customers
GET    /api/admin/customers/:id
PUT    /api/admin/customers/:id
POST   /api/admin/customers/:id/block
POST   /api/admin/customers/:id/reset-password

GET    /api/admin/coupons
GET    /api/admin/coupons/:id
POST   /api/admin/coupons
PUT    /api/admin/coupons/:id
DELETE /api/admin/coupons/:id

# Optional Implementation 📋
GET    /api/wholesale/applications/:id
POST   /api/wholesale/applications/:id/review

GET    /api/admin/banners
GET    /api/admin/banners/:id
POST   /api/admin/banners
PUT    /api/admin/banners/:id
DELETE /api/admin/banners/:id

POST   /api/admin/inventory/adjust
```

---

## Authentication Note

All `/api/admin/*` endpoints should require authentication and admin role verification:

```typescript
// Middleware example
const user = await getCurrentUser(request);
if (!user || user.role !== "admin") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

## Error Response Format

All endpoints should return errors in this format:

```json
{
  "error": "Error message here",
  "status": 400
}
```

Success responses vary by endpoint but typically return the requested resource or a success confirmation.
