import { Search, Plus, MoreHorizontal, ArrowUpRight, Package, TrendingUp } from 'lucide-react';

// Data Mock dengan Size Bento (large, tall, wide, normal)
const CATEGORIES = [
  {
    id: 1,
    name: 'Atasan (Tops)',
    count: 142,
    stock: 1250,
    revenue: '+24%',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=60',
    size: 'large' // Kotak Besar (2x2)
  },
  {
    id: 2,
    name: 'Bawahan (Bottoms)',
    count: 85,
    stock: 430,
    revenue: '+12%',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=60',
    size: 'tall' // Kotak Tinggi (1x2)
  },
  {
    id: 3,
    name: 'Outerwear',
    count: 45,
    stock: 120,
    revenue: '+8%',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&auto=format&fit=crop&q=60',
    size: 'normal' // Kotak Biasa (1x1)
  },
  {
    id: 4,
    name: 'Sepatu (Shoes)',
    count: 64,
    stock: 210,
    revenue: '+18%',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=60',
    size: 'wide' // Kotak Lebar (2x1)
  },
  {
    id: 5,
    name: 'Aksesoris',
    count: 120,
    stock: 850,
    revenue: '+5%',
    image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=600&auto=format&fit=crop&q=60',
    size: 'normal'
  },
  {
    id: 6,
    name: 'Tas & Dompet',
    count: 32,
    stock: 150,
    revenue: '+11%',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=60',
    size: 'normal'
  }
];

export default function CategoriesPage() {
  // Helper untuk menentukan kelas grid berdasarkan ukuran bento
  const getSpanClass = (size) => {
    switch(size) {
        case 'large': return 'md:col-span-2 md:row-span-2';
        case 'tall': return 'md:col-span-1 md:row-span-2';
        case 'wide': return 'md:col-span-2 md:row-span-1';
        default: return 'md:col-span-1 md:row-span-1';
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Kategori</h2>
           <p className="text-gray-400 text-sm">Kelola pengelompokan produk.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Cari..." 
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-sm"
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm shadow-orange-200 transition-colors whitespace-nowrap">
                <Plus size={18} /> <span className="hidden sm:inline">Tambah</span>
            </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      {/* auto-rows-[180px] memastikan tinggi baris konsisten */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-4">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.id} 
            className={`group relative rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer ${getSpanClass(cat.size)}`}
          >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 bg-gray-200">
                <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            {/* Dark Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

            {/* Content Container */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between">
                
                {/* Top Section: Badges & Action */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-2">
                        {/* Revenue Badge (Glassmorphism) */}
                        <span className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-medium border border-white/10">
                            <TrendingUp size={12} className="text-green-400" /> {cat.revenue}
                        </span>
                        {/* Stock Badge (Glassmorphism) */}
                        <span className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-medium border border-white/10">
                            <Package size={12} /> {cat.stock}
                        </span>
                    </div>
                    
                    <button className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-colors">
                        <MoreHorizontal size={18} />
                    </button>
                </div>

                {/* Bottom Section: Title & Count */}
                <div>
                    <h3 className="text-white font-bold text-xl mb-1 group-hover:translate-x-1 transition-transform">
                        {cat.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <span>{cat.count} Produk Active</span>
                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-orange-400" />
                    </div>
                </div>
            </div>
          </div>
        ))}

        {/* 'Add New' Placeholder Card in Bento Grid */}
        <div className="md:col-span-1 md:row-span-1 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all cursor-pointer bg-gray-50/50">
            <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                <Plus size={24} />
            </div>
            <span className="font-medium text-sm">Buat Kategori Baru</span>
        </div>
      </div>
    </div>
  );
}