import {
  initialCategories,
  initialSuppliers,
  initialMedicines,
  initialBatches,
  initialSales,
  initialPurchases,
  initialOrders,
  initialHealthTopics,
  initialAuditLogs,
  initialNotifications
} from './seedData.js';

class DataStore {
  constructor() {
    this.categories = [...initialCategories];
    this.suppliers = [...initialSuppliers];
    this.medicines = [...initialMedicines];
    this.batches = [...initialBatches];
    this.sales = [...initialSales];
    this.purchases = [...initialPurchases];
    this.orders = [...initialOrders];
    this.healthTopics = [...initialHealthTopics];
    this.auditLogs = [...initialAuditLogs];
    this.notifications = [...initialNotifications];
  }

  // --- MEDICINES ---
  getMedicines() {
    return this.medicines.map(med => this.enrichMedicine(med));
  }

  getMedicineById(id) {
    const med = this.medicines.find(m => m.id === id);
    return med ? this.enrichMedicine(med) : null;
  }

  enrichMedicine(med) {
    const medBatches = this.batches.filter(b => b.medicineId === med.id);
    const totalBatchStock = medBatches.reduce((acc, b) => acc + (b.quantity || 0), 0);
    
    // Status calculation
    let status = 'Available';
    if (totalBatchStock === 0) {
      status = 'Out of Stock';
    } else if (totalBatchStock <= med.minStockLevel) {
      status = 'Low Stock';
    }

    return {
      ...med,
      currentStock: totalBatchStock,
      status,
      batches: medBatches
    };
  }

  addMedicine(data) {
    const id = `MED-${Date.now().toString().slice(-4)}`;
    const newMedicine = {
      id,
      ...data,
      currentStock: Number(data.currentStock || 0),
      minStockLevel: Number(data.minStockLevel || 10),
      maxStockLevel: Number(data.maxStockLevel || 200),
      purchasePrice: Number(data.purchasePrice || 0),
      sellingPrice: Number(data.sellingPrice || 0),
      status: Number(data.currentStock) === 0 ? 'Out of Stock' : (Number(data.currentStock) <= Number(data.minStockLevel) ? 'Low Stock' : 'Available')
    };

    this.medicines.unshift(newMedicine);

    // Initial batch if batch number provided
    if (data.batchNumber) {
      const batchId = `BAT-${Date.now().toString().slice(-4)}`;
      this.batches.unshift({
        id: batchId,
        medicineId: id,
        medicineName: newMedicine.name,
        batchNumber: data.batchNumber,
        quantity: Number(data.currentStock || 0),
        mfgDate: data.mfgDate || new Date().toISOString().slice(0, 10),
        expiryDate: data.expiryDate || '2027-12-31',
        purchasePrice: Number(data.purchasePrice || 0),
        supplierId: data.supplierId || '',
        supplierName: data.supplierName || 'Default Supplier',
        invoiceNumber: data.invoiceNumber || 'INIT-STOCK'
      });
    }

    this.addAuditLog('Admin', 'Medicine Created', newMedicine.name, `Created new medicine ${newMedicine.name} (${id})`, 'N/A', `${newMedicine.currentStock} units`);
    this.checkStockAlerts(newMedicine);
    return this.getMedicineById(id);
  }

  updateMedicine(id, data) {
    const index = this.medicines.findIndex(m => m.id === id);
    if (index === -1) return null;

    const oldMed = this.medicines[index];
    this.medicines[index] = {
      ...oldMed,
      ...data,
      purchasePrice: Number(data.purchasePrice ?? oldMed.purchasePrice),
      sellingPrice: Number(data.sellingPrice ?? oldMed.sellingPrice),
      minStockLevel: Number(data.minStockLevel ?? oldMed.minStockLevel),
      maxStockLevel: Number(data.maxStockLevel ?? oldMed.maxStockLevel),
    };

    this.addAuditLog('Admin', 'Medicine Updated', oldMed.name, `Updated details for ${oldMed.name}`, JSON.stringify(oldMed), JSON.stringify(this.medicines[index]));
    return this.getMedicineById(id);
  }

  deleteMedicine(id) {
    const med = this.medicines.find(m => m.id === id);
    if (!med) return false;
    this.medicines = this.medicines.filter(m => m.id !== id);
    this.batches = this.batches.filter(b => b.medicineId !== id);
    this.addAuditLog('Admin', 'Medicine Deleted', med.name, `Deleted medicine ${med.name} (${id})`, med.name, 'Deleted');
    return true;
  }

  // --- BATCH & STOCK MANAGEMENT ---
  addStock(stockData) {
    const { medicineId, supplierId, batchNumber, quantity, purchasePrice, mfgDate, expiryDate, invoiceNumber, receivedBy } = stockData;
    const med = this.medicines.find(m => m.id === medicineId);
    if (!med) throw new Error('Medicine not found');

    const qty = Number(quantity);
    const existingBatchIndex = this.batches.findIndex(b => b.medicineId === medicineId && b.batchNumber === batchNumber);

    if (existingBatchIndex !== -1) {
      this.batches[existingBatchIndex].quantity += qty;
      if (expiryDate) this.batches[existingBatchIndex].expiryDate = expiryDate;
    } else {
      const supplierObj = this.suppliers.find(s => s.id === supplierId);
      this.batches.unshift({
        id: `BAT-${Date.now().toString().slice(-4)}`,
        medicineId,
        medicineName: med.name,
        batchNumber,
        quantity: qty,
        mfgDate: mfgDate || new Date().toISOString().slice(0, 10),
        expiryDate: expiryDate || '2027-12-31',
        purchasePrice: Number(purchasePrice || med.purchasePrice),
        supplierId,
        supplierName: supplierObj ? supplierObj.companyName : med.supplierName,
        invoiceNumber
      });
    }

    // Create Purchase log
    const supplierObj = this.suppliers.find(s => s.id === supplierId);
    const purchaseId = `PUR-${Date.now().toString().slice(-5)}`;
    this.purchases.unshift({
      id: purchaseId,
      invoiceNumber: invoiceNumber || `INV-SUP-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      supplierId,
      supplierName: supplierObj ? supplierObj.companyName : med.supplierName,
      items: [{
        medicineId,
        medicineName: med.name,
        batchNumber,
        quantity: qty,
        purchasePrice: Number(purchasePrice || med.purchasePrice),
        total: qty * Number(purchasePrice || med.purchasePrice)
      }],
      totalAmount: qty * Number(purchasePrice || med.purchasePrice),
      status: 'Received',
      receivedBy: receivedBy || 'Pharmacist Staff'
    });

    if (supplierObj) {
      supplierObj.totalPurchases += (qty * Number(purchasePrice || med.purchasePrice));
      supplierObj.lastPurchaseDate = new Date().toISOString().slice(0, 10);
    }

    this.addAuditLog('Staff', 'Stock Added', med.name, `Added ${qty} units under batch ${batchNumber}.`, `Stock before`, `Added ${qty} units`);
    this.addNotification('Stock Received', `Received ${qty} units of ${med.name} (Batch: ${batchNumber})`, 'info', '/inventory');

    return this.getMedicineById(medicineId);
  }

  // --- POS SALES (FEFO Logic) ---
  createSale(saleData) {
    const { customerName, customerPhone, items, discountAmount = 0, taxAmount = 0, paymentMethod = 'Cash', soldBy = 'Pharmacist' } = saleData;

    let subtotal = 0;
    const processedItems = [];

    // Verify stock availability & deduct via FEFO (First Expiry, First Out)
    for (const item of items) {
      const med = this.medicines.find(m => m.id === item.medicineId);
      if (!med) throw new Error(`Medicine ${item.medicineId} not found`);

      const qtyNeeded = Number(item.quantity);
      
      // Get all non-expired batches sorted by earliest expiry
      const todayStr = new Date().toISOString().slice(0, 10);
      const validBatches = this.batches
        .filter(b => b.medicineId === med.id && b.quantity > 0 && b.expiryDate >= todayStr)
        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

      const totalAvailable = validBatches.reduce((acc, b) => acc + b.quantity, 0);
      if (totalAvailable < qtyNeeded) {
        throw new Error(`Insufficient stock for ${med.name}. Available non-expired stock: ${totalAvailable}`);
      }

      // Deduct stock across batches using FEFO
      let remainingToDeduct = qtyNeeded;
      let usedBatchNo = item.batchNumber || '';

      for (const batch of validBatches) {
        if (remainingToDeduct <= 0) break;
        
        if (!usedBatchNo) usedBatchNo = batch.batchNumber;

        if (batch.quantity >= remainingToDeduct) {
          batch.quantity -= remainingToDeduct;
          remainingToDeduct = 0;
        } else {
          remainingToDeduct -= batch.quantity;
          batch.quantity = 0;
        }
      }

      const itemTotal = qtyNeeded * (item.unitPrice || med.sellingPrice);
      subtotal += itemTotal;

      processedItems.push({
        medicineId: med.id,
        medicineName: med.name,
        batchNumber: usedBatchNo || 'FEFO-Auto',
        quantity: qtyNeeded,
        unitPrice: item.unitPrice || med.sellingPrice,
        totalPrice: itemTotal
      });

      // Stock notification check
      this.checkStockAlerts(med);
    }

    const totalAmount = subtotal - Number(discountAmount) + Number(taxAmount);
    const saleId = `SALE-${Date.now().toString().slice(-5)}`;
    const invoiceNumber = `INV-2026-${Date.now().toString().slice(-4)}`;

    const newSale = {
      id: saleId,
      invoiceNumber,
      date: new Date().toISOString(),
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || 'N/A',
      items: processedItems,
      subtotal,
      discountAmount: Number(discountAmount),
      taxAmount: Number(taxAmount),
      totalAmount,
      paymentMethod,
      soldBy,
      status: 'Completed'
    };

    this.sales.unshift(newSale);

    this.addAuditLog(soldBy, 'Sale Completed', invoiceNumber, `Completed sale of ₹${totalAmount.toFixed(2)} to ${newSale.customerName}`, 'Pending', 'Completed');
    return newSale;
  }

  // --- ORDERS & PRESCRIPTION VERIFICATION ---
  createOrder(orderData) {
    const orderId = `ORD-${Date.now().toString().slice(-4)}`;
    const newOrder = {
      id: orderId,
      customerName: orderData.customerName,
      email: orderData.email,
      phone: orderData.phone,
      deliveryAddress: orderData.deliveryAddress,
      date: new Date().toISOString(),
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      prescriptionUploaded: orderData.prescriptionUploaded || false,
      prescriptionFileUrl: orderData.prescriptionFileUrl || '',
      prescriptionVerified: false,
      status: orderData.prescriptionUploaded ? 'Prescription Verification' : 'Pending',
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery'
    };

    this.orders.unshift(newOrder);

    if (newOrder.prescriptionUploaded) {
      this.addNotification('Prescription Verification', `New Rx order ${orderId} uploaded by ${newOrder.customerName}`, 'warning', '/orders');
    }

    this.addAuditLog('Customer', 'Order Placed', orderId, `Customer ${newOrder.customerName} placed order ${orderId}`, 'Cart', 'Order Placed');
    return newOrder;
  }

  updateOrderStatus(orderId, status, prescriptionVerified = undefined) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return null;

    const oldStatus = order.status;
    order.status = status;
    if (prescriptionVerified !== undefined) {
      order.prescriptionVerified = prescriptionVerified;
    }

    this.addAuditLog('Pharmacist', 'Order Status Update', orderId, `Updated status for ${orderId} to ${status}`, oldStatus, status);
    return order;
  }

  // --- SUPPLIERS ---
  addSupplier(data) {
    const id = `SUP-${Date.now().toString().slice(-3)}`;
    const newSup = {
      id,
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      phone: data.phone,
      email: data.email,
      address: data.address,
      gstTaxId: data.gstTaxId || '',
      medicinesSupplied: data.medicinesSupplied || [],
      totalPurchases: 0,
      lastPurchaseDate: 'N/A'
    };
    this.suppliers.unshift(newSup);
    this.addAuditLog('Admin', 'Supplier Created', newSup.companyName, `Created supplier ${newSup.companyName}`, 'N/A', id);
    return newSup;
  }

  updateSupplier(id, data) {
    const index = this.suppliers.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.suppliers[index] = { ...this.suppliers[index], ...data };
    return this.suppliers[index];
  }

  deleteSupplier(id) {
    const sup = this.suppliers.find(s => s.id === id);
    if (!sup) return false;
    this.suppliers = this.suppliers.filter(s => s.id !== id);
    this.addAuditLog('Admin', 'Supplier Deleted', sup.companyName, `Deleted supplier ${sup.companyName}`, sup.companyName, 'Deleted');
    return true;
  }

  // --- CATEGORIES ---
  addCategory(data) {
    const id = `cat-${Date.now().toString().slice(-4)}`;
    const newCat = { id, name: data.name, description: data.description || '' };
    this.categories.unshift(newCat);
    return newCat;
  }

  // --- AUDIT LOGS & NOTIFICATIONS ---
  addAuditLog(user, action, entity, details, previousValue = 'N/A', newValue = 'N/A') {
    const log = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user,
      action,
      entity,
      date: new Date().toISOString(),
      details,
      previousValue,
      newValue
    };
    this.auditLogs.unshift(log);
  }

  addNotification(title, message, type = 'info', link = '') {
    const notif = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      link
    };
    this.notifications.unshift(notif);
  }

  markNotificationAsRead(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
  }

  markAllNotificationsRead() {
    this.notifications.forEach(n => n.read = true);
  }

  checkStockAlerts(med) {
    const enriched = this.getMedicineById(med.id);
    if (enriched.currentStock === 0) {
      this.addNotification('Out of Stock Warning', `${enriched.name} is completely out of stock!`, 'danger', '/inventory/out-of-stock');
    } else if (enriched.currentStock <= enriched.minStockLevel) {
      this.addNotification('Low Stock Warning', `${enriched.name} is running low (${enriched.currentStock} remaining).`, 'warning', '/inventory/low-stock');
    }
  }

  // --- DASHBOARD ANALYTICS ---
  getDashboardMetrics() {
    const enrichedMedicines = this.getMedicines();
    const totalMedicines = enrichedMedicines.length;
    const totalStockUnits = enrichedMedicines.reduce((acc, m) => acc + m.currentStock, 0);

    const todayStr = new Date().toISOString().slice(0, 10);

    // Today's sales
    const todaySalesList = this.sales.filter(s => s.date.startsWith(todayStr));
    const todaySalesCount = todaySalesList.length;
    const todayRevenue = todaySalesList.reduce((acc, s) => acc + s.totalAmount, 0);

    // Today's purchases
    const todayPurchasesList = this.purchases.filter(p => p.date.startsWith(todayStr));
    const todayPurchasesCost = todayPurchasesList.reduce((acc, p) => acc + p.totalAmount, 0);

    // Stock statuses
    const lowStockCount = enrichedMedicines.filter(m => m.status === 'Low Stock').length;
    const outOfStockCount = enrichedMedicines.filter(m => m.status === 'Out of Stock').length;

    // Expiry counts
    const now = new Date();
    const days30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    let expiredCount = 0;
    let expiringSoonCount = 0;

    this.batches.forEach(b => {
      if (b.expiryDate < todayStr) {
        expiredCount++;
      } else if (b.expiryDate <= days30) {
        expiringSoonCount++;
      }
    });

    return {
      totalMedicines,
      totalStockUnits,
      todayPurchasesCost,
      todaySalesCount,
      todayRevenue,
      lowStockCount,
      outOfStockCount,
      expiringSoonCount,
      expiredCount
    };
  }

  // Chart data generation
  getSalesChartData() {
    return [
      { name: 'Mon', sales: 450, revenue: 12000 },
      { name: 'Tue', sales: 620, revenue: 16500 },
      { name: 'Wed', sales: 380, revenue: 9800 },
      { name: 'Thu', sales: 740, revenue: 21000 },
      { name: 'Fri', sales: 890, revenue: 24500 },
      { name: 'Sat', sales: 1100, revenue: 31000 },
      { name: 'Sun', sales: 950, revenue: 27500 }
    ];
  }

  getInventoryStatusChartData() {
    const medicines = this.getMedicines();
    let available = 0, low = 0, out = 0;
    medicines.forEach(m => {
      if (m.status === 'Available') available++;
      else if (m.status === 'Low Stock') low++;
      else if (m.status === 'Out of Stock') out++;
    });

    return [
      { name: 'Available', value: available, color: '#10b981' },
      { name: 'Low Stock', value: low, color: '#f59e0b' },
      { name: 'Out of Stock', value: out, color: '#ef4444' },
    ];
  }

  getCategoryChartData() {
    const medicines = this.getMedicines();
    const catMap = {};
    medicines.forEach(m => {
      catMap[m.category] = (catMap[m.category] || 0) + 1;
    });

    return Object.keys(catMap).map(cat => ({
      name: cat,
      count: catMap[cat]
    }));
  }
}

export const dataStore = new DataStore();
