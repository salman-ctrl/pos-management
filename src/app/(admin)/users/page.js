"use client";

import { useState } from 'react';
import { Plus, MoreHorizontal, Mail, Phone, MapPin, ShieldCheck, Clock, Edit, Trash2, X, Save, UploadCloud, ImageIcon } from 'lucide-react';

// Data Mock Users Awal
const INITIAL_USERS = [
  { 
    id: 1, 
    name: 'Alexandra Daddario', 
    role: 'Owner & Founder', 
    email: 'owner@berkahjaya.com',
    phone: '+62 812-3456-7890',
    status: 'online',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60',
    size: 'large', // 2x2 Big Card
    stats: { shift: 'Full Time', joined: 'Jan 2023' }
  },
  { 
    id: 2, 
    name: 'Budi Santoso', 
    role: 'Store Manager', 
    email: 'budi.mgr@toko.com',
    phone: '+62 813-9988-7766',
    status: 'away',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60',
    size: 'tall', // 1x2 Tall Card
    stats: { shift: 'Morning', joined: 'Mar 2023' }
  },
  { 
    id: 3, 
    name: 'Sarah Amalia', 
    role: 'Senior Cashier', 
    email: 'sarah.a@toko.com',
    phone: '+62 857-1122-3344',
    status: 'online',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60',
    size: 'normal', // 1x1 Standard
    stats: { shift: 'Morning', joined: 'Jun 2024' }
  },
  { 
    id: 4, 
    name: 'Rian Pratama', 
    role: 'Cashier', 
    email: 'rian.p@toko.com',
    phone: '+62 812-3344-5566',
    status: 'offline',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60',
    size: 'normal',
    stats: { shift: 'Night', joined: 'Aug 2024' }
  },
  { 
    id: 5, 
    name: 'Jessica Mila', 
    role: 'Inventory Staff', 
    email: 'jessica.m@toko.com',
    phone: '+62 819-0011-2233',
    status: 'online',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=60',
    size: 'wide', // 2x1 Wide Card
    stats: { shift: 'Flexi', joined: 'Sep 2024' }
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    role: 'Cashier',
    email: '',
    phone: '',
    status: 'online',
    image: '',
    size: 'normal',
    stats: { shift: 'Morning', joined: 'Jan 2026' }
  });

  // --- Logic CRUD ---

  const handleAdd = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      name: '',
      role: 'Cashier',
      email: '',
      phone: '',
      status: 'online',
      image: '',
      size: 'normal',
      stats: { shift: 'Morning', joined: 'Jan 2026' }
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user, e) => {
    e.stopPropagation(); // Mencegah trigger klik card
    setIsEditing(true);
    setFormData(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Default image jika kosong
    const finalImage = formData.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&auto=format&fit=crop&q=60';

    if (isEditing) {
      setUsers(users.map(u => (u.id === formData.id ? { ...formData, image: finalImage } : u)));
    } else {
      const newUser = {
        ...formData,
        id: Date.now(),
        image: finalImage
      };
      setUsers([...users, newUser]);
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

  const getStatusColor = (status) => {
    switch(status) {
        case 'online': return 'bg-green-500';
        case 'away': return 'bg-yellow-500';
        case 'offline': return 'bg-gray-400';
        default: return 'bg-gray-400';
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h2 className="text-2xl font-bold text-gray-800">Tim & Pengguna</h2>
           <p className="text-gray-400 text-sm">Kelola akses dan profil staff.</p>
         </div>
         <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm transition-colors"
         >
           <Plus size={18} /> Tambah User
         </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-4">
        
        {/* 'Add New' Card */}
        <div 
            onClick={handleAdd}
            className="md:col-span-1 md:row-span-1 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all cursor-pointer bg-gray-50/50 group"
        >
            <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Plus size={24} />
            </div>
            <span className="font-medium text-sm">Undang Staff Baru</span>
        </div>

        {users.map((user) => (
          <div 
            key={user.id} 
            className={`group relative rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer ${getSpanClass(user.size)}`}
          >
            {/* Action Buttons (Edit/Delete) */}
            <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={(e) => handleEdit(user, e)}
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-orange-500 shadow-sm hover:bg-white transition-colors"
                >
                    <Edit size={16} />
                </button>
                <button 
                    onClick={(e) => handleDelete(user.id, e)}
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 shadow-sm hover:bg-white transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Layout Rendering */}
            {user.size === 'large' ? (
                // TYPE 1: LARGE CARD (Owner) - Aman
                <>
                    <div className="absolute inset-0">
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    </div>
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                         <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/10 flex items-center gap-1">
                             <ShieldCheck size={12} /> Super Admin
                        </span>
                    </div>
                    <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                        <p className="text-orange-400 font-bold text-sm mb-1 uppercase tracking-wider">{user.role}</p>
                        <h3 className="text-3xl font-bold mb-2">{user.name}</h3>
                        <div className="flex flex-col gap-1 text-sm text-gray-300">
                             <span className="flex items-center gap-2"><Mail size={14} /> {user.email}</span>
                             <span className="flex items-center gap-2"><Phone size={14} /> {user.phone}</span>
                        </div>
                    </div>
                </>
            ) : (
                // TYPE 2: STANDARD/TALL/WIDE CARDS
                // Fix: min-w-0 pada parent flex container agar truncate bekerja
                <div className="h-full flex flex-col p-5">
                    <div className="flex justify-between items-start mb-3">
                        <div className="relative flex-shrink-0">
                            <img src={user.image} alt={user.name} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                            <span className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${getStatusColor(user.status)}`} />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="font-bold text-gray-800 text-lg leading-tight truncate" title={user.name}>
                            {user.name}
                        </h3>
                        <p className="text-orange-500 text-xs font-medium mb-3 truncate">{user.role}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-auto">
                            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] rounded-lg border border-gray-100 flex items-center gap-1 whitespace-nowrap">
                                <Clock size={10} /> {user.stats.shift}
                            </span>
                             <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] rounded-lg border border-gray-100 flex items-center gap-1 whitespace-nowrap">
                                <MapPin size={10} /> Pusat
                            </span>
                        </div>
                    </div>

                    {/* Email HANYA tampil jika card WIDE atau TALL */}
                    {(user.size === 'wide' || user.size === 'tall') && (
                         <div className="pt-3 mt-3 border-t border-gray-50 text-xs text-gray-400 flex items-center gap-1 min-w-0">
                            <Mail size={12} className="flex-shrink-0" /> 
                            <span className="truncate" title={user.email}>{user.email}</span>
                        </div>
                    )}
                </div>
            )}
          </div>
        ))}
      </div>

      {/* --- Modal Form CRUD (Fix Responsive & Scroll) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
              <h3 className="font-bold text-lg text-gray-800">
                {isEditing ? 'Edit Profil User' : 'Undang User Baru'}
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
                            <label className="text-xs text-gray-500 mb-2 block">Tampilan Kartu (Bento)</label>
                            <select 
                                value={formData.size} 
                                onChange={(e) => setFormData({...formData, size: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-orange-500 outline-none"
                            >
                                <option value="normal">Normal (1x1)</option>
                                <option value="tall">Tinggi (1x2)</option>
                                <option value="wide">Lebar (2x1)</option>
                                <option value="large">Besar (2x2)</option>
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
                                placeholder="John Doe"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role / Jabatan</label>
                                <select 
                                    value={formData.role} 
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                                >
                                    <option>Cashier</option>
                                    <option>Senior Cashier</option>
                                    <option>Store Manager</option>
                                    <option>Inventory Staff</option>
                                    <option>Owner & Founder</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select 
                                    value={formData.status} 
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                                >
                                    <option value="online">Online</option>
                                    <option value="away">Away / Break</option>
                                    <option value="offline">Offline</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                                placeholder="email@toko.com"
                            />
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
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shift Kerja</label>
                                <select 
                                    value={formData.stats.shift} 
                                    onChange={(e) => setFormData({...formData, stats: {...formData.stats, shift: e.target.value}})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                                >
                                    <option>Morning</option>
                                    <option>Night</option>
                                    <option>Flexi</option>
                                    <option>Full Time</option>
                                </select>
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
                  Simpan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}