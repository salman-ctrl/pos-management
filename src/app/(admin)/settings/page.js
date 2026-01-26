"use client";

import { useState, useEffect } from 'react';
import { 
  Save, Store, CreditCard, ShieldCheck, UploadCloud, 
  Receipt, Printer, Smartphone, DollarSign, Loader2, Image as ImageIcon 
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SettingsPage() {
  const { settings, fetchDataMaster } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    storeName: '',
    phone: '',
    address: '',
    email: '',
    website: '',
    enableCash: true,
    enableQris: false,
    enableDebit: false,
    taxRate: 0,
    serviceCharge: 0,
    autoPrintReceipt: true,
    receiptFooter: '',
    logoFile: null
  });

  const [logoPreview, setLogoPreview] = useState('');

  const [passForm, setPassForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchDataMaster(); 
  }, []);

  useEffect(() => {
    if (settings) {
      setForm({
        storeName: settings.storeName || '',
        phone: settings.phone || '',
        address: settings.address || '',
        email: settings.email || '',
        website: settings.website || '',
        enableCash: settings.enableCash,
        enableQris: settings.enableQris,
        enableDebit: settings.enableDebit,
        taxRate: Number(settings.taxRate) || 0,
        serviceCharge: Number(settings.serviceCharge) || 0,
        autoPrintReceipt: settings.autoPrintReceipt,
        receiptFooter: settings.receiptFooter || '',
        logoFile: null
      });
      if (settings.logoUrl) {
          setLogoPreview(settings.logoUrl.startsWith('http') ? settings.logoUrl : `${API_URL}${settings.logoUrl}`);
      }
    }
  }, [settings]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name) => {
    setForm(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, logoFile: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        Object.keys(form).forEach(key => {
            if (key !== 'logoFile') {
                formData.append(key, form[key]);
            }
        });

        if (form.logoFile) {
            formData.append('logo', form.logoFile);
        }

        const res = await fetch(`${API_URL}/api/settings`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (!res.ok) throw new Error("Gagal menyimpan pengaturan");
        
        await fetchDataMaster(); 
        alert("Pengaturan berhasil disimpan!");

    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passForm.newPassword !== passForm.confirmPassword) {
        return alert("Konfirmasi password tidak cocok!");
    }
    
    setIsLoading(true);
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/auth/change-password`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                oldPassword: passForm.oldPassword,
                newPassword: passForm.newPassword
            })
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        alert("Password berhasil diubah! Silakan login ulang.");
        setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });

    } catch (error) {
        alert("Gagal: " + error.message);
    } finally {
        setIsLoading(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
        activeTab === id 
          ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-transparent'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pengaturan</h2>
          <p className="text-gray-400 text-sm">Kelola profil toko, pembayaran, dan sistem.</p>
        </div>
        {activeTab !== 'security' && (
            <button 
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-200 transition-colors font-medium disabled:opacity-70"
            >
                {isLoading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
                Simpan Perubahan
            </button>
        )}
      </div>

      <div className="flex gap-2 border-b border-gray-100 pb-2 overflow-x-auto no-scrollbar">
        <TabButton id="general" label="Profil Toko" icon={Store} />
        <TabButton id="payment" label="Pembayaran" icon={CreditCard} />
        <TabButton id="system" label="Sistem & Struk" icon={Receipt} />
        <TabButton id="security" label="Keamanan" icon={ShieldCheck} />
      </div>

      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-1">
            <div className="card-base p-6 text-center h-full">
                <h3 className="font-bold text-gray-800 mb-4">Logo Struk</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl h-48 flex flex-col items-center justify-center bg-gray-50 hover:bg-orange-50 hover:border-orange-200 transition-colors cursor-pointer group relative overflow-hidden">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    />
                    {logoPreview ? (
                        <img src={logoPreview} alt="Logo Toko" className="w-full h-full object-contain p-2" />
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Store size={32} className="text-orange-500" />
                            </div>
                            <p className="text-xs text-gray-500 font-medium">Klik untuk upload logo</p>
                            <p className="text-[10px] text-gray-400 mt-1">Format: JPG, PNG (Max 2MB)</p>
                        </>
                    )}
                </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card-base p-6 space-y-5">
                <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3">Informasi Dasar</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
                        <input name="storeName" value={form.storeName} onChange={handleChange} type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                        <input name="phone" value={form.phone} onChange={handleChange} type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                    <textarea name="address" value={form.address} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Toko</label>
                        <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website / Sosmed</label>
                        <input name="website" value={form.website} onChange={handleChange} type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all bg-gray-50/50 focus:bg-white" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="card-base p-6">
                <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Metode Pembayaran Aktif</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors bg-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl"><DollarSign size={24} /></div>
                            <div>
                                <p className="font-bold text-gray-800">Tunai (Cash)</p>
                                <p className="text-xs text-gray-500">Terima pembayaran uang fisik</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={form.enableCash} onChange={() => handleToggle('enableCash')} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors bg-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Smartphone size={24} /></div>
                            <div>
                                <p className="font-bold text-gray-800">QRIS (Midtrans)</p>
                                <p className="text-xs text-gray-500">Scan barcode otomatis</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={form.enableQris} onChange={() => handleToggle('enableQris')} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors bg-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><CreditCard size={24} /></div>
                            <div>
                                <p className="font-bold text-gray-800">EDC / Debit</p>
                                <p className="text-xs text-gray-500">Mesin EDC Bank (Manual Input)</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={form.enableDebit} onChange={() => handleToggle('enableDebit')} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="card-base p-6">
                <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Konfigurasi Keuangan</h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-gray-800 text-sm">Pajak (PPN)</p>
                            <p className="text-xs text-gray-500">Persentase pajak yang ditanggung pelanggan.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" name="taxRate" value={form.taxRate} onChange={handleChange} className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-right font-bold focus:border-orange-500 outline-none" />
                            <span className="text-sm font-bold text-gray-600">%</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-gray-800 text-sm">Service Charge</p>
                            <p className="text-xs text-gray-500">Biaya layanan tambahan (opsional).</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" name="serviceCharge" value={form.serviceCharge} onChange={handleChange} className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-right font-bold focus:border-orange-500 outline-none" />
                            <span className="text-sm font-bold text-gray-600">%</span>
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
                            <p className="font-bold text-gray-800 text-sm">Cetak Struk Otomatis</p>
                            <p className="text-xs text-gray-500">Langsung print setelah pembayaran sukses.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={form.autoPrintReceipt} onChange={() => handleToggle('autoPrintReceipt')} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Kaki (Footer Struk)</label>
                        <input type="text" name="receiptFooter" value={form.receiptFooter} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-sm" placeholder="Contoh: Terima kasih atas kunjungan Anda!" />
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="card-base p-6 border border-red-100 bg-white">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-red-600 pb-4 border-b border-red-50">
                    <ShieldCheck size={20} /> Ganti Password Akun
                </h3>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                        <input 
                            type="password" 
                            value={passForm.oldPassword} 
                            onChange={(e) => setPassForm({...passForm, oldPassword: e.target.value})} 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-300 transition-all bg-gray-50 focus:bg-white" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                        <input 
                            type="password" 
                            value={passForm.newPassword} 
                            onChange={(e) => setPassForm({...passForm, newPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-300 transition-all bg-gray-50 focus:bg-white" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                        <input 
                            type="password" 
                            value={passForm.confirmPassword} 
                            onChange={(e) => setPassForm({...passForm, confirmPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-300 transition-all bg-gray-50 focus:bg-white" 
                        />
                    </div>
                    <div className="pt-4">
                        <button 
                            onClick={handleUpdatePassword}
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-70 flex justify-center items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin"/> : <ShieldCheck size={18}/>}
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