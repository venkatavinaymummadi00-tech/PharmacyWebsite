const API_BASE = '/api';

async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || json.message || 'API Request failed');
    }
    return json;
  } catch (err) {
    console.warn(`[API] Error on ${url}:`, err.message);
    throw err;
  }
}

export const api = {
  // Dashboard
  getDashboardMetrics: () => fetchJson(`${API_BASE}/reports/dashboard`),

  // Medicines
  getMedicines: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`${API_BASE}/medicines${query ? `?${query}` : ''}`);
  },
  getMedicineById: (id) => fetchJson(`${API_BASE}/medicines/${id}`),
  addMedicine: (data) => fetchJson(`${API_BASE}/medicines`, { method: 'POST', body: JSON.stringify(data) }),
  updateMedicine: (id, data) => fetchJson(`${API_BASE}/medicines/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMedicine: (id) => fetchJson(`${API_BASE}/medicines/${id}`, { method: 'DELETE' }),

  // Inventory & Stock
  addStock: (data) => fetchJson(`${API_BASE}/inventory/stock-in`, { method: 'POST', body: JSON.stringify(data) }),
  getBatches: () => fetchJson(`${API_BASE}/inventory/batches`),

  // Sales
  getSales: () => fetchJson(`${API_BASE}/sales`),
  createSale: (saleData) => fetchJson(`${API_BASE}/sales`, { method: 'POST', body: JSON.stringify(saleData) }),

  // Purchases
  getPurchases: () => fetchJson(`${API_BASE}/purchases`),

  // Suppliers
  getSuppliers: () => fetchJson(`${API_BASE}/suppliers`),
  addSupplier: (data) => fetchJson(`${API_BASE}/suppliers`, { method: 'POST', body: JSON.stringify(data) }),
  updateSupplier: (id, data) => fetchJson(`${API_BASE}/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSupplier: (id) => fetchJson(`${API_BASE}/suppliers/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => fetchJson(`${API_BASE}/categories`),
  addCategory: (data) => fetchJson(`${API_BASE}/categories`, { method: 'POST', body: JSON.stringify(data) }),

  // Customer Orders
  getOrders: () => fetchJson(`${API_BASE}/orders`),
  createOrder: (orderData) => fetchJson(`${API_BASE}/orders`, { method: 'POST', body: JSON.stringify(orderData) }),
  updateOrderStatus: (id, status, prescriptionVerified) =>
    fetchJson(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, prescriptionVerified }),
    }),

  // Health Information
  getHealthInfo: () => fetchJson(`${API_BASE}/health-info`),

  // Reports
  getSalesReport: () => fetchJson(`${API_BASE}/reports/sales`),
  getInventoryReport: () => fetchJson(`${API_BASE}/reports/inventory`),
  getProfitReport: () => fetchJson(`${API_BASE}/reports/profit`),

  // Audit Logs & Notifications
  getAuditLogs: () => fetchJson(`${API_BASE}/audit-logs`),
  getNotifications: () => fetchJson(`${API_BASE}/notifications`),
  markNotificationRead: (id) => fetchJson(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => fetchJson(`${API_BASE}/notifications/read-all`, { method: 'PUT' }),
};
