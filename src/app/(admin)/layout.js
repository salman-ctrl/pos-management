"use client";

import { useState } from 'react';
import "../globals.css";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function RootLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="id">
      <body className="antialiased">
        <div className="flex h-screen bg-[var(--color-bg-main)] font-sans overflow-hidden">
          
          {/* Sidebar (Kiri) */}
          <Sidebar 
            isMobileOpen={isSidebarOpen} 
            setIsMobileOpen={setSidebarOpen} 
          />

          {/* Area Konten Utama (Kanan) */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            
            {/* Render Halaman Dinamis disini */}
            <main className="flex-1 overflow-auto p-4 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>

        </div>
      </body>
    </html>
  );
}