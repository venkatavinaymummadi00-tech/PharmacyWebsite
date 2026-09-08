import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const PharmacyContext = createContext();

export const PharmacyProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [medRes, supRes, catRes, notifRes, logRes, dashRes] = await Promise.all([
        api.getMedicines(),
        api.getSuppliers(),
        api.getCategories(),
        api.getNotifications(),
        api.getAuditLogs(),
        api.getDashboardMetrics()
      ]);

      setMedicines(medRes.data || []);
      setSuppliers(supRes.data || []);
      setCategories(catRes.data || []);
      setNotifications(notifRes.data || []);
      setAuditLogs(logRes.data || []);
      setMetrics(dashRes.metrics || null);
      setCharts(dashRes.charts || null);
    } catch (err) {
      console.error('Failed to load pharmacy data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const refreshData = () => {
    fetchAllData();
  };

  const addMedicine = async (medData) => {
    const res = await api.addMedicine(medData);
    await fetchAllData();
    return res;
  };

  const updateMedicine = async (id, medData) => {
    const res = await api.updateMedicine(id, medData);
    await fetchAllData();
    return res;
  };

  const deleteMedicine = async (id) => {
    const res = await api.deleteMedicine(id);
    await fetchAllData();
    return res;
  };

  const addStock = async (stockData) => {
    const res = await api.addStock(stockData);
    await fetchAllData();
    return res;
  };

  const completeSale = async (saleData) => {
    const res = await api.createSale(saleData);
    await fetchAllData();
    return res;
  };

  const addSupplier = async (supData) => {
    const res = await api.addSupplier(supData);
    await fetchAllData();
    return res;
  };

  const updateSupplier = async (id, supData) => {
    const res = await api.updateSupplier(id, supData);
    await fetchAllData();
    return res;
  };

  const deleteSupplier = async (id) => {
    const res = await api.deleteSupplier(id);
    await fetchAllData();
    return res;
  };

  const addCategory = async (catData) => {
    const res = await api.addCategory(catData);
    await fetchAllData();
    return res;
  };

  const markNotificationRead = async (id) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <PharmacyContext.Provider
      value={{
        medicines,
        suppliers,
        categories,
        notifications,
        auditLogs,
        metrics,
        charts,
        loading,
        error,
        refreshData,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addStock,
        completeSale,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addCategory,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) throw new Error('usePharmacy must be used within PharmacyProvider');
  return context;
};
