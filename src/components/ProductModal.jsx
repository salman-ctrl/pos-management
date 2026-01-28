"use client";

import { useState, useEffect } from 'react';
import {
  X, UploadCloud, Save, LayoutGrid, Package,
  DollarSign, Tag, Info, Edit3, Boxes,
  Monitor, CheckCircle2, AlertCircle
} from 'lucide-react';

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

  // --- HELPER UNTUK PREVIEW GAMBAR CLOUDINARY ---
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('//')) {
      return path.startsWith('//') ? `https:${path}` : path;
    }
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${API_URL}/${cleanPath}`;
  };

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
        setPreviewUrl(getImageUrl(initialData.imageUrl));
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
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-300 max-h-[95vh]">

        {/* Futuristic Dark Header */}
        <div className="px-10 py-8 flex justify-between items-center bg-gray-950 text-white relative flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/20">
              <Boxes size={28} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-2xl tracking-tight leading-none uppercase">
                {initialData ? 'Edit Inventory Item' : 'New Product Record'}
              </h3>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.4em] mt-2">Savoria Enterprise System v1.0</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white">
            <X size={32} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-10 space-y-10 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

              {/* LEFT SIDE: Visuals & Bento Layout */}
              <div className="lg:col-span-4 space-y-8">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 ml-1">Asset Image</label>
                  <div className="aspect-[4/5] rounded-[2.5rem] bg-gray-50 border-4 border-gray-100 flex flex-col items-center justify-center text-gray-400 relative overflow-hidden group hover:border-orange-500/30 transition-all cursor-pointer shadow-inner">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    ) : (
                      <div className="flex flex-col items-center gap-3 group-hover:text-orange-500 transition-colors">
                        <div className="p-5 bg-white rounded-3xl shadow-sm border border-gray-100">
                          <UploadCloud size={40} strokeWidth={1} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Select Visual</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Edit3 className="text-white" size={32} />
                    </div>
                  </div>
                </div>

                {/* Visual Bento Selection */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4 ml-1 flex items-center gap-2">
                    <Monitor size={12} /> Grid Appearance
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'normal', label: '1x1', desc: 'Base' },
                      { id: 'wide', label: '2x1', desc: 'Horizontal' },
                      { id: 'tall', label: '1x2', desc: 'Portrait' },
                      { id: 'large', label: '2x2', desc: 'Hero' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, displayType: opt.id })}
                        className={`p-4 rounded-2xl border-2 text-left transition-all relative ${formData.displayType === opt.id
                            ? 'border-orange-500 bg-orange-50/50 text-orange-950 shadow-md ring-8 ring-orange-500/5'
                            : 'border-gray-100 text-gray-400 hover:border-gray-200 bg-white'
                          }`}
                      >
                        <p className="font-black text-xs">{opt.label}</p>
                        <p className="text-[8px] uppercase tracking-tighter opacity-60 font-bold">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Main Data Input */}
              <div className="lg:col-span-8 space-y-8">
                {/* Product Name */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Menu Identity</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] text-gray-950 font-black text-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-gray-200"
                    placeholder="Nasi Goreng Wagyu..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Stock Keeping Unit (SKU)</label>
                    <div className="relative">
                      <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-300"
                        placeholder="AUTO_GENERATE"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Classification</label>
                    <div className="relative">
                      <LayoutGrid className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-orange-500 bg-white appearance-none cursor-pointer"
                      >
                        {categories.map((cat) => (
                          cat.id !== 0 && <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="grid grid-cols-2 gap-6 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-inner">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest block ml-1">Customer Price (Sell)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
                      <input
                        required
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-14 pr-6 py-5 bg-white border-2 border-orange-100 rounded-2xl font-black text-xl text-gray-900 focus:outline-none focus:border-orange-500 transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Base Cost (HPP)</label>
                    <div className="relative opacity-60 hover:opacity-100 transition-opacity">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        value={formData.costPrice}
                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                        className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-xl text-gray-700 focus:outline-none focus:border-gray-400 transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Initial Inventory</label>
                    <div className="relative">
                      <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input
                        required
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-800 focus:outline-none focus:border-gray-500 transition-all"
                        placeholder="Units"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Status Control</label>
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl h-[58px]">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'active' })}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${formData.status === 'active' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <CheckCircle2 size={14} /> Active
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'inactive' })}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${formData.status === 'inactive' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <AlertCircle size={14} /> Disabled
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Floating Effect */}
          <div className="px-10 py-8 border-t border-gray-100 flex justify-end items-center gap-6 flex-shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 transition-colors"
            >
              Dismiss Changes
            </button>
            <button
              type="submit"
              className="px-12 py-5 bg-gray-950 text-white rounded-[1.8rem] hover:bg-orange-600 shadow-2xl shadow-gray-200 transition-all active:scale-95 font-black text-sm flex items-center gap-3 uppercase tracking-widest"
            >
              <Save size={20} />
              Confirm Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

