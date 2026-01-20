import { ClipboardList, ArrowDownRight, ArrowUpRight, AlertTriangle } from 'lucide-react';

const STOCK_LOGS = [

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
  return (
    <div className="space-y-6">
       <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl text-sm font-medium">Semua</button>
          <button className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Masuk</button>
          <button className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Keluar</button>
        </div>
        
        {/* Action Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm transition-colors">
           <ClipboardList size={18} /> Stock Opname
        </button>
      </div>

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
            {STOCK_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-500 text-xs">{log.date}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{log.product}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded text-xs font-medium ${
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
    </div>
  );
}