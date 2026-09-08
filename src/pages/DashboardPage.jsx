import React, { useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { StatCard } from '../components/ui/StatCard';
import {
  Pill,
  PackageCheck,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  AlertCircle,
  Clock,
  CalendarX,
  ShoppingCart,
  PlusCircle,
  PackagePlus,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { StockInModal } from '../components/stock/StockInModal';
import { MedicineFormModal } from '../components/medicine/MedicineFormModal';

export const DashboardPage = () => {
  const { medicines, metrics, charts, loading } = usePharmacy();
  const navigate = useNavigate();

  const [salesTimeframe, setSalesTimeframe] = useState('Weekly');
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [selectedRestockMed, setSelectedRestockMed] = useState(null);

  const outOfStockMedicines = medicines.filter(m => m.currentStock === 0);

  if (loading || !metrics) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium animate-pulse">
        Loading pharmacy analytics and inventory status...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-slate-900 via-pharmacy-900 to-teal-900 p-6 rounded-2xl text-white shadow-xl gap-4">
        <div>
          <span className="px-3 py-1 bg-pharmacy-500/20 text-teal-300 border border-teal-500/30 rounded-full font-bold text-xs uppercase tracking-wider">
            Pharmacy Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
            Real-Time Pharmacy Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Automated stock tracking, FEFO batch control, POS sales, and inventory analytics in Indian Rupees (₹).
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAddMedModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-xs transition-all border border-white/20"
          >
            <PlusCircle className="w-4 h-4 text-teal-300" /> Add Medicine
          </button>
          <button
            onClick={() => setIsStockInModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-xs transition-all border border-white/20"
          >
            <PackagePlus className="w-4 h-4 text-teal-300" /> Stock In
          </button>
          <button
            onClick={() => navigate('/sales/pos')}
            className="flex items-center gap-2 px-5 py-2.5 bg-pharmacy-500 hover:bg-pharmacy-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <ShoppingCart className="w-4 h-4" /> Open POS Sales
          </button>
        </div>
      </div>

      {/* Out of Stock Quick Action Dashboard Banner if any item is out of stock */}
      {outOfStockMedicines.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-rose-900 text-sm">
                Out of Stock Alert ({outOfStockMedicines.length} Medicines Unavailable)
              </span>
              <p className="text-slate-600 mt-0.5">
                The following medicines have 0 inventory units: <strong>{outOfStockMedicines.map(m => m.name).join(', ')}</strong>. Restock immediately to prevent lost sales.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/inventory/out-of-stock')}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            Manage Out of Stock <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 9 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Medicines"
          value={metrics.totalMedicines}
          subtext="Active SKU Catalog"
          icon={Pill}
          color="emerald"
          onClick={() => navigate('/inventory')}
        />
        <StatCard
          title="Total Stock Units"
          value={metrics.totalStockUnits.toLocaleString()}
          subtext="Physical Inventory Count"
          icon={PackageCheck}
          color="teal"
          onClick={() => navigate('/inventory')}
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${metrics.todayRevenue.toFixed(2)}`}
          subtext={`${metrics.todaySalesCount} sales transactions today`}
          icon={DollarSign}
          color="sky"
          onClick={() => navigate('/sales/history')}
        />
        <StatCard
          title="Today's Purchases"
          value={`₹${metrics.todayPurchasesCost.toFixed(2)}`}
          subtext="Incoming inventory cost"
          icon={TrendingUp}
          color="indigo"
          onClick={() => navigate('/purchases')}
        />
        <StatCard
          title="Low Stock Alert"
          value={metrics.lowStockCount}
          subtext="Stock <= Min Level"
          icon={AlertTriangle}
          color="amber"
          onClick={() => navigate('/inventory/low-stock')}
        />
        <StatCard
          title="Out of Stock"
          value={metrics.outOfStockCount}
          subtext="0 units available (Click to view)"
          icon={AlertCircle}
          color="rose"
          onClick={() => navigate('/inventory/out-of-stock')}
        />
        <StatCard
          title="Expiring Soon"
          value={metrics.expiringSoonCount}
          subtext="Within 30-90 days"
          icon={Clock}
          color="amber"
          onClick={() => navigate('/inventory/expiring-soon')}
        />
        <StatCard
          title="Expired Stock"
          value={metrics.expiredCount}
          subtext="Batch Expiry Reached"
          icon={CalendarX}
          color="rose"
          onClick={() => navigate('/inventory/expired')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">Pharmacy Sales Performance (₹)</h3>
              <p className="text-xs text-slate-500">Daily sales revenue and transaction volume trends</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSalesTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    salesTimeframe === tf ? 'bg-white text-pharmacy-700 font-bold shadow-xs' : 'text-slate-500'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.sales || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Stock Status Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Inventory Status Breakdown</h3>
            <p className="text-xs text-slate-500">Available vs Low Stock vs Out of Stock</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.inventory || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts?.inventory || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Available</span>
              <span className="font-bold text-emerald-700">{charts?.inventory[0]?.value || 0} SKUs</span>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Low Stock</span>
              <span className="font-bold text-amber-700">{charts?.inventory[1]?.value || 0} SKUs</span>
            </div>
            <div className="p-2 bg-rose-50 rounded-lg cursor-pointer hover:bg-rose-100 transition-colors" onClick={() => navigate('/inventory/out-of-stock')}>
              <span className="text-rose-600 font-bold block text-[10px]">Out of Stock</span>
              <span className="font-bold text-rose-700">{charts?.inventory[2]?.value || 0} SKUs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Category Distribution Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Category Distribution</h3>
            <p className="text-xs text-slate-500">Medicines count grouped by therapy and category</p>
          </div>
          <button
            onClick={() => navigate('/categories')}
            className="text-xs font-bold text-pharmacy-600 hover:text-pharmacy-800 flex items-center gap-1"
          >
            Manage Categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts?.category || []} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-25} textAnchor="end" />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modals */}
      <StockInModal isOpen={isStockInModalOpen || !!selectedRestockMed} onClose={() => { setIsStockInModalOpen(false); setSelectedRestockMed(null); }} selectedMedicine={selectedRestockMed} />
      <MedicineFormModal isOpen={isAddMedModalOpen} onClose={() => setIsAddMedModalOpen(false)} />
    </div>
  );
};
