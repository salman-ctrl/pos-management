"use client";

import { useState, useEffect } from 'react';
import { X, UploadCloud, LayoutGrid, Save, ImageIcon } from 'lucide-react';

export default function CategoryModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState('');
  const [size, setSize] = useState('normal'); 
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setSize(initialData.displayType || 'normal');
        setPreviewUrl(initialData.imageUrl ? `http://localhost:5000${initialData.imageUrl}` : '');
      } else {
        setName('');
        setSize('normal');
        setImageFile(null);
        setPreviewUrl('');
      }
    }
  }, [isOpen, initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, size, imageFile });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800">
            {initialData ? 'Edit Kategori' : 'Kategori Baru'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex gap-4">
            <div className="w-28 h-28 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 flex-shrink-0 overflow-hidden relative group hover:border-orange-400 transition-colors cursor-pointer">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1">
                   <UploadCloud size={24} />
                   <span className="text-[10px]">Upload</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Nama Kategori <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Contoh: Makanan Berat"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1 flex items-center gap-1">
                  <LayoutGrid size={12}/> Tampilan Grid
                </label>
                <select 
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 bg-white cursor-pointer"
                >
                  <option value="normal">Normal (1x1)</option>
                  <option value="wide">Lebar (2x1)</option>
                  <option value="tall">Tinggi (1x2)</option>
                  <option value="large">Besar (2x2)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
             ℹ️ <b>Info:</b> Total Stok, Jumlah Menu, dan Growth akan dihitung otomatis oleh sistem berdasarkan data produk.
          </div>

          <div className="pt-2 border-t border-gray-100 flex justify-end gap-3 mt-4">
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
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}