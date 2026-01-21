"use client";

import { useState } from 'react';
import { Calendar, Download, TrendingUp, DollarSign, ShoppingBag, CreditCard, ChevronDown, PieChart, BarChart3, Activity } from 'lucide-react';
import SalesChart from '@/components/SalesChart';
import StatCard from '@/components/StatCard';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('Jan 2026');

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Laporan & Analitik</h2>
          <p className="text-gray-400 text-sm">Insight performa bisnis secara real-time.</p>
        </div>
        
        <div className="flex gap-2">
           <div className="relative group">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
               <Calendar size={16} /> {dateRange} <ChevronDown size={14} />
             </button>
             {/* Dropdown Dummy */}
             <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-10">
                <div className="py-1">
                    {['Jan 2026', 'Dec 2025', 'Nov 2025'].map((m) => (
                        <button key={m} onClick={() => setDateRange(m)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500">
                            {m}
                        </button>
                    ))}
                </div>
             </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm shadow-orange-200 transition-colors text-sm font-medium">
             <Download size={16} /> Export
           </button>
        </div>
      </div>

      {/* Summary Stats (Top Bento Row) */}
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

      {/* Bento Layout Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
        
        {/* 1. Main Chart (Large Block - 2 Col) */}
        <div className="card-base p-6 lg:col-span-2 lg:row-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Activity size={20} className="text-orange-500" />
                Tren Penjualan Harian
             </h3>
             <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div> Revenue
                </span>
             </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <SalesChart />
          </div>
        </div>

        {/* 2. Top Products (Tall Block - 1 Col) */}
        <div className="card-base p-0 overflow-hidden lg:row-span-2 flex flex-col">
           <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 size={18} className="text-orange-500" />
                Produk Terlaris
             </h3>
             <button className="text-xs text-orange-500 font-medium hover:underline">Lihat Semua</button>
           </div>
           
           <div className="p-5 space-y-5 flex-1 overflow-y-auto max-h-[400px]">
             { [
  {
    name: "Nasi Goreng Spesial",
    sold: 320,
    revenue: "11.2jt",
    img: "https://ik.imagekit.io/dcjlghyytp1/https://sayurbox-blog-stage.s3.amazonaws.com/uploads/2020/07/fried-2509089_1920.jpg?tr=f-auto",
  },
  {
    name: "Es Kopi Susu Aren",
    sold: 540,
    revenue: "11.8jt",
    img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=100&q=60",
  },
  {
    name: "Ayam Bakar Madu",
    sold: 210,
    revenue: "8.8jt",
    img: "https://o-cdf.oramiland.com/unsafe/cnc-magazine.oramiland.com/parenting/original_images/3_Resep_Ayam_Bakar_Madu_-2.jpg",
  },
  {
    name: "Kentang Goreng",
    sold: 430,
    revenue: "7.7jt",
    img: "https://image.idntimes.com/post/20230712/tips-membuat-kentang-goreng-anti-lembek-dan-tetap-kriuk-resep-kentang-goreng-mcd-kentang-goreng-kfc-9cde86371d7fc78c91ae80a6ffab250e-2c28a950c10d937a546160e888ed397c.jpg",
  },
  {
    name: "Spaghetti Carbonara",
    sold: 190,
    revenue: "7.2jt",
    img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=100&q=60",
  },
].map((item, i) => (
               <div key={i} className="flex items-center justify-between group">
                 <div className="flex items-center gap-3">
                   <div className="relative">
                       <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                       <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                         {i + 1}
                       </span>
                   </div>
                   <div>
                     <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                     <p className="text-xs text-gray-400 font-medium">{item.sold} terjual</p>
                   </div>
                 </div>
                 <div className="text-right">
                    <span className="text-sm font-bold text-gray-700 block">Rp {item.revenue}</span>
                    <span className="text-[10px] text-green-500 font-medium">+12%</span>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* 3. Payment Methods (Wide Block - 2 Col) */}
        <div className="card-base p-6 lg:col-span-2">
           <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
             <PieChart size={20} className="text-orange-500" />
             Metode Pembayaran
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* QRIS */}
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="p-2 bg-white rounded-lg text-orange-600 shadow-sm">
                            <CreditCard size={20} />
                        </div>
                        <span className="text-xs font-bold text-orange-600 bg-white px-2 py-1 rounded-full">65%</span>
                    </div>
                    <p className="text-gray-500 text-xs font-medium relative z-10">QRIS / E-Wallet</p>
                    <p className="text-lg font-bold text-gray-800 relative z-10">Rp 29.3jt</p>
                    {/* Background Icon Decoration */}
                    <CreditCard className="absolute -bottom-4 -right-4 text-orange-200 opacity-20 w-24 h-24 transform -rotate-12" />
                </div>

                {/* Tunai */}
                <div className="p-4 rounded-2xl bg-green-50 border border-green-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="p-2 bg-white rounded-lg text-green-600 shadow-sm">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-white px-2 py-1 rounded-full">25%</span>
                    </div>
                    <p className="text-gray-500 text-xs font-medium relative z-10">Tunai (Cash)</p>
                    <p className="text-lg font-bold text-gray-800 relative z-10">Rp 11.3jt</p>
                    <DollarSign className="absolute -bottom-4 -right-4 text-green-200 opacity-20 w-24 h-24 transform -rotate-12" />
                </div>

                {/* Debit */}
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                            <CreditCard size={20} />
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded-full">10%</span>
                    </div>
                    <p className="text-gray-500 text-xs font-medium relative z-10">Kartu Debit</p>
                    <p className="text-lg font-bold text-gray-800 relative z-10">Rp 4.5jt</p>
                    <CreditCard className="absolute -bottom-4 -right-4 text-blue-200 opacity-20 w-24 h-24 transform -rotate-12" />
                </div>
           </div>
        </div>

        {/* 4. Sales Target (Small Block - 1 Col) */}
        <div className="card-base p-6 flex flex-col justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
            <h3 className="font-bold text-lg mb-1 relative z-10">Target Bulanan</h3>
            <p className="text-gray-400 text-xs mb-4 relative z-10">Deadline: 31 Jan 2026</p>
            
            <div className="relative z-10">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Progress</span>
                    <span className="font-bold text-orange-400">82%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-3">Kurang <span className="text-white font-bold">Rp 4.8jt</span> lagi untuk mencapai target.</p>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </div>

      </div>
    </div>
  );
}