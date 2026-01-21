"use client";

import { useState } from 'react';
import { Search, Plus, MoreHorizontal, ArrowUpRight, Package, TrendingUp, Utensils, Edit, Trash2, X, Save, UploadCloud, ImageIcon, LayoutGrid, CheckCircle } from 'lucide-react';

// Data Mock Awal
const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: 'Makanan Berat',
    count: 42,
    stock: 850,
    revenue: '+35%',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60',
    size: 'large'
  },
  {
    id: 2,
    name: 'Minuman',
    count: 38,
    stock: 1200,
    revenue: '+28%',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=60',
    size: 'tall'
  },
  {
    id: 3,
    name: 'Dessert & Bakery',
    count: 24,
    stock: 150,
    revenue: '+15%',
    image: 'https://png.pngtree.com/png-clipart/20240518/original/pngtree-bakery-shop-desserts-sweet-cakes-and-cookies-png-image_15121469.png',
    size: 'normal'
  },
  {
    id: 4,
    name: 'Coffee Shop',
    count: 18,
    stock: 450,
    revenue: '+42%',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60',
    size: 'wide'
  },
  {
    id: 5,
    name: 'Snack & Bites',
    count: 30,
    stock: 320,
    revenue: '+10%',
    image: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=600&auto=format&fit=crop&q=60',
    size: 'normal'
  },
  {
    id: 6,
    name: 'Paket Hemat',
    count: 8,
    stock: 50,
    revenue: '+20%',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=60',
    size: 'normal'
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State Form
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    count: '',
    stock: '',
    revenue: '',
    image: '',
    size: 'normal'
  });

  // --- Helpers & Logic ---

  const getSpanClass = (size) => {
    switch(size) {
        case 'large': return 'md:col-span-2 md:row-span-2';
        case 'tall': return 'md:col-span-1 md:row-span-2';
        case 'wide': return 'md:col-span-2 md:row-span-1';
        default: return 'md:col-span-1 md:row-span-1';
    }
  }

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- CRUD Handlers ---

  const handleAdd = () => {
    setIsEditing(false);
    setFormData({ 
      id: null, 
      name: '', 
      count: '0', 
      stock: '0', 
      revenue: '+0%', 
      image: '', 
      size: 'normal' 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (category, e) => {
    e.stopPropagation(); // Mencegah trigger click pada container
    setIsEditing(true);
    setFormData(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Hapus kategori ini beserta datanya?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const finalImage = formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60';

    if (isEditing) {
      setCategories(categories.map(c => c.id === formData.id ? { ...formData, image: finalImage } : c));
    } else {
      const newCat = { ...formData, id: Date.now(), image: finalImage };
      setCategories([newCat, ...categories]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Kategori Menu</h2>
           <p className="text-gray-400 text-sm">Kelola pengelompokan menu restoran.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Cari kategori..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-sm"
                />
            </div>
            <button 
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm shadow-orange-200 transition-colors whitespace-nowrap"
            >
                <Plus size={18} /> <span className="hidden sm:inline">Tambah</span>
            </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-4">
        
        {/* 'Add New' Placeholder - Show first */}
        <div 
            onClick={handleAdd}
            className="md:col-span-1 md:row-span-1 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all cursor-pointer bg-gray-50/50 group"
        >
            <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Plus size={24} />
            </div>
            <span className="font-medium text-sm">Buat Kategori Baru</span>
        </div>

        {filteredCategories.map((cat) => (
          <div 
            key={cat.id} 
            onClick={(e) => handleEdit(cat, e)}
            className={`group relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-100 hover:shadow-xl transition-all cursor-pointer ${getSpanClass(cat.size)}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
                {cat.image ? (
                    <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-200">
                        <ImageIcon className="text-gray-400" size={32} />
                    </div>
                )}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* Edit/Delete Buttons Overlay (Hidden by default, shown on hover) */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                 <button 
                    onClick={(e) => handleDelete(cat.id, e)}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-red-500/80 hover:text-white transition-colors"
                    title="Hapus"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                {/* Top Section */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-medium border border-white/10">
                            <TrendingUp size={10} className="text-green-400" /> {cat.revenue}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-medium border border-white/10">
                            <Package size={10} /> {cat.stock}
                        </span>
                    </div>
                </div>

                {/* Bottom Section */}
                <div>
                    <h3 className="text-white font-bold text-xl mb-1 group-hover:translate-x-1 transition-transform truncate">
                        {cat.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300 text-xs">
                        <Utensils size={12} className="text-orange-400" />
                        <span>{cat.count} Menu</span>
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-orange-400" />
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Modal Form --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">
                        {isEditing ? 'Edit Kategori' : 'Kategori Baru'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-5">
                    
                    {/* Image & Size Section */}
                    <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 flex-shrink-0 overflow-hidden relative">
                             {formData.image ? (
                                <img src={formData.image} className="w-full h-full object-cover" />
                             ) : (
                                <UploadCloud size={24} />
                             )}
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-700 block mb-1">URL Gambar</label>
                                <input 
                                    type="text" 
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-700 block mb-1 flex items-center gap-1">
                                    <LayoutGrid size={12}/> Tampilan Grid
                                </label>
                                <select 
                                    value={formData.size}
                                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-500 bg-white"
                                >
                                    <option value="normal">Normal (1x1)</option>
                                    <option value="wide">Lebar (2x1)</option>
                                    <option value="tall">Tinggi (1x2)</option>
                                    <option value="large">Besar (2x2)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Main Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                        <input 
                            required
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                            placeholder="Contoh: Aneka Sambal"
                        />
                    </div>

                    {/* Stats Mockup (Editable for demo) */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                             <label className="block text-xs font-medium text-gray-500 mb-1">Jml Menu</label>
                             <input 
                                type="number" 
                                value={formData.count}
                                onChange={(e) => setFormData({...formData, count: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                             />
                        </div>
                        <div>
                             <label className="block text-xs font-medium text-gray-500 mb-1">Total Stok</label>
                             <input 
                                type="number" 
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                             />
                        </div>
                        <div>
                             <label className="block text-xs font-medium text-gray-500 mb-1">Growth</label>
                             <input 
                                type="text" 
                                value={formData.revenue}
                                onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                                placeholder="+0%"
                             />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit"
                            className="px-5 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-200 font-medium flex items-center gap-2 transition-colors"
                        >
                            <Save size={18} />
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}