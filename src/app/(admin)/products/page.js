"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ProductModal from '@/components/ProductModal';
import { showAlert } from '@/utils/swal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProductsPage() {
    const { products, categories, fetchDataMaster } = useStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchDataMaster();
    }, []);

    // --- HELPER FOTO SANGAT PENTING ---
    const getImageUrl = (path) => {
        if (!path) return null;

        // Jika path sudah merupakan URL lengkap (Cloudinary selalu mulai dengan http)
        // Langsung kembalikan path-nya tanpa menambah API_URL
        if (path.startsWith('http')) {
            return path;
        }

        // Hanya tambahkan API_URL jika path-nya adalah path lokal (seperti /uploads/...)
        return `${API_URL}${path}`;
    };

    const formatRp = (num) => "Rp " + (Number(num) || 0).toLocaleString('id-ID');

    // --- LOGIC FILTER & PAGINATION ---
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const name = product.name || '';
            const sku = product.sku || '';
            const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sku.toLowerCase().includes(searchQuery.toLowerCase());

            const categoryName = product.category ? product.category.name : 'Uncategorized';
            const matchesCategory = selectedCategory === 'Semua' || categoryName === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
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

    const handleSaveProduct = async (formData) => {
        const token = localStorage.getItem('token');
        const data = new FormData();

        data.append('name', formData.name);
        data.append('sku', formData.sku || '');
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
            showAlert.loading("Sedang menyimpan...");

            const url = editingProduct
                ? `${API_URL}/api/products/${editingProduct.id}`
                : `${API_URL}/api/products`;

            const method = editingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            const result = await res.json();

            if (res.ok && result.success) {
                // TUTUP MODAL DULU
                setIsModalOpen(false);

                // TUNGGU DATA MASTER REFRESH SELESAI
                await fetchDataMaster();

                showAlert.success("Berhasil!", editingProduct ? "Menu diperbarui." : "Menu baru ditambahkan.");
            } else {
                showAlert.error("Gagal", result.message || "Gagal menyimpan.");
            }
        } catch (error) {
            showAlert.error("Error Jaringan", "Gagal menghubungi backend.");
        }
    };
    return (
        <div className="space-y-6">
            {/* Search & Filter Header */}
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
                            className="h-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                            <option value="Semua">Semua</option>
                            {categories.map((cat) => (
                                cat.id !== 0 && <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm">
                    <Plus size={18} /> Tambah Menu
                </button>
            </div>

            {/* Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
                {/* Placeholder Add */}
                {currentPage === 1 && !searchQuery && selectedCategory === 'Semua' && (
                    <div onClick={handleAdd} className="md:col-span-1 md:row-span-1 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all cursor-pointer bg-gray-50/50 group">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Plus size={24} /></div>
                        <span className="font-medium text-sm">Tambah Menu Baru</span>
                    </div>
                )}

                {/* Render Items */}
                {currentProducts.map((item) => (
                    <div
                        key={item.id}
                        className={`group relative rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer ${getSpanClass(item.displayType || 'normal')}`}
                        onClick={() => handleEdit(item, { stopPropagation: () => { } })}
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
                            <button onClick={(e) => handleEdit(item, e)} className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-orange-500"><Edit size={16} /></button>
                            <button onClick={(e) => handleDelete(item.id, e)} className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>

                        <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20 uppercase">
                                {item.category ? item.category.name : 'Umum'}
                            </span>
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

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-100">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-xl border border-gray-200 disabled:opacity-30"><ChevronLeft size={20} /></button>
                    <span className="text-sm font-medium text-gray-600">Halaman <span className="text-orange-500 font-bold">{currentPage}</span> dari {totalPages}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-xl border border-gray-200 disabled:opacity-30"><ChevronRight size={20} /></button>
                </div>
            )}

            {/* Modal Form */}
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