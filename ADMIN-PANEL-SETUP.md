# Admin Panel Setup Guide

## Status: ✅ ALL APIs ARE READY!

Good news! All the required API endpoints are already implemented in your frontend project (`/Users/koushiksaha/Desktop/FixItUp/max-phone-repair/frontend`) and connected to Supabase.

The admin panel just needs to be configured to connect to them.

---

## Quick Setup (3 Steps)

### Step 1: Start the Frontend API Server

```bash
cd /Users/koushiksaha/Desktop/FixItUp/max-phone-repair/frontend
npm run dev
```

This will start the API server at `http://localhost:3000`

### Step 2: Configure Admin Panel Environment

Create `.env.local` in the admin panel directory:

```bash
cd /Users/koushiksaha/Desktop/FixItUp/fixit-admin
```

Create `.env.local` file with:

```env
# Point to your frontend API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Step 3: Start the Admin Panel

```bash
npm run dev
```

The admin panel will start at `http://localhost:3001` (or another port if 3001 is taken).

---

## Create Admin User

Before you can access the admin panel, you need an admin user in Supabase.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User**
4. Enter:
   - Email: `admin@maxfixit.com`
   - Password: (your choice)
   - Confirm the email automatically

5. Go to **SQL Editor** and run this query:

```sql
-- Get the user ID you just created
SELECT id, email FROM auth.users WHERE email = 'admin@maxfixit.com';

-- Update the profile to admin role
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@maxfixit.com');

-- Verify it worked
SELECT p.id, p.role, u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'admin@maxfixit.com';
```

### Option 2: Using SQL Only

Run this in Supabase SQL Editor:

```sql
-- Insert a new user (manual approach)
-- First, you need to sign up through the frontend, then run:

UPDATE public.profiles
SET role = 'admin'
WHERE id = 'YOUR-USER-ID-HERE';
```

---

## Verify Setup

### 1. Test API Connection

Open browser console and run:

```javascript
fetch('http://localhost:3000/api/admin/products')
  .then(res => res.json())
  .then(data => console.log(data))
```

Expected: You'll get a 401 Unauthorized (normal - you're not logged in yet)

### 2. Login to Admin Panel

1. Go to `http://localhost:3001` (admin panel)
2. Login with your admin credentials
3. You should now see data loading!

---

## Available Admin APIs

All these endpoints are **READY** in your frontend:

### ✅ Products API (6 endpoints)
- `GET /api/admin/products` - List products with filters
- `GET /api/admin/products/:id` - Get single product
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product (soft delete)
- `POST /api/admin/products/bulk-import` - Bulk import

### ✅ Customers API (5 endpoints)
- `GET /api/admin/customers` - List customers
- `GET /api/admin/customers/:id` - Get customer profile
- `PUT /api/admin/customers/:id` - Update customer
- `POST /api/admin/customers/:id/block` - Block/unblock customer
- `POST /api/admin/customers/:id/reset-password` - Reset password

### ✅ Coupons API (5 endpoints)
- `GET /api/admin/coupons` - List coupons
- `GET /api/admin/coupons/:id` - Get single coupon
- `POST /api/admin/coupons` - Create coupon
- `PUT /api/admin/coupons/:id` - Update coupon
- `DELETE /api/admin/coupons/:id` - Delete coupon

### ✅ Orders API (3 endpoints)
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status

### ✅ Repairs API (3 endpoints)
- `GET /api/repairs` - List repair tickets
- `GET /api/repairs/:id` - Get repair details
- `PATCH /api/repairs/:id` - Update repair ticket

### ✅ Inventory API (3 endpoints)
- `GET /api/admin/inventory` - List inventory
- `POST /api/admin/inventory` - Update inventory
- `GET /api/admin/inventory/users` - Get user inventory

### ✅ Wholesale API (2 endpoints)
- `GET /api/wholesale/applications` - List applications
- `POST /api/wholesale/approve/:id` - Approve/reject

### ✅ Dashboard API (2 endpoints)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/analytics` - Analytics data

---

## Troubleshooting

### Issue: "Cannot connect to API"

**Solution**: Make sure frontend is running
```bash
cd /Users/koushiksaha/Desktop/FixItUp/max-phone-repair/frontend
npm run dev
```

### Issue: "401 Unauthorized"

**Solutions**:
1. Make sure you created an admin user (see above)
2. Login to the admin panel with admin credentials
3. Check that the profile role is set to 'admin' in database

### Issue: "No data showing"

**Solutions**:
1. Make sure you ran the seed data files (seed-COMPLETE-CLEAN-INSERT.sql)
2. Verify data exists in Supabase:
```sql
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM coupons;
```

### Issue: "CORS errors"

**Solution**: Both frontend and admin panel must run on localhost
- Frontend: `http://localhost:3000`
- Admin: `http://localhost:3001`

---

## Project Structure

```
/Users/koushiksaha/Desktop/FixItUp/
├── max-phone-repair/
│   └── frontend/              ← API SERVER (runs on port 3000)
│       └── src/app/api/
│           └── admin/         ← All admin endpoints here
│               ├── products/
│               ├── customers/
│               ├── coupons/
│               ├── dashboard/
│               └── ...
│
└── fixit-admin/               ← ADMIN PANEL (runs on port 3001)
    ├── .env.local            ← Create this file
    └── src/
        ├── app/              ← Admin panel pages
        └── lib/
            └── api.ts        ← API client (already configured)
```

---

## Next Steps

1. ✅ Start frontend: `cd frontend && npm run dev`
2. ✅ Create `.env.local` in admin panel with API URL
3. ✅ Start admin panel: `cd fixit-admin && npm run dev`
4. ✅ Create admin user in Supabase
5. ✅ Login to admin panel
6. ✅ Start managing products, orders, customers!

---

## Production Deployment

When deploying to production:

1. **Frontend** (Vercel/similar):
   - Deploy to: `https://yoursite.com`
   - APIs available at: `https://yoursite.com/api/admin/*`

2. **Admin Panel** (Vercel/similar):
   - Deploy separately
   - Set environment variable:
     ```
     NEXT_PUBLIC_API_URL=https://yoursite.com/api
     ```

---

**Status**: ✅ Ready to use!

All API endpoints are implemented, tested, and connected to Supabase.
Just follow the 3 setup steps above and you're good to go!
