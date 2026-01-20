"use client";

import { useState } from 'react';
import { Save, Store, CreditCard, ShieldCheck, UploadCloud, Receipt, Printer, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  // Helper untuk komponen Tab Button
  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
        activeTab === id 
          ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pengaturan</h2>
          <p className="text-gray-400 text-sm">Kelola profil toko, pembayaran, dan sistem.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-200 transition-colors font-medium">
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-1 overflow-x-auto">
        <TabButton id="general" label="Profil Toko" icon={Store} />
        <TabButton id="payment" label="Pembayaran" icon={CreditCard} />
        <TabButton id="system" label="Sistem & Struk" icon={Receipt} />
        <TabButton id="security" label="Keamanan" icon={ShieldCheck} />
      </div>

      {/* --- CONTENT: GENERAL (PROFIL TOKO) --- */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logo Upload Section */}
          <div className="lg:col-span-1">
            <div className="card-base p-6 text-center">
                <h3 className="font-bold text-gray-800 mb-4">Logo Struk</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl h-48 flex flex-col items-center justify-center bg-gray-50 hover:bg-orange-50 hover:border-orange-200 transition-colors cursor-pointer group">
                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Store size={32} className="text-orange-500" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Klik untuk upload logo</p>
                    <p className="text-[10px] text-gray-400 mt-1">Format: JPG, PNG (Max 2MB)</p>
                </div>
            </div>
          </div>

          {/* Form Info Toko */}
          <div className="lg:col-span-2">
            <div className="card-base p-6 space-y-4">
                <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Informasi Dasar</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
                        <input type="text" defaultValue="Warung Berkah Jaya" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                        <input type="text" defaultValue="0812-3456-7890" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                    <textarea rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" defaultValue="Jl. Sudirman No. 45, Jakarta Selatan, DKI Jakarta" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Toko</label>
                        <input type="email" defaultValue="contact@berkahjaya.com" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website / Sosmed</label>
                        <input type="text" defaultValue="@berkahjaya_id" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT: PAYMENT (PEMBAYARAN) --- */}
      {activeTab === 'payment' && (
        <div className="max-w-3xl space-y-6">
            <div className="card-base p-6">
                <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Metode Pembayaran Aktif</h3>
                <div className="space-y-4">
                    {/* Tunai */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Store size={20} /></div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Tunai (Cash)</p>
                                <p className="text-xs text-gray-400">Terima pembayaran uang fisik</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 opacity-50"></div>
                        </label>
                    </div>

                    {/* QRIS */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Smartphone size={20} /></div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">QRIS Statis</p>
                                <p className="text-xs text-gray-400">Scan barcode QR toko</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>

                    {/* Debit */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><CreditCard size={20} /></div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">EDC / Debit</p>
                                <p className="text-xs text-gray-400">Mesin EDC Bank</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- CONTENT: SYSTEM (STRUK & PAJAK) --- */}
      {activeTab === 'system' && (
        <div className="max-w-3xl space-y-6">
            <div className="card-base p-6">
                <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Konfigurasi Transaksi</h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-800 text-sm">Pajak (PPN)</p>
                            <p className="text-xs text-gray-500">Otomatis tambahkan pajak di akhir total.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" defaultValue={11} className="w-16 px-3 py-1 border border-gray-200 rounded-lg text-right text-sm focus:outline-none focus:border-orange-500" />
                            <span className="text-sm font-medium text-gray-600">%</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-800 text-sm">Service Charge</p>
                            <p className="text-xs text-gray-500">Biaya layanan (opsional).</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" defaultValue={0} className="w-16 px-3 py-1 border border-gray-200 rounded-lg text-right text-sm focus:outline-none focus:border-orange-500" />
                            <span className="text-sm font-medium text-gray-600">%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-base p-6">
                <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
                    <Printer size={18} /> Pengaturan Struk
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                            <p className="font-medium text-gray-800 text-sm">Cetak Struk Otomatis</p>
                            <p className="text-xs text-gray-500">Langsung print setelah pembayaran sukses.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Kaki (Footer Struk)</label>
                        <input type="text" defaultValue="Terima kasih telah berbelanja!" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-sm" />
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- CONTENT: SECURITY (KEAMANAN) --- */}
      {activeTab === 'security' && (
        <div className="max-w-2xl">
            <div className="card-base p-6 border border-red-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-red-600">
                    <ShieldCheck size={20} /> Ganti Password Admin
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                        <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                        <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                        <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" />
                    </div>
                    <div className="pt-2">
                        <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                            Update Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}