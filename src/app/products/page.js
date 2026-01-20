import { Search, Filter, Plus, Package, Edit, Trash2, AlertTriangle } from 'lucide-react';

const PRODUCTS =[
  { id: 1, name: 'Kopi Susu Gula Aren', category: 'Minuman', price: 18000, stock: 2, status: 'active', sku: 'BV-001' },
  { id: 2, name: 'Roti Bakar Coklat', category: 'Makanan', price: 15000, stock: 0, status: 'inactive', sku: 'FD-002' },
  { id: 3, name: 'Nasi Goreng Spesial', category: 'Makanan', price: 25000, stock: 50, status: 'active', sku: 'FD-003' },
  { id: 4, name: 'Es Teh Manis', category: 'Minuman', price: 5000, stock: 100, status: 'active', sku: 'BV-004' },
  { id: 5, name: 'Cappuccino', category: 'Minuman', price: 20000, stock: 20, status: 'active', sku: 'BV-005' },
  { id: 6, name: 'Mie Goreng', category: 'Makanan', price: 18000, stock: 30, status: 'active', sku: 'FD-006' },
  { id: 7, name: 'Pisang Goreng', category: 'Makanan', price: 12000, stock: 15, status: 'active', sku: 'FD-007' },
  { id: 8, name: 'Jus Alpukat', category: 'Minuman', price: 22000, stock: 5, status: 'active', sku: 'BV-008' },
  { id: 9, name: 'Air Mineral', category: 'Minuman', price: 4000, stock: 200, status: 'active', sku: 'BV-009' },
  { id: 10, name: 'Ayam Geprek', category: 'Makanan', price: 28000, stock: 25, status: 'active', sku: 'FD-010' }
];


export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari produk (Nama, SKU)..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter size={18} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm shadow-orange-200 transition-colors">
            <Plus size={18} /> Tambah Produk
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold">Produk</th>
              <th className="px-6 py-4 font-semibold">Kategori</th>
              <th className="px-6 py-4 font-semibold">Harga</th>
              <th className="px-6 py-4 font-semibold">Stok</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {PRODUCTS.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{item.category}</td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  Rp {item.price.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  {item.stock === 0 ? (
                    <span className="text-red-500 text-xs font-bold flex items-center gap-1">
                      <AlertTriangle size={12} /> Habis
                    </span>
                  ) : item.stock < 5 ? (
                     <span className="text-orange-500 text-xs font-bold">{item.stock} Unit (Menipis)</span>
                  ) : (
                    <span className="text-gray-600">{item.stock} Unit</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-orange-50 text-gray-400 hover:text-orange-500 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}