"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Settings, 
  ChevronDown, Box, ClipboardList, UserCircle, LogOut 
} from 'lucide-react';
// Import Store untuk Auth & User Data
import { useStore } from '../store/useStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const SidebarItem = ({ icon: Icon, label, href, hasSubmenu, isOpen, onClick }) => {
  const pathname = usePathname();
  // Cek apakah URL aktif (exact match atau nested)
  const isActive = href ? pathname === href : false;

  const Wrapper = href ? Link : 'button';
  const props = href ? { href } : { onClick };

  return (
    <Wrapper
      {...props}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group mb-1 ${
        isActive || (hasSubmenu && isOpen)
          ? 'bg-orange-50 text-orange-600 font-medium' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'} />
        <span>{label}</span>
      </div>
      {hasSubmenu && (
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      )}
    </Wrapper>
  );
};

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const router = useRouter();
  const { user, logout } = useStore(); // Ambil data user & fungsi logout dari Zustand
  const [expandedMenu, setExpandedMenu] = useState({ inventory: true });
  const pathname = usePathname();

  const toggleSubmenu = (key) => {
    setExpandedMenu(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper untuk menutup mobile menu saat link diklik
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  // Fungsi Logout
  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari aplikasi?')) {
        logout(); // Hapus token & user dari store
        router.push('/login'); // Redirect ke login
    }
  };

  // Helper Gambar Profil
  const getImageUrl = (path) => {
      if (!path) return null;
      return path.startsWith('http') ? path : `${API_URL}${path}`;
  };

  return (
    <>
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <Package className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">POS System</h1>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <div onClick={handleLinkClick}>
              <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/" />
            </div>

            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Inventory</p>
              <SidebarItem 
                icon={Box} 
                label="Produk & Stok" 
                hasSubmenu 
                isOpen={expandedMenu.inventory}
                onClick={() => toggleSubmenu('inventory')} 
              />
              {expandedMenu.inventory && (
                <div className="ml-4 pl-4 border-l border-gray-200 space-y-1 mt-1 mb-2" onClick={handleLinkClick}>
                  <Link href="/products" className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${pathname === '/products' ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-800'}`}>Daftar Produk</Link>
                  <Link href="/categories" className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${pathname === '/categories' ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-800'}`}>Kategori</Link>
                  <Link href="/stock" className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${pathname === '/inventory' ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-800'}`}>Riwayat Stok</Link>
                </div>
              )}
            </div>

            <div onClick={handleLinkClick}>
              <SidebarItem icon={ShoppingCart} label="Transaksi" href="/transactions" />
              <SidebarItem icon={ClipboardList} label="Laporan" href="/reports" />
            </div>

             <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">People</p>
              <div onClick={handleLinkClick}>
                <SidebarItem icon={Users} label="Pengguna" href="/users" />
                <SidebarItem icon={UserCircle} label="Pelanggan" href="/customers" />
              </div>
            </div>
            
            <div className="pt-4" onClick={handleLinkClick}>
              <SidebarItem icon={Settings} label="Pengaturan" href="/settings" />
            </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden">
                {user?.imageUrl ? (
                    <img src={getImageUrl(user.imageUrl)} alt={user.name} className="w-full h-full object-cover"/>
                ) : (
                    <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Guest'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role || 'Staff'}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Keluar"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
    </>
  );
}