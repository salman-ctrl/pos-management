"use client";

import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Phone, MapPin, Crown, Star, ShoppingBag, Edit, Trash2, X, Save, UploadCloud, ImageIcon, User } from 'lucide-react';

// Data Mock Customers dengan Bento Layout
const INITIAL_CUSTOMERS = [
  { 
    id: 1, 
    name: 'Sultan Andara', 
    email: 'sultan@gmail.com',
    phone: '+62 811-2233-4455',
    status: 'VIP',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=60',
    size: 'large', // 2x2 Big Card (Top Spender)
    stats: { totalSpent: 15400000, visits: 42, lastVisit: 'Hari ini' }
  },
  { 
    id: 2, 
    name: 'Clarissa Putri', 
    email: 'clarissa.p@yahoo.com',
    phone: '+62 812-9876-5432',
    status: 'Member',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60',
    size: 'tall', // 1x2 Tall Card
    stats: { totalSpent: 4500000, visits: 15, lastVisit: '3 hari lalu' }
  },
  { 
    id: 3, 
    name: 'Dimas Anggara', 
    email: 'dimas.a@outlook.com',
    phone: '+62 857-1234-5678',
    status: 'New',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60',
    size: 'normal', // 1x1 Standard
    stats: { totalSpent: 320000, visits: 2, lastVisit: '1 minggu lalu' }
  },
  { 
    id: 4, 
    name: 'Bella Hadid', 
    email: 'bella@fashion.com',
    phone: '+62 813-5555-6666',
    status: 'VIP',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=60',
    size: 'wide', // 2x1 Wide Card
    stats: { totalSpent: 8900000, visits: 28, lastVisit: 'Kemarin' }
  },
  { 
    id: 5, 
    name: 'Rizky Billar', 
    email: 'rizky.b@gmail.com',
    phone: '+62 819-8888-9999',
    status: 'Member',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=60',
    size: 'normal',
    stats: { totalSpent: 1200000, visits: 8, lastVisit: '2 minggu lalu' }
  }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    status: 'Member',
    image: '',
    size: 'normal',
    stats: { totalSpent: 0, visits: 0, lastVisit: 'Baru gabung' }
  });

  // --- Logic CRUD ---

  const handleAdd = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      name: '',
      email: '',
      phone: '',
      status: 'Member',
      image: '',
      size: 'normal',
      stats: { totalSpent: 0, visits: 0, lastVisit: 'Baru gabung' }
    });
    setIsModalOpen(true);
  };

  const handleEdit = (customer, e) => {
    e.stopPropagation();
    setIsEditing(true);
    setFormData(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Default image jika kosong
    const finalImage = formData.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&auto=format&fit=crop&q=60';

    if (isEditing) {
      setCustomers(customers.map(c => (c.id === formData.id ? { ...formData, image: finalImage } : c)));
    } else {
      const newCustomer = {
        ...formData,
        id: Date.now(),
        image: finalImage
      };
      setCustomers([...customers, newCustomer]);
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

  const getStatusBadge = (status) => {
    switch(status) {
        case 'VIP': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'Member': return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h2 className="text-2xl font-bold text-gray-800">Pelanggan & Member</h2>
           <p className="text-gray-400 text-sm">Database pelanggan setia toko Anda.</p>
         </div>
         
         <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Cari member..." 
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-sm"
                />
            </div>
            <button 
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm transition-colors whitespace-nowrap"
            >
                <Plus size={18} /> <span className="hidden sm:inline">Tambah</span>
            </button>
         </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-4">
        
        {/* 'Add New' Placeholder Card */}
        <div 
            onClick={handleAdd}
            className="md:col-span-1 md:row-span-1 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all cursor-pointer bg-gray-50/50 group"
        >
            <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <User size={24} />
            </div>
            <span className="font-medium text-sm">Registrasi Member</span>
        </div>

        {customers.map((customer) => (
          <div 
            key={customer.id} 
            className={`group relative rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer ${getSpanClass(customer.size)}`}
          >
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={(e) => handleEdit(customer, e)}
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-orange-500 shadow-sm hover:bg-white transition-colors"
                >
                    <Edit size={16} />
                </button>
                <button 
                    onClick={(e) => handleDelete(customer.id, e)}
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 shadow-sm hover:bg-white transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Layout Rendering */}
            {customer.size === 'large' ? (
                // TYPE 1: LARGE CARD (Top Spender VIP)
                <>
                    <div className="absolute inset-0">
                        <img src={customer.image} alt={customer.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    </div>
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                         <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 border border-white/20">
                             <Crown size={12} fill="currentColor" /> VIP MEMBER
                        </span>
                    </div>
                    <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-orange-300 font-medium text-xs mb-1 uppercase tracking-wider">Top Spender</p>
                                <h3 className="text-3xl font-bold mb-2">{customer.name}</h3>
                                <div className="flex flex-col gap-1 text-sm text-gray-300">
                                    <span className="flex items-center gap-2"><Mail size={14} /> {customer.email}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 mb-1">Total Belanja</p>
                                <p className="text-xl font-bold text-white">{formatCurrency(customer.stats.totalSpent)}</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // TYPE 2: STANDARD/TALL/WIDE CARDS
                <div className="h-full flex flex-col p-5">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <img src={customer.image} alt={customer.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0" />
                            <div>
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getStatusBadge(customer.status)}`}>
                                    {customer.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="font-bold text-gray-800 text-lg leading-tight truncate" title={customer.name}>{customer.name}</h3>
                        <p className="text-gray-400 text-xs mb-3 truncate">{customer.phone}</p>
                        
                        {/* Stats Row */}
                        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-50">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-gray-400 uppercase truncate">Visits</p>
                                <p className="font-bold text-gray-700 flex items-center gap-1 whitespace-nowrap">
                                    <ShoppingBag size={12} className="text-orange-500" /> {customer.stats.visits}x
                                </p>
                            </div>
                            <div className="flex-1 border-l border-gray-100 pl-3 min-w-0">
                                <p className="text-[10px] text-gray-400 uppercase truncate">Spent</p>
                                <p className="font-bold text-gray-700 text-xs whitespace-nowrap">
                                    {formatCurrency(customer.stats.totalSpent).split(',')[0]}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info for Wide/Tall */}
                    {(customer.size === 'wide' || customer.size === 'tall') && (
                         <div className="mt-2 bg-gray-50 p-2 rounded-lg text-xs text-gray-500 flex items-center justify-between">
                            <span>Terakhir datang:</span>
                            <span className="font-medium text-gray-700">{customer.stats.lastVisit}</span>
                        </div>
                    )}
                </div>
            )}
          </div>
        ))}
      </div>

      {/* --- Modal Form CRUD (RESPONSIVE FIX) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
              <h3 className="font-bold text-lg text-gray-800">
                {isEditing ? 'Edit Data Pelanggan' : 'Registrasi Member Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Form - Scrollable Area */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Image */}
                    <div className="w-full md:w-1/3 space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Foto Profil</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 bg-gray-50 overflow-hidden relative">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <UploadCloud size={24} className="mb-2" />
                                    <span className="text-[10px] text-center px-4">Preview</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">URL Foto</label>
                            <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                                <ImageIcon size={14} className="text-gray-400"/>
                                <input 
                                    type="text" 
                                    className="w-full text-xs bg-transparent outline-none text-gray-600"
                                    placeholder="https://..."
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        {/* Card Size Selector (Bento Feature) */}
                        <div>
                            <label className="text-xs text-gray-500 mb-2 block">Highlight Card (Bento)</label>
                            <select 
                                value={formData.size} 
                                onChange={(e) => setFormData({...formData, size: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-orange-500 outline-none"
                            >
                                <option value="normal">Normal (1x1)</option>
                                <option value="tall">Tinggi (1x2)</option>
                                <option value="wide">Lebar (2x1)</option>
                                <option value="large">VIP Besar (2x2)</option>
                            </select>
                        </div>
                    </div>

                    {/* Right: Inputs */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input 
                                required
                                type="text" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                                placeholder="Nama Pelanggan"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status Member</label>
                                <select 
                                    value={formData.status} 
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                                >
                                    <option value="New">New</option>
                                    <option value="Member">Regular Member</option>
                                    <option value="VIP">VIP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                                <input 
                                    type="text" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                                    placeholder="+62..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                                placeholder="email@pelanggan.com"
                            />
                        </div>

                        {/* Stats Manual Input (Optional for Admin) */}
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Data Belanja (Manual Override)</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Total Spent (Rp)</label>
                                    <input 
                                        type="number" 
                                        value={formData.stats.totalSpent}
                                        onChange={(e) => setFormData({...formData, stats: {...formData.stats, totalSpent: Number(e.target.value)}})}
                                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Jml Kunjungan</label>
                                    <input 
                                        type="number" 
                                        value={formData.stats.visits}
                                        onChange={(e) => setFormData({...formData, stats: {...formData.stats, visits: Number(e.target.value)}})}
                                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              {/* Footer */}
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
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}