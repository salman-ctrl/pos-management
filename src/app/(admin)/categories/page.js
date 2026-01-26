"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, TrendingUp, Package, Utensils, ArrowUpRight, ImageIcon, Trash2, Edit } from 'lucide-react';
import { useStore } from '../../../store/useStore'; 
import CategoryModal from '../../../components/CategoryModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CategoriesPage() {
  const { categories, fetchDataMaster } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchDataMaster();
  }, []);

  const getSpanClass = (size) => {
    switch(size) {
        case 'large': return 'md:col-span-2 md:row-span-2';
        case 'tall': return 'md:col-span-1 md:row-span-2';
        case 'wide': return 'md:col-span-2 md:row-span-1';
        default: return 'md:col-span-1 md:row-span-1';
    }
  }

  const getImageUrl = (path) => {
      if (!path) return null;
      return path.startsWith('http') ? path : `${API_URL}${path}`;
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category, e) => {
    e.stopPropagation();
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm('Hapus kategori ini? Data produk terkait mungkin akan error.')) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/products/categories/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) {
                fetchDataMaster();
            } else {
                alert("Gagal menghapus kategori");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan koneksi");
        }
    }
  };

  const handleSaveCategory = async (formData) => {
    const token = localStorage.getItem('token');
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('displayType', formData.size); 
    if (formData.imageFile) {
        data.append('image', formData.imageFile);
    }

    try {
        let url, method;

        if (editingCategory) {
            url = `${API_URL}/api/products/categories/${editingCategory.id}`;
            method = 'PUT'; 
        } else {
            url = `${API_URL}/api/products/categories`;
            method = 'POST';
        }

        const res = await fetch(url, {
            method: method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
        });
        
        if (!res.ok) throw new Error("Gagal menyimpan");
        
        fetchDataMaster(); 
        setIsModalOpen(false);

    } catch (error) {
        alert("Gagal menyimpan kategori: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-4">
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
            className={`group relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-100 hover:shadow-xl transition-all cursor-pointer ${getSpanClass(cat.displayType || 'normal')}`}
            onClick={(e) => handleEdit(cat, e)} 
          >
            <div className="absolute inset-0">
                {cat.imageUrl ? (
                    <img src={getImageUrl(cat.imageUrl)} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-200"><ImageIcon className="text-gray-400" size={32} /></div>
                )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                 <button onClick={(e) => handleDelete(cat.id, e)} className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-red-500/80 hover:text-white transition-colors" title="Hapus">
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-medium border border-white/10">
                            <TrendingUp size={10} className="text-green-400" /> {cat.growth || '0%'}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-medium border border-white/10">
                            <Package size={10} /> {cat.totalStock || 0}
                        </span>
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-bold text-xl mb-1 group-hover:translate-x-1 transition-transform truncate">
                        {cat.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300 text-xs">
                        <Utensils size={12} className="text-orange-400" />
                        <span>{cat.productCount || 0} Menu</span>
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-orange-400" />
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveCategory}
        initialData={editingCategory}
      />
    </div>
  );
}