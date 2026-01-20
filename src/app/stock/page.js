"use client";

import { useState } from 'react';
import { ClipboardList, ArrowDownRight, ArrowUpRight, AlertTriangle, Search, Filter, X, Save, Calendar, Package } from 'lucide-react';

// Data Mock Awal
const INITIAL_STOCK_LOGS = [
  { id: 1, date: '20 Jan 2026, 10:30', product: 'Kopi Susu Gula Aren', type: 'out', qty: 5, note: 'Terjual (Trx #123)', pic: 'Budi' },
  { id: 2, date: '20 Jan 2026, 09:00', product: 'Susu UHT Full Cream', type: 'in', qty: 24, note: 'Restock Supplier', pic: 'Admin' },
  { id: 3, date: '19 Jan 2026, 14:15', product: 'Roti Tawar', type: 'adjustment', qty: -2, note: 'Expired / Rusak', pic: 'Admin' },
  { id: 4, date: '19 Jan 2026, 13:45', product: 'Gula Aren Cair', type: 'out', qty: 3, note: 'Terjual (Trx #124)', pic: 'Siti' },
  { id: 5, date: '19 Jan 2026, 11:30', product: 'Kopi Arabika Bubuk', type: 'in', qty: 10, note: 'Restock Gudang', pic: 'Admin' },
  { id: 6, date: '18 Jan 2026, 16:20', product: 'Cup Plastik 12oz', type: 'out', qty: 50, note: 'Pemakaian Harian', pic: 'Budi' },
  { id: 7, date: '18 Jan 2026, 15:00', product: 'Sedotan Kertas', type: 'in', qty: 200, note: 'Restock Supplier', pic: 'Admin' },
  { id: 8, date: '18 Jan 2026, 13:10', product: 'Es Batu', type: 'adjustment', qty: -10, note: 'Mencair', pic: 'Budi' },
  { id: 9, date: '18 Jan 2026, 11:45', product: 'Coklat Bubuk', type: 'out', qty: 2, note: 'Terjual (Trx #125)', pic: 'Siti' },
  { id: 10, date: '17 Jan 2026, 17:30', product: 'Susu UHT Full Cream', type: 'out', qty: 6, note: 'Terjual (Trx #126)', pic: 'Budi' },
  { id: 11, date: '17 Jan 2026, 15:20', product: 'Sirup Vanilla', type: 'in', qty: 12, note: 'Restock Supplier', pic: 'Admin' },
];

export default function StockPage() {
  const [logs, setLogs] = useState(INITIAL_STOCK_LOGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State Form Stock Opname
  const [formData, setFormData] = useState({
    product: '',
    type: 'adjustment',
    qty: '',
    note: '',
    pic: 'Admin' // Default PIC
  });

  // Handle Simpan Log Baru
  const handleSave = (e) => {
    e.preventDefault();
    
    // Format Waktu Sekarang
    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.getHours()}:${now.getMinutes()}`;

    const newLog = {
      id: Date.now(),
      date: dateStr,
      ...formData,
      qty: Number(formData.qty)
    };

    setLogs([newLog, ...logs]); // Add to top
    setIsModalOpen(false);
    
    // Reset Form
    setFormData({ product: '', type: 'adjustment', qty: '', note: '', pic: 'Admin' });
  };

  return (
    <div className="space-y-6">
       {/* Header Actions */}
       <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl text-sm font-medium transition-colors hover:bg-orange-100">Semua</button>
          <button className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Masuk</button>
          <button className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Keluar</button>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm transition-colors"
        >
           <ClipboardList size={18} /> Stock Opname
        </button>
      </div>

      {/* Tabel Log */}
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold">Waktu</th>
              <th className="px-6 py-4 font-semibold">Produk</th>
              <th className="px-6 py-4 font-semibold">Tipe</th>
              <th className="px-6 py-4 font-semibold">Qty</th>
              <th className="px-6 py-4 font-semibold">Keterangan</th>
              <th className="px-6 py-4 font-semibold">PIC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">{log.date}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{log.product}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${
                     log.type === 'in' ? 'bg-green-100 text-green-700' : 
                     log.type === 'out' ? 'bg-orange-100 text-orange-700' : 
                     'bg-red-100 text-red-700'
                  }`}>
                    {log.type === 'in' && <><ArrowDownRight size={12}/> Masuk</>}
                    {log.type === 'out' && <><ArrowUpRight size={12}/> Keluar</>}
                    {log.type === 'adjustment' && <><AlertTriangle size={12}/> Adjust</>}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold ${log.type === 'in' ? 'text-green-600' : 'text-gray-800'}`}>
                  {log.type === 'in' ? '+' : ''}{log.qty}
                </td>
                <td className="px-6 py-4 text-gray-600 text-xs">{log.note}</td>
                <td className="px-6 py-4 text-gray-500 text-xs">{log.pic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Modal Stock Opname --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <ClipboardList size={20} className="text-orange-500" />
                Catat Stok Opname
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required
                      type="text" 
                      value={formData.product}
                      onChange={(e) => setFormData({...formData, product: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                      placeholder="Contoh: Kopi Susu"
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Perubahan</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="in">Stok Masuk (In)</option>
                    <option value="out">Stok Keluar (Out)</option>
                    <option value="adjustment">Penyesuaian (Adjust)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Qty)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.qty}
                    onChange={(e) => setFormData({...formData, qty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan / Alasan</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="Contoh: Restock dari gudang, Barang rusak, atau Penjualan manual..."
                ></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
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
                  Simpan Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}