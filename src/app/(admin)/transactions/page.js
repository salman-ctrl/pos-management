import { Search, Filter } from 'lucide-react';

const TRANSACTIONS = [

  { id: 'INV-00123', date: '20 Jan 2026, 14:20', cashier: 'Budi Santoso', total: 45000, method: 'QRIS', status: 'PAID' },
  { id: 'INV-00122', date: '20 Jan 2026, 14:15', cashier: 'Siti Aminah', total: 120000, method: 'CASH', status: 'PAID' },
  { id: 'INV-00121', date: '20 Jan 2026, 13:58', cashier: 'Budi Santoso', total: 32500, method: 'CASH', status: 'PENDING' },
  { id: 'INV-00120', date: '20 Jan 2026, 13:45', cashier: 'Andi Pratama', total: 78000, method: 'QRIS', status: 'PAID' },
  { id: 'INV-00119', date: '20 Jan 2026, 13:30', cashier: 'Siti Aminah', total: 56000, method: 'CASH', status: 'PAID' },
  { id: 'INV-00118', date: '20 Jan 2026, 13:12', cashier: 'Budi Santoso', total: 99000, method: 'QRIS', status: 'PAID' },
  { id: 'INV-00117', date: '20 Jan 2026, 12:55', cashier: 'Andi Pratama', total: 41000, method: 'CASH', status: 'PENDING' },
  { id: 'INV-00116', date: '20 Jan 2026, 12:40', cashier: 'Siti Aminah', total: 150000, method: 'QRIS', status: 'PAID' },
  { id: 'INV-00115', date: '20 Jan 2026, 12:25', cashier: 'Budi Santoso', total: 67000, method: 'CASH', status: 'PAID' },
  { id: 'INV-00114', date: '20 Jan 2026, 12:10', cashier: 'Andi Pratama', total: 23000, method: 'CASH', status: 'PAID' },
];

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        {/* Summary Stats Mini */}
        <div className="flex gap-4 overflow-x-auto pb-2 sm:pb-0">
          <div className="text-center px-4 border-r border-gray-100">
            <p className="text-xs text-gray-500 uppercase">Total Omzet</p>
            <p className="text-lg font-bold text-gray-800">Rp 5.240.000</p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs text-gray-500 uppercase">Total Transaksi</p>
            <p className="text-lg font-bold text-gray-800">48</p>
          </div>
        </div>
        
        {/* Search & Filter */}
        <div className="flex gap-2">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="No. Invoice..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500" />
           </div>
           <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm transition-colors">
             <Filter size={16} /> Filter
           </button>
        </div>
      </div>

      <div className="card-base overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold">Invoice</th>
              <th className="px-6 py-4 font-semibold">Waktu</th>
              <th className="px-6 py-4 font-semibold">Kasir</th>
              <th className="px-6 py-4 font-semibold">Metode</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {TRANSACTIONS.map((trx) => (
              <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-orange-600">{trx.id}</td>
                <td className="px-6 py-4 text-gray-500 text-xs">{trx.date}</td>
                <td className="px-6 py-4 text-gray-800">{trx.cashier}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">{trx.method}</span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-800">
                  Rp {trx.total.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trx.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {trx.status === 'PAID' ? 'Lunas' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-orange-500 font-medium text-xs">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}