"use client";

import { useEffect, useState } from 'react';
import { 
  DollarSign, ShoppingCart, TrendingUp, AlertTriangle, 
  Utensils, Calendar, ArrowRight, Loader2, Package, Eye
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import SalesChart from '@/components/SalesChart';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const statsRes = await fetch(`${API_URL}/api/reports/dashboard?period=week`, { headers });
        const statsJson = await statsRes.json();

        const trxRes = await fetch(`${API_URL}/api/transactions?limit=5`, { headers });
        const trxJson = await trxRes.json();

        if (statsJson.success) setStats(statsJson.data);
        if (trxJson.success) setRecentTransactions(trxJson.data);

      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatRp = (num) => "Rp " + (Number(num) || 0).toLocaleString('id-ID');
  
  const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `${API_URL}${path}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400 bg-gray-50">
        <Loader2 className="animate-spin mr-2" size={32} />
        <span className="font-medium">Memuat Dashboard...</span>
      </div>
    );
  }

  if (!stats) return <div className="p-8 text-center text-gray-500">Gagal memuat data dashboard.</div>;

  const { summary, chart, topProducts, lowStockProducts } = stats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Restoran</h2>
          <p className="text-gray-500 text-sm mt-1">Ringkasan performa bisnis hari ini.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 shadow-sm">
           <Calendar size={14} />
           {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Penjualan" 
          value={formatRp(summary.todayRevenue)} 
          subtitle="Pendapatan hari ini" 
          icon={DollarSign}
          trend="up"
          trendValue="Realtime"
        />
        <StatCard 
          title="Pesanan Selesai" 
          value={summary.todayCount} 
          subtitle="Transaksi berhasil" 
          icon={Utensils}
          trend="up"
          trendValue="Orders"
        />
         <StatCard 
          title="Gross Profit" 
          value={formatRp(summary.grossProfit)} 
          subtitle="Margin (Jual - Modal)" 
          icon={TrendingUp}
          trend="up"
          trendValue="Profit"
        />
        <StatCard 
          title="Stok Menipis" 
          value={`${summary.lowStockCount} Item`} 
          subtitle="Perlu restock segera" 
          icon={AlertTriangle}
          trend="down"
          trendValue="Warning"
          isAlert={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="card-base p-6 lg:col-span-2 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="font-bold text-lg text-gray-800">Analitik Pendapatan</h3>
                <p className="text-xs text-gray-400">Tren penjualan 7 hari terakhir</p>
            </div>
            <Link href="/reports" className="text-xs text-orange-500 font-bold hover:underline bg-orange-50 px-3 py-1.5 rounded-lg">
                Lihat Laporan Lengkap
            </Link>
          </div>
          <div className="flex-1 w-full min-h-[300px]"> 
            <SalesChart data={chart} />
          </div>
        </div>

        <div className="space-y-6">
          
          <div className="card-base p-5">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 text-red-600 font-bold">
                    <AlertTriangle size={18} />
                    <h3>Stok Kritis</h3>
                 </div>
                 <Link href="/stock" className="text-[10px] text-gray-400 hover:text-gray-600">Lihat Gudang</Link>
            </div>
            
            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                  <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
                      <p className="text-green-600 font-bold text-sm">Stok Aman 👍</p>
                      <p className="text-xs text-green-500">Tidak ada barang menipis</p>
                  </div>
              ) : (
                  lowStockProducts.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                          {item.imageUrl ? (
                             <img src={getImageUrl(item.imageUrl)} className="w-8 h-8 rounded-lg object-cover bg-white"/>
                          ) : (
                             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-red-300"><Package size={14}/></div>
                          )}
                          <div className="min-w-0">
                             <p className="font-bold text-gray-800 text-xs truncate">{item.name}</p>
                             <p className="text-red-500 text-[10px] font-medium">Sisa: {item.stock} unit</p>
                          </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="card-base p-5">
             <h3 className="font-bold text-gray-800 mb-4">Menu Terlaris</h3>
             <div className="space-y-4">
               {topProducts.length === 0 ? (
                   <p className="text-center text-gray-400 text-xs py-4">Belum ada data penjualan.</p>
               ) : (
                   topProducts.map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between">
                       <div className="flex items-center gap-3 min-w-0">
                         <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 relative">
                             {item.imageUrl ? (
                                <img src={getImageUrl(item.imageUrl)} alt={item.name} className="w-full h-full object-cover" /> 
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300"><Utensils size={14}/></div>
                             )}
                             <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-[8px] font-bold px-1 rounded-tl-md">
                                #{idx + 1}
                             </div>
                         </div>
                         <div className="min-w-0">
                             <p className="text-xs font-bold text-gray-700 truncate">{item.name}</p>
                             <p className="text-[10px] text-gray-400">{item.sold} terjual</p>
                         </div>
                       </div>
                     </div>
                   ))
               )}
             </div>
          </div>

        </div>
      </div>
      
      <div className="card-base overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">Transaksi Terakhir</h3>
          <Link href="/transactions" className="text-orange-500 text-sm font-bold hover:underline flex items-center gap-1">
             Lihat Semua <ArrowRight size={14}/>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Invoice</th>
                <th className="px-6 py-4 font-semibold">Waktu</th>
                <th className="px-6 py-4 font-semibold">Kasir</th>
                <th className="px-6 py-4 font-semibold">Metode</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.length === 0 ? (
                  <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-400">Belum ada transaksi hari ini.</td>
                  </tr>
              ) : (
                  recentTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800 font-mono text-xs">{trx.invoiceNumber}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(trx.createdAt)}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium">{trx.user?.name || '-'}</td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase border border-gray-200">
                                {trx.payments[0]?.paymentType || '-'}
                            </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                            {formatRp(trx.grandTotal)}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                trx.status === 'PAID' ? 'bg-green-50 text-green-600 border-green-100' : 
                                trx.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                'bg-red-50 text-red-600 border-red-100'
                            }`}>
                                {trx.status}
                            </span>
                        </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}