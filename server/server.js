import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { dataStore } from './db/dataStore.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), message: 'PharmaCare Pharmacy Server Running' });
});

// --- DASHBOARD ANALYTICS ---
app.get('/api/reports/dashboard', (req, res) => {
  try {
    const metrics = dataStore.getDashboardMetrics();
    const salesChart = dataStore.getSalesChartData();
    const inventoryChart = dataStore.getInventoryStatusChartData();
    const categoryChart = dataStore.getCategoryChartData();

    res.json({
      success: true,
      metrics,
      charts: {
        sales: salesChart,
        inventory: inventoryChart,
        category: categoryChart
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- MEDICINES ---
app.get('/api/medicines', (req, res) => {
  try {
    const { category, type, search, status } = req.query;
    let medicines = dataStore.getMedicines();

    if (category) {
      medicines = medicines.filter(m => m.category.toLowerCase() === category.toLowerCase());
    }
    if (type) {
      medicines = medicines.filter(m => m.medicineType.toLowerCase() === type.toLowerCase());
    }
    if (status) {
      medicines = medicines.filter(m => m.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      medicines = medicines.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.brandName.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: medicines.length, data: medicines });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/medicines/:id', (req, res) => {
  try {
    const medicine = dataStore.getMedicineById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    res.json({ success: true, data: medicine });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/medicines', (req, res) => {
  try {
    const created = dataStore.addMedicine(req.body);
    res.status(201).json({ success: true, data: created, message: 'Medicine created successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/medicines/:id', (req, res) => {
  try {
    const updated = dataStore.updateMedicine(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    res.json({ success: true, data: updated, message: 'Medicine updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/medicines/:id', (req, res) => {
  try {
    const deleted = dataStore.deleteMedicine(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    res.json({ success: true, message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- INVENTORY & STOCK MANAGEMENT ---
app.post('/api/inventory/stock-in', (req, res) => {
  try {
    const updatedMedicine = dataStore.addStock(req.body);
    res.status(200).json({ success: true, data: updatedMedicine, message: 'Stock received and inventory updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/inventory/batches', (req, res) => {
  try {
    res.json({ success: true, count: dataStore.batches.length, data: dataStore.batches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SALES ---
app.get('/api/sales', (req, res) => {
  try {
    res.json({ success: true, count: dataStore.sales.length, data: dataStore.sales });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/sales', (req, res) => {
  try {
    const sale = dataStore.createSale(req.body);
    res.status(201).json({ success: true, data: sale, message: 'Sale completed successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- PURCHASES ---
app.get('/api/purchases', (req, res) => {
  try {
    res.json({ success: true, count: dataStore.purchases.length, data: dataStore.purchases });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SUPPLIERS ---
app.get('/api/suppliers', (req, res) => {
  try {
    res.json({ success: true, count: dataStore.suppliers.length, data: dataStore.suppliers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/suppliers', (req, res) => {
  try {
    const created = dataStore.addSupplier(req.body);
    res.status(201).json({ success: true, data: created, message: 'Supplier added successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/suppliers/:id', (req, res) => {
  try {
    const updated = dataStore.updateSupplier(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Supplier not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/suppliers/:id', (req, res) => {
  try {
    const deleted = dataStore.deleteSupplier(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Supplier not found' });
    res.json({ success: true, message: 'Supplier deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- CATEGORIES ---
app.get('/api/categories', (req, res) => {
  try {
    res.json({ success: true, count: dataStore.categories.length, data: dataStore.categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/categories', (req, res) => {
  try {
    const created = dataStore.addCategory(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- CUSTOMER ORDERS ---
app.get('/api/orders', (req, res) => {
  try {
    res.json({ success: true, count: dataStore.orders.length, data: dataStore.orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const order = dataStore.createOrder(req.body);
    res.status(201).json({ success: true, data: order, message: 'Order placed successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status, prescriptionVerified } = req.body;
    const updated = dataStore.updateOrderStatus(req.params.id, status, prescriptionVerified);
    if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: updated, message: 'Order status updated' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- HEALTH INFO / SYMPTOMS ---
app.get('/api/health-info', (req, res) => {
  try {
    res.json({ success: true, count: dataStore.healthTopics.length, data: dataStore.healthTopics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- REPORTS ---
app.get('/api/reports/sales', (req, res) => {
  try {
    const sales = dataStore.sales;
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    res.json({ success: true, summary: { totalSales, totalRevenue }, sales });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/reports/inventory', (req, res) => {
  try {
    const medicines = dataStore.getMedicines();
    const valuation = medicines.reduce((acc, m) => acc + (m.currentStock * m.purchasePrice), 0);
    const retailValuation = medicines.reduce((acc, m) => acc + (m.currentStock * m.sellingPrice), 0);

    res.json({
      success: true,
      summary: {
        totalItems: medicines.length,
        totalUnits: medicines.reduce((acc, m) => acc + m.currentStock, 0),
        purchaseValuation: valuation,
        retailValuation,
        potentialProfit: retailValuation - valuation
      },
      medicines
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/reports/profit', (req, res) => {
  try {
    const sales = dataStore.sales;
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);

    // Approximate cost of goods sold
    let totalCostOfGoods = 0;
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const med = dataStore.getMedicineById(item.medicineId);
        const costPrice = med ? med.purchasePrice : item.unitPrice * 0.4;
        totalCostOfGoods += (item.quantity * costPrice);
      });
    });

    const grossProfit = totalRevenue - totalCostOfGoods;
    const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      summary: {
        totalRevenue,
        totalCostOfGoods,
        grossProfit,
        profitMargin: `${profitMargin}%`
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- AUDIT LOGS & NOTIFICATIONS ---
app.get('/api/audit-logs', (req, res) => {
  try {
    res.json({ success: true, count: dataStore.auditLogs.length, data: dataStore.auditLogs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/notifications', (req, res) => {
  try {
    res.json({ success: true, count: dataStore.notifications.length, data: dataStore.notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/notifications/:id/read', (req, res) => {
  try {
    dataStore.markNotificationAsRead(req.params.id);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/notifications/read-all', (req, res) => {
  try {
    dataStore.markAllNotificationsRead();
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`PharmaCare API Server running on port ${PORT}`);
});
