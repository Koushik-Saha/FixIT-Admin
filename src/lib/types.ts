export type Product = {
    id: string;
    name: string;
    sku: string;
    category: string;
    brand: string;
    price: number;
    wholesalePrice: number;
    stock: number;
    status: "active" | "draft" | "archived";
};

export type Order = {
    id: string;
    customerName: string;
    total: number;
    status: "pending" | "paid" | "shipped" | "cancelled";
    createdAt: string;
};

export type RepairTicket = {
    id: string;
    customerName: string;
    device: string;
    issue: string;
    status: "new" | "in_progress" | "completed" | "cancelled";
    createdAt: string;
};

export type WholesaleAccount = {
    id: string;
    businessName: string;
    contactName: string;
    email: string;
    status: "pending" | "approved" | "rejected";
    tier: string;
};

export type PricingTier = {
    id: string;
    name: string;
    discountPercent: number;
    minMonthlySpend: number;
};

export type InventoryItem = {
    id: string;
    productId: string;
    sku: string;
    name: string;
    location: string;
    stock: number;
    lowStockThreshold: number;
};
