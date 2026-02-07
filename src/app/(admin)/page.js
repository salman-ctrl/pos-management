"use client";

import React, { useEffect, useState, lazy, Suspense } from 'react';
import {
  DollarSign, ShoppingCart, TrendingUp, AlertTriangle,
  Utensils, Calendar, ArrowRight, Package, Eye, Loader2
} from 'lucide-react';
import Link from 'next/link';

const SalesChart = lazy(() => import('../../components/SalesChart'));

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
      <div className="w-16 h-6 bg-gray-50 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-20 bg-gray-100 rounded-md"></div>
      <div className="h-8 w-28 bg-gray-200 rounded-md"></div>
    </div>
  </div>
);

const ChartSkeleton = () => (
  <div className="card-base p-6 lg:col-span-2 min-h-[400px] bg-white border border-gray-100 animate-pulse">
    <div className="flex justify-between mb-8">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-gray-200 rounded-md"></div>
        <div className="h-3 w-32 bg-gray-100 rounded-md"></div>
      </div>
    </div>
    <div className="w-full h-64 bg-gray-50 rounded-2xl"></div>
  </div>
);

const ListSkeleton = () => (
  <div className="card-base p-5 bg-white border border-gray-100 animate-pulse space-y-4">
    <div className="h-6 w-32 bg-gray-200 rounded-md mb-4"></div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-3 items-center">
        <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded-md"></div>
          <div className="h-2 w-20 bg-gray-50 rounded-md"></div>
        </div>
      </div>
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="card-base bg-white border border-gray-100 animate-pulse">
    <div className="p-6 h-16 bg-gray-50/50 border-b border-gray-100"></div>
    <div className="p-6 space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-10 w-full bg-gray-50 rounded-lg"></div>
      ))}
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [statsRes, trxRes] = await Promise.all([
          fetch(`${API_URL}/api/reports/dashboard?period=week`, { headers }),
          fetch(`${API_URL}/api/transactions?limit=5`, { headers })
        ]);

        const statsJson = await statsRes.json();
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
  const getImageUrl = (path) => path ? (path.startsWith('http') ? path : `${API_URL}${path}`) : null;
  const formatDate = (dateStr) => new Date(dateStr).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Toko</h2>
          <p className="text-gray-500 text-sm mt-1">Ringkasan performa bisnis hari ini.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 shadow-sm">
          <Calendar size={14} />
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading || !stats ? (
          <>
            <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
          </>
        ) : (
          <>
            <StatCardItem title="Total Penjualan" value={formatRp(stats.summary.todayRevenue)} subtitle="Pendapatan hari ini" icon={DollarSign} trend="up" trendValue="Realtime" color="orange" />
            <StatCardItem title="Pesanan Selesai" value={stats.summary.todayCount} subtitle="Transaksi berhasil" icon={Utensils} trend="up" trendValue="Orders" color="blue" />
            <StatCardItem title="Gross Profit" value={formatRp(stats.summary.grossProfit)} subtitle="Margin (Jual - Modal)" icon={TrendingUp} trend="up" trendValue="Profit" color="green" />
            <StatCardItem title="Stok Menipis" value={`${stats.summary.lowStockCount} Item`} subtitle="Perlu restock segera" icon={AlertTriangle} trend="down" trendValue="Warning" isAlert={true} color="red" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading || !stats ? <ChartSkeleton /> : (
            <div className="card-base p-6 bg-white h-full flex flex-col border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Analitik Pendapatan</h3>
                  <p className="text-xs text-gray-400">Tren penjualan 7 hari terakhir</p>
                </div>
                <Link href="/reports" className="text-xs text-orange-500 font-bold hover:underline bg-orange-50 px-3 py-1.5 rounded-lg">
                  Lihat Laporan
                </Link>
              </div>
              <div className="flex-1 w-full min-h-[300px]">
                <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>}>
                  <SalesChart data={stats.chart} />
                </Suspense>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {loading || !stats ? <ListSkeleton /> : (
            <div className="card-base p-5 bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-red-600 font-bold">
                  <AlertTriangle size={18} />
                  <h3>Stok Kritis</h3>
                </div>
                <Link href="/stock" className="text-[10px] text-gray-400 hover:text-gray-600">Lihat Gudang</Link>
              </div>
              <div className="space-y-3">
                {stats.lowStockProducts.length === 0 ? (
                  <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-green-600 font-bold text-sm">Stok Aman 👍</p>
                  </div>
                ) : (
                  stats.lowStockProducts.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-white overflow-hidden flex-shrink-0">
                          {item.imageUrl ? <img src={getImageUrl(item.imageUrl)} className="w-full h-full object-cover" /> : <Package size={14} className="m-2 text-red-200" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 text-xs truncate">{item.name}</p>
                          <p className="text-red-500 text-[10px] font-medium">Sisa: {item.stock}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {loading || !stats ? <ListSkeleton /> : (
            <div className="card-base p-5 bg-white border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Menu Terlaris</h3>
              <div className="space-y-4">
                {stats.topProducts.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative border border-gray-200">
                        {item.imageUrl ? <img src={getImageUrl(item.imageUrl)} className="w-full h-full object-cover" /> : <Utensils size={14} className="m-3 text-gray-300" />}
                        <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-[8px] font-bold px-1 rounded-tl-md">#{idx + 1}</div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-700 truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-400">{item.sold} terjual</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        {loading ? <TableSkeleton /> : (
          <div className="card-base bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">Transaksi Terakhir</h3>
              <Link href="/transactions" className="text-orange-500 text-sm font-bold hover:underline flex items-center gap-1">
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Invoice</th>
                    <th className="px-6 py-4">Waktu</th>
                    <th className="px-6 py-4">Kasir</th>
                    <th className="px-6 py-4">Metode</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800 font-mono text-xs">{trx.invoiceNumber}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(trx.createdAt)}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium text-xs">{trx.user?.name || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[9px] font-bold uppercase border border-gray-200">
                          {trx.payments?.[0]?.paymentType || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 text-xs">{formatRp(trx.grandTotal)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide border ${trx.status === 'PAID' ? 'bg-green-50 text-green-600 border-green-100' :
                          trx.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                            'bg-red-50 text-red-600 border-red-100'
                          }`}>
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCardItem({ title, value, subtitle, icon: Icon, trend, trendValue, isAlert, color }) {
  const colorMap = {
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className={`card-base p-6 bg-white border border-gray-200 rounded-2xl transition-all hover:shadow-md ${isAlert ? 'border-red-100 shadow-red-50' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color] || 'bg-gray-50 text-gray-600'}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trendValue}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className={`text-2xl font-black ${isAlert ? 'text-red-700' : 'text-gray-900'}`}>{value}</h3>
        <p className={`text-[10px] mt-1 font-medium ${isAlert ? 'text-red-500' : 'text-gray-400'}`}>{subtitle}</p>
      </div>
    </div>
  );
}