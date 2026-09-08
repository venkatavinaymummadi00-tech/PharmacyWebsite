import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  PackageCheck,
  Printer,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('Sales');
  const [salesReport, setSalesReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [profitReport, setProfitReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [sRes, iRes, pRes] = await Promise.all([
          api.getSalesReport(),
          api.getInventoryReport(),
          api.getProfitReport()
        ]);
        setSalesReport(sRes);
        setInventoryReport(iRes);
        setProfitReport(pRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Generating pharmacy financial reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-pharmacy-600" /> Pharmacy Financial & Inventory Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit sales revenues, inventory valuations, supplier purchase costs, and gross profit margin analytics.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-bold text-xs rounded-xl shadow-md transition-all print:hidden"
        >
          <Printer className="w-4 h-4" /> Print / Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-xl text-xs font-bold print:hidden">
        {['Sales', 'Inventory', 'Profit Analysis'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === tab ? 'bg-white text-pharmacy-700 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab} Report
          </button>
        ))}
      </div>

      {/* SALES REPORT TAB */}
      {activeTab === 'Sales' && salesReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Sales Completed"
              value={salesReport.summary.totalSales}
              subtext="Billing counter transactions"
              icon={FileText}
              color="emerald"
            />
            <StatCard
              title="Gross Sales Revenue"
              value={`₹${salesReport.summary.totalRevenue.toFixed(2)}`}
              subtext="Total billed income"
              icon={DollarSign}
              color="sky"
            />
            <StatCard
              title="Average Bill Value"
              value={`₹${(salesReport.summary.totalSales > 0 ? salesReport.summary.totalRevenue / salesReport.summary.totalSales : 0).toFixed(2)}`}
              subtext="Average order total"
              icon={TrendingUp}
              color="indigo"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-800">
              Itemized Sales Transaction Register
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4 text-center">Items Count</th>
                    <th className="py-3 px-4 text-right">Tax Paid</th>
                    <th className="py-3 px-4 text-right">Invoice Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesReport.sales.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-pharmacy-700">{s.invoiceNumber}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{new Date(s.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{s.customerName}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold">{s.items.length}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">₹{s.taxAmount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">₹{s.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INVENTORY REPORT TAB */}
      {activeTab === 'Inventory' && inventoryReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard
              title="Total Medicines Catalog"
              value={inventoryReport.summary.totalItems}
              subtext="SKUs recorded"
              icon={PackageCheck}
              color="emerald"
            />
            <StatCard
              title="Total Physical Stock Units"
              value={inventoryReport.summary.totalUnits.toLocaleString()}
              subtext="Inventory count"
              icon={Layers}
              color="teal"
            />
            <StatCard
              title="Purchase Cost Valuation"
              value={`₹${inventoryReport.summary.purchaseValuation.toFixed(2)}`}
              subtext="Asset acquisition cost"
              icon={DollarSign}
              color="indigo"
            />
            <StatCard
              title="Retail Selling Valuation"
              value={`₹${inventoryReport.summary.retailValuation.toFixed(2)}`}
              subtext={`Potential profit: ₹${inventoryReport.summary.potentialProfit.toFixed(2)}`}
              icon={TrendingUp}
              color="sky"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-800">
              Valuation by Medicine Item
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Medicine Name</th>
                    <th className="py-3 px-4 text-center">Stock Units</th>
                    <th className="py-3 px-4 text-right">Unit Purchase</th>
                    <th className="py-3 px-4 text-right">Unit Selling</th>
                    <th className="py-3 px-4 text-right">Total Inventory Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryReport.medicines.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">{m.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{m.name}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">{m.currentStock}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">₹{m.purchasePrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">₹{m.sellingPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-pharmacy-700">
                        ₹{(m.currentStock * m.sellingPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PROFIT REPORT TAB */}
      {activeTab === 'Profit Analysis' && profitReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard
              title="Total Billed Revenue"
              value={`₹${profitReport.summary.totalRevenue.toFixed(2)}`}
              subtext="Income from sales"
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              title="Est. Cost of Goods Sold"
              value={`₹${profitReport.summary.totalCostOfGoods.toFixed(2)}`}
              subtext="Direct medicine cost"
              icon={Layers}
              color="amber"
            />
            <StatCard
              title="Gross Profit"
              value={`₹${profitReport.summary.grossProfit.toFixed(2)}`}
              subtext="Net income before overhead"
              icon={TrendingUp}
              color="teal"
            />
            <StatCard
              title="Gross Profit Margin"
              value={profitReport.summary.profitMargin}
              subtext="Profit percentage margin"
              icon={BarChart3}
              color="sky"
            />
          </div>
        </div>
      )}
    </div>
  );
};
