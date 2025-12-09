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
    category: i % 3 === 0 ? "Cases" : i % 3 === 1 ? "Chargers" : "Screen Protectors",
    brand: i % 2 === 0 ? "Apple" : "Samsung",
    price: 9.99 + (i % 10) * 3,
    wholesalePrice: 5.5 + (i % 10) * 2,
    stock: 5 + (i * 3) % 150,
    status: i % 7 === 0 ? "draft" : "active",
}));

const orders: Order[] = range(55).map((i) => ({
    id: `O-${1000 + i}`,
    customerName:
        i % 4 === 0
            ? "John Doe"
            : i % 4 === 1
                ? "Repair Shop LA"
                : i % 4 === 2
                    ? "Bay Area Fix"
                    : "Sarah Lee",
    total: Math.round((50 + (i % 20) * 17.3) * 100) / 100,
    status:
        i % 5 === 0
            ? "pending"
            : i % 5 === 1
                ? "paid"
                : i % 5 === 2
                    ? "shipped"
                    : i % 5 === 3
                        ? "cancelled"
                        : "paid",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

const repairs: RepairTicket[] = range(38).map((i) => ({
    id: `R-${9000 + i}`,
    customerName:
        i % 3 === 0 ? "Alex Kim" : i % 3 === 1 ? "Maria Gomez" : "Chris Johnson",
    device: i % 2 === 0 ? "iPhone 13" : "Samsung S22",
    issue:
        i % 4 === 0
            ? "Screen cracked"
            : i % 4 === 1
                ? "Battery draining fast"
                : i % 4 === 2
                    ? "Not charging"
                    : "Camera issue",
    status:
        i % 4 === 0
            ? "new"
            : i % 4 === 1
                ? "in_progress"
                : i % 4 === 2
                    ? "completed"
                    : "cancelled",
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
