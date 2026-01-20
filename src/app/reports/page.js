import { Calendar, Download, TrendingUp, DollarSign, ShoppingBag, CreditCard } from 'lucide-react';
import SalesChart from '@/components/SalesChart'; // Reuse Chart Component
import StatCard from '@/components/StatCard'; // Reuse StatCard Component

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Laporan Penjualan</h2>
          <p className="text-gray-400 text-sm">Analisis performa bisnis Anda.</p>
        </div>
        
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
             <Calendar size={16} /> Jan 2026
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm transition-colors text-sm font-medium">
             <Download size={16} /> Export Excel
           </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Pendapatan" 
          value="Rp 45.200.000" 
          subtitle="Bulan ini" 
          icon={DollarSign} 
          trend="up" 
          trendValue="+8.2%" 
        />
        <StatCard 
          title="Laba Bersih" 
          value="Rp 18.500.000" 
          subtitle="Margin 41%" 
          icon={TrendingUp} 
          trend="up" 
          trendValue="+12%" 
        />
        <StatCard 
          title="Item Terjual" 
          value="1,240 Pcs" 
          subtitle="Total produk keluar" 
          icon={ShoppingBag} 
          trend="down" 
          trendValue="-2%" 
          isAlert={true} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="card-base p-6 lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-6">Tren Penjualan Harian</h3>
          <div className="h-80">
            <SalesChart />
          </div>
        </div>

        {/* Top Products & Payment Methods */}
        <div className="space-y-6">
           {/* Top Products */}
           <div className="card-base p-6">
             <h3 className="font-bold text-gray-800 mb-4">Produk Terlaris</h3>
             <div className="space-y-4">
               {[
                 { name: 'Kopi Susu Gula Aren', sold: 450, revenue: '8.1jt' },
                 { name: 'Croissant Butter', sold: 210, revenue: '5.2jt' },
                 { name: 'Ice Lychee Tea', sold: 180, revenue: '3.6jt' },
                 { name: 'Dimsum Ayam', sold: 150, revenue: '3.0jt' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                   <div className="flex items-center gap-3">
                     <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">
                       {i + 1}
                     </span>
                     <div>
                       <p className="text-sm font-medium text-gray-800">{item.name}</p>
                       <p className="text-xs text-gray-400">{item.sold} terjual</p>
                     </div>
                   </div>
                   <span className="text-sm font-semibold text-gray-700">Rp {item.revenue}</span>
                 </div>
               ))}
             </div>
           </div>

           {/* Payment Methods */}
           <div className="card-base p-6">
             <h3 className="font-bold text-gray-800 mb-4">Metode Pembayaran</h3>
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard size={16} /> QRIS
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 w-[65%]"></div>
                    </div>
                    <span className="text-xs font-medium">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} /> Tunai
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[25%]"></div>
                    </div>
                    <span className="text-xs font-medium">25%</span>
                  </div>
                </div>
                 <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard size={16} /> Debit
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[10%]"></div>
                    </div>
                    <span className="text-xs font-medium">10%</span>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}