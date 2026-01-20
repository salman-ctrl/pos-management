import { Search, Plus, User, Phone, Mail, MoreHorizontal } from 'lucide-react';

const CUSTOMERS =[
  { id: 1, name: 'Siti Jamilah', phone: '0812-3456-7890', email: 'siti@gmail.com', totalSpent: 1540000, visits: 12, lastVisit: '19 Jan 2026' },
  { id: 2, name: 'Budi Santoso', phone: '0813-9876-5432', email: 'budi.s@yahoo.com', totalSpent: 850000, visits: 5, lastVisit: '15 Jan 2026' },
  { id: 3, name: 'Rina Wati', phone: '0857-1234-5678', email: '-', totalSpent: 320000, visits: 3, lastVisit: '10 Jan 2026' },
  { id: 4, name: 'Ahmad Dani', phone: '0811-2233-4455', email: 'ahmad.dani@outlook.com', totalSpent: 2100000, visits: 18, lastVisit: '20 Jan 2026' },
  { id: 5, name: 'Dewi Lestari', phone: '0821-3344-5566', email: 'dewi.l@gmail.com', totalSpent: 670000, visits: 6, lastVisit: '18 Jan 2026' },
  { id: 6, name: 'Andi Pratama', phone: '0819-7788-9900', email: 'andi.p@gmail.com', totalSpent: 430000, visits: 4, lastVisit: '14 Jan 2026' },
  { id: 7, name: 'Nur Aisyah', phone: '0852-1122-3344', email: 'aisyah@yahoo.com', totalSpent: 980000, visits: 9, lastVisit: '17 Jan 2026' },
  { id: 8, name: 'Rizky Maulana', phone: '0817-6655-4433', email: '-', totalSpent: 250000, visits: 2, lastVisit: '09 Jan 2026' },
 
]


export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari pelanggan (Nama, No HP)..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>
        
        {/* Add Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm shadow-orange-200 transition-colors">
          <Plus size={18} /> Tambah Pelanggan
        </button>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CUSTOMERS.map((customer) => (
          <div key={customer.id} className="card-base p-6 hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-lg border border-orange-100">
                {customer.name.charAt(0)}
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <h4 className="font-bold text-gray-800 text-lg mb-1">{customer.name}</h4>
            
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                <span className="truncate max-w-[150px]">{customer.email}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Total Belanja</p>
                <p className="font-semibold text-gray-800">Rp {(customer.totalSpent / 1000).toFixed(0)}k</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-0.5">Kunjungan</p>
                <p className="font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg inline-block">
                  {customer.visits}x
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}