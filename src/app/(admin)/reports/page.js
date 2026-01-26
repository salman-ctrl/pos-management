"use client";

import { useState, useEffect } from 'react';
import { 
  Calendar, Download, TrendingUp, DollarSign, ShoppingBag, 
  CreditCard, ChevronDown, PieChart, BarChart3, Activity, 
  Loader2, Package, ArrowUpRight
} from 'lucide-react';
import SalesChart from '@/components/SalesChart';
import StatCard from '@/components/StatCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ReportsPage() {
  const [period, setPeriod] = useState('month');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/reports/dashboard?period=${period}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        
        if (json.success) {
            setStats(json.data);
        }
      } catch (error) {
        console.error("Gagal load laporan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  const handleExport = async () => {
      setIsExporting(true);
      try {
          const token = localStorage.getItem('token');
          
          const today = new Date();
          let startDate = new Date();
          let endDate = new Date();

          if (period === 'week') {
              startDate.setDate(today.getDate() - 7);
          } else if (period === 'month') {
              startDate = new Date(today.getFullYear(), today.getMonth(), 1);
              endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          } else if (period === 'year') {
              startDate = new Date(today.getFullYear(), 0, 1);
              endDate = new Date(today.getFullYear(), 11, 31);
          }

          const startStr = startDate.toISOString().split('T')[0];
          const endStr = endDate.toISOString().split('T')[0];

          const res = await fetch(`${API_URL}/api/reports/export?startDate=${startStr}&endDate=${endStr}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!res.ok) throw new Error("Gagal export");

          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Laporan_Transaksi_${period}_${startStr}.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();

      } catch (error) {
          alert("Gagal mengunduh laporan: " + error.message);
      } finally {
          setIsExporting(false);
      }
  };

  const formatRp = (num) => "Rp " + (num || 0).toLocaleString('id-ID');
  const getImageUrl = (path) => path ? (path.startsWith('http') ? path : `${API_URL}${path}`) : null;

  const periodLabel = {
      'week': '7 Hari Terakhir',
      'month': 'Bulan Ini',
      'year': 'Tahun Ini'
  };

  if (loading && !stats) {
      return (
        <div className="flex h-96 items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mr-2" /> Memuat Data Laporan...
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Laporan & Analitik</h2>
          <p className="text-gray-400 text-sm">Insight performa bisnis secara real-time.</p>
        </div>
        
        <div className="flex gap-2">
           <div className="relative group">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium min-w-[160px] justify-between">
               <span className="flex items-center gap-2"><Calendar size={16} /> {periodLabel[period]}</span> 
               <ChevronDown size={14} />
             </button>
             
             <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-20 overflow-hidden">
                <div className="py-1">
                     <button onClick={() => setPeriod('week')} className={`block w-full text-left px-4 py-2.5 text-sm ${period === 'week' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}>
                        7 Hari Terakhir
                     </button>
                     <button onClick={() => setPeriod('month')} className={`block w-full text-left px-4 py-2.5 text-sm ${period === 'month' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}>
                        Bulan Ini
                     </button>
                     <button onClick={() => setPeriod('year')} className={`block w-full text-left px-4 py-2.5 text-sm ${period === 'year' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}>
                        Tahun Ini
                     </button>
                </div>
             </div>
           </div>

           <button 
             onClick={handleExport}
             disabled={isExporting}
             className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm shadow-orange-200 transition-colors text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
           >
             {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
             Export CSV
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Pendapatan" 
          value={formatRp(stats?.summary.todayRevenue)} 
          subtitle="Dalam periode ini" 
          icon={DollarSign} 
          trend="up" 
          trendValue="Net" 
        />
        <StatCard 
          title="Laba Kotor" 
          value={formatRp(stats?.summary.grossProfit)} 
          subtitle="Profit (Jual - Modal)" 
          icon={TrendingUp} 
          trend="up" 
          trendValue="Profit" 
        />
        <StatCard 
          title="Transaksi Selesai" 
          value={`${stats?.summary.todayCount} Order`} 
          subtitle="Total struk keluar" 
          icon={ShoppingBag} 
          trend="up" 
          trendValue="Volume" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
        
        <div className="card-base p-6 lg:col-span-2 lg:row-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Activity size={20} className="text-orange-500" />
                Tren Penjualan ({periodLabel[period]})
              </h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div> Revenue
                </span>
              </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <SalesChart data={stats?.chart} />
          </div>
        </div>

        <div className="card-base p-0 overflow-hidden lg:row-span-2 flex flex-col">
           <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <BarChart3 size={18} className="text-orange-500" />
               Produk Terlaris
             </h3>
           </div>
           
           <div className="p-5 space-y-5 flex-1 overflow-y-auto max-h-[400px]">
             {stats?.topProducts.length === 0 ? (
                 <div className="text-center text-gray-400 py-10 text-sm">Belum ada data penjualan.</div>
             ) : (
                 stats?.topProducts.map((item, i) => (
                   <div key={i} className="flex items-center justify-between group">
                     <div className="flex items-center gap-3">
                       <div className="relative">
                           {item.imageUrl ? (
                               <img src={getImageUrl(item.imageUrl)} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                           ) : (
                               <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"><Package size={16}/></div>
                           )}
                           <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                             {i + 1}
                           </span>
                       </div>
                       <div>
                         <p className="text-sm font-bold text-gray-800 line-clamp-1 w-32">{item.name}</p>
                         <p className="text-xs text-gray-400 font-medium">{item.sold} terjual</p>
                       </div>
                     </div>
                     <div className="text-right">
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Top {i+1}</span>
                     </div>
                   </div>
                 ))
             )}
           </div>
        </div>

        <div className="card-base p-6 lg:col-span-2">
           <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
             <PieChart size={20} className="text-orange-500" />
             Metode Pembayaran (Estimasi)
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                            <CreditCard size={20} />
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded-full">Digital</span>
                    </div>
                    <p className="text-gray-500 text-xs font-medium relative z-10">QRIS / E-Wallet</p>
                    <p className="text-lg font-bold text-gray-800 relative z-10">Midtrans</p>
                    <CreditCard className="absolute -bottom-4 -right-4 text-blue-200 opacity-20 w-24 h-24 transform -rotate-12" />
                </div>

                <div className="p-4 rounded-2xl bg-green-50 border border-green-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="p-2 bg-white rounded-lg text-green-600 shadow-sm">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-white px-2 py-1 rounded-full">Manual</span>
                    </div>
                    <p className="text-gray-500 text-xs font-medium relative z-10">Tunai (Cash)</p>
                    <p className="text-lg font-bold text-gray-800 relative z-10">Kasir</p>
                    <DollarSign className="absolute -bottom-4 -right-4 text-green-200 opacity-20 w-24 h-24 transform -rotate-12" />
                </div>
           </div>
        </div>

        <div className="card-base p-6 flex flex-col justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
            <h3 className="font-bold text-lg mb-1 relative z-10">Status Sistem</h3>
            <p className="text-gray-400 text-xs mb-4 relative z-10">Database & Server</p>
            
            <div className="relative z-10 flex items-center gap-3">
               <div className="p-2 bg-green-500/20 rounded-full">
                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
               </div>
               <div>
                   <p className="font-bold text-sm">Online</p>
                   <p className="text-[10px] text-gray-400">Backend v1.0.0 Ready</p>
               </div>
            </div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </div>

      </div>
    </div>
  );
}