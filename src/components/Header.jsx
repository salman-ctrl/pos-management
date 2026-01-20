"use client";

import { Menu } from 'lucide-react';

export default function Header({ toggleSidebar }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0">
      <button 
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>
      
      <div className="flex items-center gap-4 ml-auto">
         <div className="text-right hidden md:block">
            <p className="text-xs text-gray-500">Selasa, 20 Jan 2026</p>
            <p className="text-sm font-medium text-gray-800">Warung Berkah Jaya</p>
         </div>
      </div>
    </header>
  );
}