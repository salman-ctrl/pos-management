export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pengaturan Toko</h2>
        <p className="text-gray-400 text-sm">Konfigurasi informasi toko dan sistem.</p>
      </div>

      {/* Profile Toko */}
      <div className="card-base p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Informasi Umum</h3>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
            <input type="text" defaultValue="Warung Berkah Jaya" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50" defaultValue="Jl. Sudirman No. 45, Jakarta Selatan" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
            <input type="text" defaultValue="0812-3456-7890" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50" />
          </div>
        </div>
      </div>

      {/* Konfigurasi Sistem */}
      <div className="card-base p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Konfigurasi Transaksi</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Pajak (PPN)</p>
              <p className="text-xs text-gray-500">Otomatis tambahkan pajak di setiap struk.</p>
            </div>
            <div className="flex items-center gap-2">
               <input type="number" defaultValue={11} className="w-16 px-2 py-1 border border-gray-200 rounded text-right bg-gray-50" />
               <span className="text-gray-500">%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div>
              <p className="font-medium text-gray-800">Cetak Struk Otomatis</p>
              <p className="text-xs text-gray-500">Langsung print setelah pembayaran selesai.</p>
            </div>
             <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-200 transition-colors">
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}