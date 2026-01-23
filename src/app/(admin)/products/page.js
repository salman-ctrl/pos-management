"use client";

import { useState } from 'react';
import { Search, Filter, Plus, Package, Edit, Trash2, AlertTriangle, X, UploadCloud, Save, ImageIcon, LayoutGrid, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';

// Data Awal Dummy (Tema Restoran dengan Bento Layout)
// Update: Menambahkan cost_price (Harga Modal) sesuai ERD
const INITIAL_PRODUCTS = [
  { id: 1, name: 'Nasi Goreng Spesial', category: 'Makanan Berat', price: 35000, costPrice: 15000, stock: 45, status: 'active', sku: 'FOOD-001', image: 'https://ik.imagekit.io/dcjlghyytp1/https://sayurbox-blog-stage.s3.amazonaws.com/uploads/2020/07/fried-2509089_1920.jpg?tr=f-auto', size: 'large' },
  { id: 2, name: 'Es Kopi Susu Gula Aren', category: 'Minuman', price: 22000, costPrice: 8000, stock: 120, status: 'active', sku: 'DRK-001', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=60', size: 'tall' },
  { id: 3, name: 'Ayam Bakar Madu', category: 'Makanan Berat', price: 42000, costPrice: 20000, stock: 0, status: 'inactive', sku: 'FOOD-002', image: 'https://o-cdf.oramiland.com/unsafe/cnc-magazine.oramiland.com/parenting/original_images/3_Resep_Ayam_Bakar_Madu_-2.jpg', size: 'normal' },
  { id: 4, name: 'Kentang Goreng', category: 'Snack', price: 18000, costPrice: 6000, stock: 25, status: 'active', sku: 'SNK-001', image: 'https://image.idntimes.com/post/20230712/tips-membuat-kentang-goreng-anti-lembek-dan-tetap-kriuk-resep-kentang-goreng-mcd-kentang-goreng-kfc-9cde86371d7fc78c91ae80a6ffab250e-2c28a950c10d937a546160e888ed397c.jpg', size: 'wide' },
  { id: 5, name: 'Ice Lemon Tea', category: 'Minuman', price: 15000, costPrice: 4000, stock: 50, status: 'active', sku: 'DRK-002', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 6, name: 'Burger Daging Sapi', category: 'Makanan Berat', price: 45000, costPrice: 22000, stock: 15, status: 'active', sku: 'FOOD-003', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 7, name: 'Spaghetti Carbonara', category: 'Makanan Berat', price: 38000, costPrice: 16000, stock: 10, status: 'active', sku: 'FOOD-004', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 8, name: 'Pancake Strawberry', category: 'Dessert', price: 25000, costPrice: 9000, stock: 20, status: 'active', sku: 'DST-001', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=60', size: 'tall' },
  { id: 9, name: 'Jus Alpukat', category: 'Minuman', price: 20000, costPrice: 8000, stock: 8, status: 'active', sku: 'DRK-003', image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 10, name: 'Dimsum Ayam (4pcs)', category: 'Snack', price: 20000, costPrice: 10000, stock: 40, status: 'active', sku: 'SNK-002', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=60', size: 'wide' },
  { id: 11, name: 'Steak Sapi Lada Hitam', category: 'Makanan Berat', price: 85000, costPrice: 45000, stock: 5, status: 'active', sku: 'FOOD-005', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&auto=format&fit=crop&q=60', size: 'large' },
  { id: 12, name: 'Chocolate Lava Cake', category: 'Dessert', price: 30000, costPrice: 12000, stock: 18, status: 'active', sku: 'DST-002', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 13, name: 'Matcha Latte', category: 'Minuman', price: 24000, costPrice: 9000, stock: 35, status: 'active', sku: 'DRK-004', image: 'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 14, name: 'Onion Rings', category: 'Snack', price: 15000, costPrice: 5000, stock: 22, status: 'active', sku: 'SNK-003', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&auto=format&fit=crop&q=60', size: 'normal' },
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
    category: 'Makanan Berat', // Default category updated
    price: '',
    costPrice: '', 
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
      category: 'Makanan Berat', 
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
    
    const finalImage = formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60'; // Default food placeholder
    
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
                placeholder="Cari menu..." 
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
                    <option value="Makanan Berat">Makanan Berat</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Snack">Snack</option>
                    <option value="Dessert">Dessert</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
        </div>

        <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm transition-colors whitespace-nowrap"
        >
            <Plus size={18} /> Tambah Menu
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
                <span className="font-medium text-sm">Tambah Menu Baru</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
              <h3 className="font-bold text-lg text-gray-800">
                {isEditing ? 'Edit Menu' : 'Tambah Menu Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Side: Image Upload & Bento Options */}
                  <div className="w-full md:w-1/3 space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Foto Menu</label>
                    
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu <span className="text-red-500">*</span></label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                        placeholder="Contoh: Nasi Goreng Spesial"
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
                          placeholder="FOOD-001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                        >
                          <option value="Makanan Berat">Makanan Berat</option>
                          <option value="Minuman">Minuman</option>
                          <option value="Snack">Snack</option>
                          <option value="Dessert">Dessert</option>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status Menu</label>
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
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0 bg-white">
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
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}