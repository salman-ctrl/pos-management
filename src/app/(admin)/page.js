import { DollarSign, ShoppingCart, TrendingUp, AlertTriangle, Utensils } from 'lucide-react';
import StatCard from '@/components/StatCard';
import SalesChart from '@/components/SalesChart';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Restoran</h2>
        <p className="text-gray-500 text-sm">Overview operasional & penjualan hari ini.</p>
      </div>

      {/* 1. Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Penjualan" 
          value="Rp 8.240.000" 
          subtitle="vs hari kemarin" 
          icon={DollarSign}
          trend="up"
          trendValue="+15.3%"
        />
        <StatCard 
          title="Pesanan Selesai" 
          value="62" 
          subtitle="Meja dilayani" 
          icon={Utensils}
          trend="up"
          trendValue="+8"
        />
         <StatCard 
          title="Gross Profit" 
          value="Rp 3.150.000" 
          subtitle="Food Cost ~38%" 
          icon={TrendingUp}
          trend="up"
          trendValue="Aman"
        />
        <StatCard 
          title="Stok Menipis" 
          value="3 Item" 
          subtitle="Bahan baku kritis" 
          icon={AlertTriangle}
          trend="down"
          trendValue="Warning"
          isAlert={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Main Chart Area */}
        <div className="card-base p-6 lg:col-span-2 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-gray-800">Analitik Pendapatan</h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-orange-500">
              <option>7 Hari Terakhir</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <SalesChart />
          </div>
        </div>

        {/* 3. Right Sidebar: Low Stock & Top Products */}
        <div className="space-y-6">
          {/* Low Stock Alert (Kitchen Theme) */}
          <div className="card-base p-5">
            <div className="flex items-center gap-2 mb-4 text-red-500 font-medium">
              <AlertTriangle size={18} />
              <h3>Stok Dapur Menipis</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Susu Fresh Milk', stock: 2, unit: 'Ltr' },
                { name: 'Biji Kopi Arabica', stock: 0.5, unit: 'Kg' },
                { name: 'Ayam Fillet', stock: 0, unit: 'Pack' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-red-400 text-xs">Sisa: {item.stock} {item.unit}</p>
                  </div>
                  <button className="text-xs bg-white text-red-500 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50">
                    Restock
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling (Food Theme) */}
          <div className="card-base p-5">
             <h3 className="font-semibold text-gray-800 mb-4">Menu Terlaris</h3>
             <div className="space-y-4">
               {[
                 { 
                   name: 'Nasi Goreng Spesial', 
                   sold: 124, 
                   img: 'https://ik.imagekit.io/dcjlghyytp1/https://sayurbox-blog-stage.s3.amazonaws.com/uploads/2020/07/fried-2509089_1920.jpg?tr=f-auto' 
                 },
                 { 
                   name: 'Es Kopi Susu Aren', 
                   sold: 98, 
                   img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100&auto=format&fit=crop&q=60' 
                 },
                 { 
                   name: 'Steak Sapi Lada Hitam', 
                   sold: 85, 
                   img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=100&auto=format&fit=crop&q=60' 
                 },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     {/* Image Thumbnail */}
                     <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 relative">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-[9px] font-bold px-1 rounded-tl-md">
                            #{idx + 1}
                        </div>
                     </div>
                     <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{item.name}</span>
                   </div>
                   <span className="text-sm text-gray-500">{item.sold} porsi</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
      
      {/* 4. Recent Transactions Table */}
      <div className="card-base overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Transaksi Terakhir</h3>
          <button className="text-orange-500 text-sm font-medium hover:underline">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Server/Kasir</th>
                <th className="px-6 py-4 font-medium">Tipe</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: '#ORD-224', staff: 'Budi Santoso', type: 'Dine-In (Meja 4)', total: 'Rp 450.000', status: 'PAID' },
                { id: '#ORD-223', staff: 'Siti Aminah', type: 'Takeaway', total: 'Rp 1.200.000', status: 'PAID' },
                { id: '#ORD-222', staff: 'Budi Santoso', type: 'Dine-In (Meja 7)', total: 'Rp 85.000', status: 'KITCHEN' },
                { id: '#ORD-221', staff: 'Siti Aminah', type: 'Dine-In (Meja 2)', total: 'Rp 210.000', status: 'PAID' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{row.id}</td>
                  <td className="px-6 py-4 text-gray-500">{row.staff}</td>
                  <td className="px-6 py-4 text-gray-500">{row.type}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{row.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === 'PAID' 
                        ? 'bg-green-100 text-green-600' 
                        : row.status === 'KITCHEN'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}