"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Filter, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ProductModal from '@/components/ProductModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProductsPage() {
  const { products, categories, fetchDataMaster } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchDataMaster(); 
  }, []);

  const getImageUrl = (path) => {
      if (!path) return null;
      return path.startsWith('http') ? path : `${API_URL}${path}`;
  };

  const formatRp = (num) => "Rp " + (Number(num) || 0).toLocaleString('id-ID');

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Habis', color: 'bg-red-500 text-white' };
    if (stock < 5) return { label: 'Menipis', color: 'bg-orange-500 text-white' };
    return { label: `Stok: ${stock}`, color: 'bg-white/20 backdrop-blur-md text-white border border-white/20' };
  }

  const getSpanClass = (size) => {
    switch(size) {
        case 'large': return 'md:col-span-2 md:row-span-2';
        case 'tall': return 'md:col-span-1 md:row-span-2';
        case 'wide': return 'md:col-span-2 md:row-span-1';
        default: return 'md:col-span-1 md:row-span-1';
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryName = product.category ? product.category.name : 'Uncategorized';
      const matchesCategory = selectedCategory === 'Semua' || categoryName === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };


  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product, e) => {
    e.stopPropagation();
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm('Yakin ingin menonaktifkan/menghapus produk ini?')) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) fetchDataMaster();
            else alert("Gagal menghapus produk");
        } catch (error) {
            console.error(error);
        }
    }
  };

  const handleSaveProduct = async (formData) => {
    const token = localStorage.getItem('token');
    const data = new FormData();
    
    data.append('name', formData.name);
    data.append('sku', formData.sku);
    data.append('price', formData.price);
    data.append('costPrice', formData.costPrice);
    data.append('stock', formData.stock);
    data.append('categoryId', formData.categoryId);
    data.append('isActive', formData.status === 'active'); 
    data.append('displayType', formData.displayType);

    if (formData.imageFile) {
        data.append('image', formData.imageFile);
    }

    try {
        const url = editingProduct 
            ? `${API_URL}/api/products/${editingProduct.id}` 
            : `${API_URL}/api/products`;
        
        const method = editingProduct ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Gagal menyimpan");
        }
        
        fetchDataMaster(); 
        setIsModalOpen(false);
    } catch (error) {
        alert("Error: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-1 gap-2 max-w-2xl">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Cari menu / SKU..." 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                />
            </div>
            <div className="relative">
                <select 
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                    className="h-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:border-orange-500 cursor-pointer appearance-none pr-8"
                >
                    <option value="Semua">Semua</option>
                    {categories.map((cat, idx) => (
                         cat.id !== 0 && <option key={cat.id || idx} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
        </div>

        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm transition-colors whitespace-nowrap">
            <Plus size={18} /> Tambah Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
        
        {currentPage === 1 && !searchQuery && selectedCategory === 'Semua' && (
            <div onClick={handleAdd} className="md:col-span-1 md:row-span-1 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all cursor-pointer bg-gray-50/50 group">
                <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Plus size={24} /></div>
                <span className="font-medium text-sm">Tambah Menu Baru</span>
            </div>
        )}

        {currentProducts.map((item) => (
          <div 
            key={item.id} 
            className={`group relative rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer ${getSpanClass(item.displayType || 'normal')}`}
            onClick={() => handleEdit(item, { stopPropagation: () => {} })} 
          >
            <div className="absolute inset-0">
                {item.imageUrl ? (
                    <img src={getImageUrl(item.imageUrl)} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={48} /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => handleEdit(item, e)} className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-orange-500 shadow-sm hover:bg-white transition-colors"><Edit size={16} /></button>
                <button onClick={(e) => handleDelete(item.id, e)} className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 shadow-sm hover:bg-white transition-colors"><Trash2 size={16} /></button>
            </div>

            <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20 uppercase tracking-wider">
                    {item.category ? item.category.name : 'Umum'}
                </span>
                {!item.isActive && (
                    <span className="px-2 py-1 bg-gray-500/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg">Non-Aktif</span>
                )}
            </div>

            <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                <div className="flex justify-between items-end">
                    <div className="flex-1 min-w-0 mr-4">
                        <h3 className="font-bold text-lg leading-tight mb-1 truncate">{item.name}</h3>
                        <p className="text-gray-300 text-xs font-mono mb-2 opacity-80">{item.sku}</p>
                        <p className="font-bold text-xl text-orange-400">{formatRp(item.price)}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${getStockStatus(item.stock).color}`}>
                        {getStockStatus(item.stock).label}
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-100">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`p-2 rounded-xl border transition-colors ${currentPage === 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-orange-500'}`}><ChevronLeft size={20} /></button>
            <span className="text-sm font-medium text-gray-600">Halaman <span className="text-orange-500 font-bold">{currentPage}</span> dari {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`p-2 rounded-xl border transition-colors ${currentPage === totalPages ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-orange-500'}`}><ChevronRight size={20} /></button>
        </div>
      )}

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct}
        initialData={editingProduct}
        categories={categories} 
      />
    </div>
  );
}