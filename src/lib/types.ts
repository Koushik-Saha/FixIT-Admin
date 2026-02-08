export type Product = {
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
    totalStock: number;
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

export type Order = {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerType: "retail" | "wholesale";
    // Backend doesn't always return items in list view
    items?: OrderItem[];
    // Backend uses totalAmount
    totalAmount: number;
    subtotal?: number;
    taxAmount?: number;
    shippingCost?: number;

    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus: "pending" | "paid" | "refunded" | "failed";
    paymentMethod?: string;

    shippingAddress?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    trackingNumber?: string;
    carrier?: string;
    isWholesale?: boolean;
    createdAt: string;
    updatedAt?: string;
};

export type OrderItem = {
    id: string;
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
    discount?: number;
    subtotal: number;
};

export type OrderEvent = {
    id: string;
    type: string;
    description: string;
    createdAt: string;
};

export type Customer = {
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

export type Address = {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
};

export type RepairTicket = {
    id: string;
    ticketNumber: string;
    customerId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;

    // Flattened device fields matching backend
    deviceBrand: string;
    deviceModel: string;
    imeiSerial?: string;

    issueDescription?: string;
    issueCategory?: string;

    status: "new" | "in_progress" | "awaiting_parts" | "completed" | "cancelled" | "submitted";
    priority: "low" | "medium" | "high" | "urgent" | "normal";

    createdAt: string;
    updatedAt?: string;
};

export type WholesaleAccount = {
    id: string;
    businessName: string;
    contactName: string;
    email: string;
    status: "pending" | "approved" | "rejected";
    tier: string;
};

export type WholesaleApplication = {
    id: string;
    businessInfo: {
        name: string;
        type: string;
        taxId?: string;
        website?: string;
        phone: string;
    };
    contact: {
        name: string;
        email: string;
        phone: string;
    };
    address: Address;
    requestedTier: string;
    documents?: string[];
    status: "pending" | "approved" | "rejected";
    statusHistory?: {
        status: string;
        date: string;
        notes?: string;
    }[];
    adminNotes?: string;
    createdAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
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
    category?: string;
};

export type StockAdjustment = {
    productId: string;
    store: string;
    currentStock: number;
    adjustmentType: "add" | "remove" | "set" | "transfer";
    amount: number;
    reason: "restock" | "damage" | "correction" | "transfer" | "sale" | "return";
    notes?: string;
    transferTo?: string;
};

export type Coupon = {
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

export type Banner = {
    id: string;
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
    createdAt: string;
};

export type DashboardStats = {
    today: {
        sales: number;
        orders: number;
        customers: number;
    };
    revenue: {
        labels: string[];
        data: number[];
    };
    orderStatus: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
    };
    topProducts: {
        id: string;
        name: string;
        sales: number;
        revenue: number;
    }[];
    lowStockCount: number;
    wholesaleApplicationsPending: number;
    repairTickets: {
        new: number;
        inProgress: number;
        completed: number;
    };
};
