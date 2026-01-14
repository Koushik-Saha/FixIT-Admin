// API client utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true';

interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Callback for unauthorized responses
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedCallback(callback: () => void) {
  onUnauthorized = callback;
}

// Helper to get headers with mock auth token if in mock mode
function getHeaders(additionalHeaders: Record<string, string> = {}) {
  const headers: Record<string, string> = { ...additionalHeaders };

  // Add mock auth token in development mock mode
  if (MOCK_MODE) {
    headers['x-mock-auth'] = 'mock-dev-token';
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      if (onUnauthorized) {
        onUnauthorized();
      }
    }

    const error: ApiError = {
      message: `API Error: ${response.statusText}`,
      status: response.status,
    };

    // Try to parse error details from response
    try {
      const errorData = await response.json();
      error.message = errorData.message || error.message;
      error.errors = errorData.errors;
    } catch {
      // Response wasn't JSON, use default error
    }

    throw error;
  }
  return response.json();
}

// Dashboard & Analytics
export async function getDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    credentials: 'include',
    headers: getHeaders()
  });
  return handleResponse(response);
}

export async function getAnalytics() {
  const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
    credentials: 'include',
    headers: getHeaders()
  });
  return handleResponse(response);
}

// Inventory Management
export async function getInventory(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`${API_BASE_URL}/admin/inventory${query}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function updateInventory(data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function getUserInventory() {
  const response = await fetch(`${API_BASE_URL}/admin/inventory/users`, { credentials: 'include' });
  return handleResponse(response);
}

// Products
export async function getProducts(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`${API_BASE_URL}/admin/products${query}`, {
    credentials: 'include',
    headers: getHeaders()
  });
  return handleResponse(response);
}

export async function getProduct(id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    credentials: 'include',
    headers: getHeaders()
  });
  return handleResponse(response);
}

export async function createProduct(data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateProduct(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteProduct(id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

export async function bulkImportProducts(data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/products/bulk-import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Orders
export async function getOrders(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`${API_BASE_URL}/orders${query}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function getOrder(id: string) {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function updateOrder(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Wholesale Applications
export async function getWholesaleApplications(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`${API_BASE_URL}/wholesale/applications${query}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function approveWholesaleApplication(id: string, approved: boolean) {
  const response = await fetch(`${API_BASE_URL}/wholesale/approve/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ approved }),
  });
  return handleResponse(response);
}

// Repair Tickets
export async function getRepairs(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`${API_BASE_URL}/repairs${query}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function getRepair(id: string) {
  const response = await fetch(`${API_BASE_URL}/repairs/${id}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function updateRepair(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/repairs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Customers (MOCK - needs implementation)
export async function getCustomers(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`${API_BASE_URL}/admin/customers${query}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function getCustomer(id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/customers/${id}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function updateCustomer(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function blockCustomer(id: string, blocked: boolean) {
  const response = await fetch(`${API_BASE_URL}/admin/customers/${id}/block`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ blocked }),
  });
  return handleResponse(response);
}

export async function resetCustomerPassword(id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/customers/${id}/reset-password`, {
    method: 'POST',
  });
  return handleResponse(response);
}

// Wholesale Applications Extended
export async function getWholesaleApplication(id: string) {
  const response = await fetch(`${API_BASE_URL}/wholesale/applications/${id}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function reviewWholesaleApplication(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/wholesale/applications/${id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Coupons (MOCK - needs implementation)
export async function getCoupons(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`${API_BASE_URL}/admin/coupons${query}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function getCoupon(id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/coupons/${id}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function createCoupon(data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/coupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateCoupon(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/coupons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteCoupon(id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/coupons/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

// Banners (MOCK - needs implementation)
export async function getBanners(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`${API_BASE_URL}/admin/banners${query}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function getBanner(id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/banners/${id}`, { credentials: 'include' });
  return handleResponse(response);
}

export async function createBanner(data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/banners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateBanner(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/banners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteBanner(id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/banners/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

// Stock Adjustments
export async function adjustStock(data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/inventory/adjust`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}
