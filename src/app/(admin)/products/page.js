"use client";

import { useState } from 'react';
import { Search, Filter, Plus, Package, Edit, Trash2, AlertTriangle, X, UploadCloud, Save, ImageIcon, LayoutGrid, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';

// Data Awal Dummy (Tema Fashion dengan Bento Layout)
// Update: Menambahkan cost_price (Harga Modal) sesuai ERD
const INITIAL_PRODUCTS = [
  { id: 1, name: 'Kaos Polos Cotton Combed 30s - Hitam', category: 'Atasan', price: 85000, costPrice: 45000, stock: 120, status: 'active', sku: 'TS-BLK-001', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=60', size: 'large' },
  { id: 2, name: 'Kemeja Flanel Kotak Vintage', category: 'Atasan', price: 185000, costPrice: 95000, stock: 4, status: 'active', sku: 'SRT-FLN-002', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60', size: 'tall' },
  { id: 3, name: 'Celana Jeans Slim Fit Navy', category: 'Bawahan', price: 325000, costPrice: 180000, stock: 24, status: 'active', sku: 'PNT-JNS-003', image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 4, name: 'Jaket Denim Oversized', category: 'Outerwear', price: 450000, costPrice: 250000, stock: 2, status: 'active', sku: 'JKT-DNM-004', image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&auto=format&fit=crop&q=60', size: 'wide' },
  { id: 5, name: 'Sneakers Putih Casual', category: 'Sepatu', price: 299000, costPrice: 150000, stock: 0, status: 'inactive', sku: 'SHS-WHT-005', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 6, name: 'Topi Baseball New York', category: 'Aksesoris', price: 75000, costPrice: 35000, stock: 50, status: 'active', sku: 'ACC-CAP-006', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 7, name: 'Hoodie Oversized Grey', category: 'Outerwear', price: 250000, costPrice: 130000, stock: 15, status: 'active', sku: 'HDD-GRY-007', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 8, name: 'Rok Plisket Mocca', category: 'Bawahan', price: 125000, costPrice: 65000, stock: 30, status: 'active', sku: 'SKT-PLC-008', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop&q=60', size: 'tall' },
  { id: 9, name: 'Kacamata Hitam Retro', category: 'Aksesoris', price: 150000, costPrice: 40000, stock: 8, status: 'active', sku: 'GLS-RET-009', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 10, name: 'Tas Selempang Kulit', category: 'Aksesoris', price: 350000, costPrice: 175000, stock: 12, status: 'active', sku: 'BAG-LTH-010', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=60', size: 'wide' },
  { id: 11, name: 'Blazer Formal Hitam', category: 'Outerwear', price: 550000, costPrice: 300000, stock: 5, status: 'active', sku: 'BLZ-BLK-011', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=60', size: 'large' },
  { id: 12, name: 'Sandal Kulit Pria', category: 'Sepatu', price: 180000, costPrice: 90000, stock: 20, status: 'active', sku: 'SDL-LTH-012', image: 'https://images.unsplash.com/photo-1603487742131-4160d6986ba6?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 13, name: 'Kaos Striped Navy', category: 'Atasan', price: 95000, costPrice: 45000, stock: 45, status: 'active', sku: 'TS-STR-013', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 14, name: 'Celana Chino Cream', category: 'Bawahan', price: 210000, costPrice: 110000, stock: 18, status: 'active', sku: 'PNT-CHN-014', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=60', size: 'normal' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const itemsPerPage = 10;

  // State untuk Form Data
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    sku: '',
    category: 'Atasan',
    price: '',
    costPrice: '', // Added: Harga Modal
    stock: '',
    status: 'active',
    image: '',
    size: 'normal'
  });

  // --- Filtering & Pagination Logic ---
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- Logic CRUD ---

  const handleAdd = () => {
    setIsEditing(false);
    setFormData({ 
      id: null, 
      name: '', 
      sku: '', 
      category: 'Atasan', 
      price: '', 
      costPrice: '',
      stock: '', 
      status: 'active', 
      image: '',
      size: 'normal'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product, e) => {
    e.stopPropagation();
    setIsEditing(true);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Yakin ingin menghapus produk ini?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    const finalImage = formData.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60';
    
    if (isEditing) {
      setProducts(products.map(p => (p.id === formData.id ? { 
        ...formData, 
        price: Number(formData.price), 
        costPrice: Number(formData.costPrice),
        stock: Number(formData.stock),
        image: finalImage
      } : p)));
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(),
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        stock: Number(formData.stock),
        image: finalImage
      };
      setProducts([newProduct, ...products]);
    }
    setIsModalOpen(false);
  };

  // --- Helper Functions ---

  const getSpanClass = (size) => {
    switch(size) {
        case 'large': return 'md:col-span-2 md:row-span-2';
        case 'tall': return 'md:col-span-1 md:row-span-2';
        case 'wide': return 'md:col-span-2 md:row-span-1';
        default: return 'md:col-span-1 md:row-span-1';
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Habis', color: 'bg-red-500 text-white' };
    if (stock < 5) return { label: 'Menipis', color: 'bg-orange-500 text-white' };
    return { label: `Stok: ${stock}`, color: 'bg-white/20 backdrop-blur-md text-white border border-white/20' };
  }

  return (
    <div className="space-y-6">
      {/* --- Header & Actions --- */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Search & Filter Group */}
        <div className="flex flex-1 gap-2 max-w-2xl">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Cari produk fashion..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
            />
            </div>
            {/* Category Filter Dropdown */}
            <div className="relative">
                <select 
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                    className="h-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:border-orange-500 cursor-pointer appearance-none pr-8"
                >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Atasan">Atasan</option>
                    <option value="Bawahan">Bawahan</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Sepatu">Sepatu</option>
                    <option value="Aksesoris">Aksesoris</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
        </div>

        <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm transition-colors whitespace-nowrap"
        >
            <Plus size={18} /> Tambah Produk
        </button>
      </div>

      {/* --- Bento Grid List --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
        
        {/* 'Add New' Placeholder - Show on page 1 only */}
        {currentPage === 1 && !searchQuery && selectedCategory === 'Semua' && (
            <div 
                onClick={handleAdd}
                className="md:col-span-1 md:row-span-1 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all cursor-pointer bg-gray-50/50 group"
            >
                <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Plus size={24} />
                </div>
                <span className="font-medium text-sm">Tambah Produk Baru</span>
            </div>
        )}

        {currentProducts.map((item) => (
          <div 
            key={item.id} 
            className={`group relative rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer ${getSpanClass(item.size)}`}
            onClick={() => handleEdit(item, { stopPropagation: () => {} })} 
          >
            {/* Background Image */}
            <div className="absolute inset-0">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                        <ImageIcon size={48} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={(e) => handleEdit(item, e)}
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-orange-500 shadow-sm hover:bg-white transition-colors"
                >
                    <Edit size={16} />
                </button>
                <button 
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 shadow-sm hover:bg-white transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Tags */}
            <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20 uppercase tracking-wider">
                    {item.category}
                </span>
                {item.status === 'inactive' && (
                    <span className="px-2 py-1 bg-gray-500/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg">
                        Non-Aktif
                    </span>
                )}
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                <div className="flex justify-between items-end">
                    <div className="flex-1 min-w-0 mr-4">
                        <h3 className="font-bold text-lg leading-tight mb-1 truncate">{item.name}</h3>
                        <p className="text-gray-300 text-xs font-mono mb-2 opacity-80">{item.sku}</p>
                        <p className="font-bold text-xl text-orange-400">
                            Rp {item.price.toLocaleString('id-ID')}
                        </p>
                    </div>
                    
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${getStockStatus(item.stock).color}`}>
                        {getStockStatus(item.stock).label}
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Pagination Controls --- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-100">
            <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl border transition-colors ${currentPage === 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-orange-500'}`}
            >
                <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm font-medium text-gray-600">
                Halaman <span className="text-orange-500 font-bold">{currentPage}</span> dari {totalPages}
            </span>

            <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-xl border transition-colors ${currentPage === totalPages ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-orange-500'}`}
            >
                <ChevronRight size={20} />
            </button>
        </div>
      )}

      {/* --- Modal CRUD Form --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">
                {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Side: Image Upload & Bento Options */}
                <div className="w-full md:w-1/3 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Foto Produk</label>
                  
                  {/* Image Preview Box */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-colors bg-gray-50 overflow-hidden relative">
                    {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center">
                            <UploadCloud size={24} className="mb-2" />
                            <span className="text-[10px] text-center px-4">Preview</span>
                        </div>
                    )}
                  </div>

                  {/* Input URL Gambar */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">URL Gambar</label>
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                        <ImageIcon size={14} className="text-gray-400"/>
                        <input 
                            type="text" 
                            className="w-full text-xs bg-transparent outline-none text-gray-600 truncate"
                            placeholder="https://..."
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                        />
                    </div>
                  </div>

                  {/* Card Size Selector (Bento Feature) */}
                  <div>
                    <label className="text-xs text-gray-500 mb-2 block flex items-center gap-1">
                        <LayoutGrid size={12} /> Tampilan Kartu
                    </label>
                    <select 
                        value={formData.size} 
                        onChange={(e) => setFormData({...formData, size: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-orange-500 outline-none"
                    >
                        <option value="normal">Normal (1x1)</option>
                        <option value="tall">Tinggi (1x2)</option>
                        <option value="wide">Lebar (2x1)</option>
                        <option value="large">Unggulan (2x2)</option>
                    </select>
                  </div>
                </div>

                {/* Right Side: Inputs */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="Contoh: Kaos Polos Hitam"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Kode)</label>
                      <input 
                        type="text" 
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono text-sm"
                        placeholder="TS-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                      >
                        <option value="Atasan">Atasan</option>
                        <option value="Bawahan">Bawahan</option>
                        <option value="Outerwear">Outerwear</option>
                        <option value="Sepatu">Sepatu</option>
                        <option value="Aksesoris">Aksesoris</option>
                      </select>
                    </div>
                  </div>

                  {/* PRICE ROW */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Harga Jual (Rp) <span className="text-red-500">*</span></label>
                      <input 
                        required
                        type="number" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Harga Modal (HPP)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                          type="number" 
                          value={formData.costPrice}
                          onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
                          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50/50"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STOCK & STATUS */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
                      <input 
                        required
                        type="number" 
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status Produk</label>
                        <div className="flex gap-4 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                            type="radio" 
                            name="status"
                            checked={formData.status === 'active'}
                            onChange={() => setFormData({...formData, status: 'active'})}
                            className="accent-orange-500" 
                            />
                            <span className="text-sm text-gray-700">Aktif</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                            type="radio" 
                            name="status" 
                            checked={formData.status === 'inactive'}
                            onChange={() => setFormData({...formData, status: 'inactive'})}
                            className="accent-gray-500" 
                            />
                            <span className="text-sm text-gray-500">Non-Aktif</span>
                        </label>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
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
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}