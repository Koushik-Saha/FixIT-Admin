// src/lib/mockApi.ts
import type {
    Product,
    Order,
    RepairTicket,
    WholesaleAccount,
    PricingTier,
    InventoryItem,
} from "./types";

// Helper to generate arrays
function range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
}

const products: Product[] = range(40).map((i) => ({
    id: `P-${1000 + i}`,
    name: `Product ${i + 1}`,
    sku: `SKU-${1000 + i}`,
    slug: `product-${1000 + i}`,
    category: i % 3 === 0 ? "Cases" : i % 3 === 1 ? "Chargers" : "Screen Protectors",
    brand: i % 2 === 0 ? "Apple" : "Samsung",
    basePrice: 9.99 + (i % 10) * 3,
    stock: 5 + (i * 3) % 150,
    isActive: i % 7 !== 0,
}));

const orders: Order[] = range(55).map((i) => ({
    id: `O-${1000 + i}`,
    orderNumber: `ORD-${1000 + i}`,
    customerName:
        i % 4 === 0
            ? "John Doe"
            : i % 4 === 1
                ? "Repair Shop LA"
                : i % 4 === 2
                    ? "Bay Area Fix"
                    : "Sarah Lee",
    customerEmail:
        i % 4 === 0
            ? "john@example.com"
            : i % 4 === 1
                ? "la@repairshop.com"
                : i % 4 === 2
                    ? "bay@fix.com"
                    : "sarah@example.com",
    customerType: i % 3 === 0 ? "wholesale" : "retail",
    items: [],
    subtotal: Math.round((50 + (i % 20) * 17.3) * 100) / 100,
    total: Math.round((50 + (i % 20) * 17.3) * 100) / 100,
    status:
        i % 5 === 0
            ? "processing"
            : i % 5 === 1
                ? "shipped"
                : i % 5 === 2
                    ? "delivered"
                    : i % 5 === 3
                        ? "cancelled"
                        : "processing",
    paymentStatus:
        i % 4 === 0
            ? "paid"
            : i % 4 === 1
                ? "pending"
                : i % 4 === 2
                    ? "refunded"
                    : "paid",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

const repairs: RepairTicket[] = range(38).map((i) => ({
    id: `R-${9000 + i}`,
    ticketNumber: `TKT-${9000 + i}`,
    customerId: `C-${100 + (i % 20)}`,
    customerName:
        i % 3 === 0 ? "Alex Kim" : i % 3 === 1 ? "Maria Gomez" : "Chris Johnson",
    customerEmail:
        i % 3 === 0 ? "alex@example.com" : i % 3 === 1 ? "maria@example.com" : "chris@example.com",
    device: {
        brand: i % 2 === 0 ? "Apple" : "Samsung",
        model: i % 2 === 0 ? "iPhone 13" : "Galaxy S22",
    },
    issue: {
        description:
            i % 4 === 0
                ? "Screen cracked"
                : i % 4 === 1
                    ? "Battery draining fast"
                    : i % 4 === 2
                        ? "Not charging"
                        : "Camera issue",
        category: i % 2 === 0 ? "Screen" : "Battery",
    },
    status:
        i % 4 === 0
            ? "new"
            : i % 4 === 1
                ? "in_progress"
                : i % 4 === 2
                    ? "completed"
                    : "cancelled",
    priority:
        i % 4 === 0
            ? "low"
            : i % 4 === 1
                ? "medium"
                : i % 4 === 2
                    ? "high"
                    : "urgent",
    createdAt: new Date(Date.now() - i * 43200000).toISOString(),
}));

const wholesaleAccounts: WholesaleAccount[] = range(32).map((i) => ({
    id: `W-${100 + i}`,
    businessName:
        i % 3 === 0
            ? `Downtown Repair ${i}`
            : i % 3 === 1
                ? `Mobile Hub ${i}`
                : `Fix Center ${i}`,
    contactName:
        i % 3 === 0 ? "Alex Kim" : i % 3 === 1 ? "Maria Gomez" : "Chris Lee",
    email: `contact${i}@example.com`,
    status:
        i % 4 === 0 ? "pending" : i % 4 === 1 ? "approved" : i % 4 === 2 ? "pending" : "rejected",
    tier: i % 3 === 0 ? "Starter" : i % 3 === 1 ? "Silver" : "Gold",
}));

const pricingTiers: PricingTier[] = [
    { id: "T1", name: "Starter", discountPercent: 10, minMonthlySpend: 500 },
    { id: "T2", name: "Silver", discountPercent: 15, minMonthlySpend: 1500 },
    { id: "T3", name: "Gold", discountPercent: 20, minMonthlySpend: 3500 },
    { id: "T4", name: "Platinum", discountPercent: 25, minMonthlySpend: 7000 },
];

const inventory: InventoryItem[] = range(60).map((i) => ({
    id: `I-${2000 + i}`,
    productId: products[i % products.length].id,
    sku: products[i % products.length].sku,
    name: products[i % products.length].name,
    location: i % 2 === 0 ? "Main Warehouse" : "Overflow",
    stock: (i * 7) % 160,
    lowStockThreshold: 25,
}));

// Dashboard stats
export async function fetchDashboardStats() {
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const openRepairs = repairs.filter((r) => r.status !== "completed").length;
    const pendingWholesale = wholesaleAccounts.filter(
        (w) => w.status === "pending",
    ).length;

    return {
        totalOrders,
        totalProducts,
        openRepairs,
        pendingWholesale,
    };
}

// Listing APIs – replace with real APIs later
export async function fetchProducts(): Promise<Product[]> {
    return products;
}

export async function fetchOrders(): Promise<Order[]> {
    return orders;
}

export async function fetchRepairs(): Promise<RepairTicket[]> {
    return repairs;
}

export async function fetchWholesaleAccounts(): Promise<WholesaleAccount[]> {
    return wholesaleAccounts;
}

export async function fetchPricingTiers(): Promise<PricingTier[]> {
    return pricingTiers;
}

export async function fetchInventory(): Promise<InventoryItem[]> {
    return inventory;
}
