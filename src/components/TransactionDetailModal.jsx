"use client";

import { X, Calendar, User, CreditCard, Printer, ShoppingBag } from 'lucide-react';

export default function TransactionDetailModal({ isOpen, onClose, transaction }) {
  if (!isOpen || !transaction) return null;

  const { items, payments, user, customer, store } = transaction;

  const formatRp = (num) => "Rp " + (Number(num) || 0).toLocaleString('id-ID');
  const formatDate = (dateStr) => new Date(dateStr).toLocaleString('id-ID', {
      dateStyle: 'medium', timeStyle: 'short'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
              <h3 className="font-bold text-lg text-gray-800">Detail Transaksi</h3>
              <p className="text-xs text-orange-600 font-mono font-bold">{transaction.invoiceNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
            
            <div className="flex justify-between items-center bg-blue-50 p-3 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 text-blue-700 text-sm font-bold">
                    <Calendar size={16}/>
                    {formatDate(transaction.createdAt)}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                    transaction.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                    {transaction.status}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-400 mb-1">Kasir</p>
                    <div className="flex items-center gap-2 font-medium text-gray-700 text-sm">
                        <User size={14}/> {user?.name || 'Unknown'}
                    </div>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-1">Pelanggan</p>
                    <div className="flex items-center gap-2 font-medium text-gray-700 text-sm">
                        <User size={14}/> {customer?.name || 'Umum'}
                    </div>
                </div>
            </div>

            <div>
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Item Dibeli</p>
                <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs">
                            <tr>
                                <th className="px-4 py-2">Menu</th>
                                <th className="px-4 py-2 text-center">Qty</th>
                                <th className="px-4 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="px-4 py-2">
                                        <p className="font-bold text-gray-700">{item.product?.name || 'Item Terhapus'}</p>
                                        <p className="text-xs text-gray-400">@ {formatRp(item.price)}</p>
                                    </td>
                                    <td className="px-4 py-2 text-center font-medium">{item.qty}</td>
                                    <td className="px-4 py-2 text-right font-medium">{formatRp(item.price * item.qty)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Metode Bayar</span>
                    <span className="font-bold text-gray-800 flex items-center gap-1">
                        <CreditCard size={14}/> {payments[0]?.paymentType || '-'}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatRp(transaction.subTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pajak</span>
                    <span className="font-medium text-gray-900">{formatRp(transaction.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-2 border-t border-gray-100">
                    <span className="text-gray-800">Total</span>
                    <span className="text-orange-600">{formatRp(transaction.grandTotal)}</span>
                </div>
            </div>

        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                Tutup
            </button>
            <button className="px-4 py-2 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center gap-2 transition-colors">
                <Printer size={16}/> Cetak Struk
            </button>
        </div>
      </div>
    </div>
  );
}