"use client";

import { useState, useEffect } from 'react';
import { X, UploadCloud, Save, ImageIcon, DollarSign, Package, LayoutGrid } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, onSave, initialData, categories }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    price: '',
    costPrice: '',
    stock: '',
    status: 'active',
    displayType: 'normal',
    imageFile: null
  });
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          sku: initialData.sku || '',
          categoryId: initialData.categoryId || '',
          price: initialData.price || '',
          costPrice: initialData.costPrice || '',
          stock: initialData.stock || '',
          status: initialData.isActive ? 'active' : 'inactive',
          displayType: initialData.displayType || 'normal',
          imageFile: null
        });

        // FIX PREVIEW: Gunakan logika Cloudinary vs Local
        const imgPath = initialData.imageUrl;
        const finalUrl = imgPath ? (imgPath.startsWith('http') ? imgPath : `${API_URL}${imgPath}`) : '';
        setPreviewUrl(finalUrl);

      } else {
        setFormData({
          name: '',
          sku: '',
          categoryId: categories && categories.length > 0 ? categories[0].id : '',
          price: '',
          costPrice: '',
          stock: '',
          status: 'active',
          displayType: 'normal',
          imageFile: null
        });
        setPreviewUrl('');
      }
    }
  }, [isOpen, initialData, categories]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Parent akan menangani closing & alert
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h3 className="font-bold text-lg text-gray-800">
            {initialData ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 space-y-6 overflow-y-auto">
            <div className="flex flex-col md:flex-row gap-6">

              <div className="w-full md:w-1/3 space-y-3">
                <label className="block text-sm font-medium text-gray-700">Foto Produk</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 bg-gray-50 overflow-hidden relative cursor-pointer hover:border-orange-400 transition-colors group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 group-hover:text-orange-500">
                      <UploadCloud size={24} />
                      <span className="text-[10px]">Upload Foto</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1 flex items-center gap-1">
                    <LayoutGrid size={12} /> Tampilan Kartu
                  </label>
                  <select
                    value={formData.displayType}
                    onChange={(e) => setFormData({ ...formData, displayType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-orange-500 outline-none cursor-pointer"
                  >
                    <option value="normal">Normal (1x1)</option>
                    <option value="tall">Tinggi (1x2)</option>
                    <option value="wide">Lebar (2x1)</option>
                    <option value="large">Unggulan (2x2)</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="..."
                      placeholder="Otomatis (Kosongkan)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 bg-white cursor-pointer"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories && categories.map((cat) => (
                        cat.id !== 0 && (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        )
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga Jual</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                      <input
                        required
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 font-bold text-gray-800"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">HPP (Modal)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                      <input
                        type="number"
                        value={formData.costPrice}
                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input
                        required
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={formData.status === 'active'}
                          onChange={() => setFormData({ ...formData, status: 'active' })}
                          className="accent-green-500"
                        />
                        <span className="text-sm text-gray-700">Aktif</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={formData.status === 'inactive'}
                          onChange={() => setFormData({ ...formData, status: 'inactive' })}
                          className="accent-gray-400"
                        />
                        <span className="text-sm text-gray-500">Non-Aktif</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-200 font-medium flex items-center gap-2 transition-colors"
            >
              <Save size={18} />
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}