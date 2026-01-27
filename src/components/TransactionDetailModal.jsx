"use client";

import { X, Calendar, User, CreditCard, Printer, ShoppingBag, Store, FileText } from 'lucide-react';

export default function TransactionDetailModal({ isOpen, onClose, transaction }) {
    if (!isOpen || !transaction) return null;

    const { items, payments, user, customer } = transaction;

    const formatRp = (num) => "Rp " + (Number(num) || 0).toLocaleString('id-ID');
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // --- FUNGSI CETAK STRUK ---
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">

            {/* CSS PRINT ENGINE: 
        1. Memaksa font menjadi Monospace (Font Kasir).
        2. Menyembunyikan elemen web dan menampilkan elemen struk.
      */}
            <style>{`
        @media print {
          /* Hilangkan semua elemen UI Dashboard */
          body * { visibility: hidden; }
          
          /* Munculkan hanya area struk */
          #receipt-print, #receipt-print * { visibility: visible; }
          
          #receipt-print {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm; /* Standar Lebar Kertas Kasir */
            padding: 5mm;
            background: white;
            color: black;
            font-family: 'Courier New', Courier, monospace; /* Font Struk Supermarket */
            line-height: 1.2;
          }
          
          .no-print { display: none !important; }
          
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}</style>

            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header Modal (Kelihatan di Web, Hilang saat Print) */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 no-print">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <FileText size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Detail Transaksi</h3>
                            <p className="text-[10px] text-gray-400 font-mono font-bold uppercase">{transaction.invoiceNumber}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body (Kelihatan di Web, Hilang saat Print) */}
                <div className="p-6 overflow-y-auto space-y-6 no-print">

                    <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-700 text-sm font-bold">
                            <Calendar size={16} />
                            {formatDate(transaction.createdAt)}
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border ${transaction.status === 'PAID' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            }`}>
                            {transaction.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Kasir</p>
                            <div className="flex items-center gap-2 font-bold text-gray-700 text-xs">
                                <User size={12} /> {user?.name || 'Authorized Staff'}
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Pelanggan</p>
                            <div className="flex items-center gap-2 font-bold text-gray-700 text-xs">
                                <User size={12} /> {customer?.name || 'Umum / Guest'}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Ringkasan Pesanan</p>
                        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold">
                                    <tr>
                                        <th className="px-4 py-3">Menu</th>
                                        <th className="px-4 py-3 text-center">Qty</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-bold text-gray-700 text-xs">{item.product?.name || 'Menu Restoran'}</p>
                                                <p className="text-[9px] text-gray-400">@ {formatRp(item.price)}</p>
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold text-xs">{item.qty}</td>
                                            <td className="px-4 py-3 text-right font-black text-xs text-gray-900">{formatRp(item.price * item.qty)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-6 text-white space-y-3 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Store size={80} />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span>Metode Pembayaran</span>
                            <span className="text-orange-400 flex items-center gap-1">
                                <CreditCard size={12} /> {payments?.[0]?.paymentType || 'TUNAI'}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400 font-bold uppercase tracking-widest">Subtotal</span>
                            <span className="font-bold text-white">{formatRp(transaction.subTotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs pb-3 border-b border-white/10">
                            <span className="text-gray-400 font-bold uppercase tracking-widest">Pajak (11%)</span>
                            <span className="font-bold text-white">{formatRp(transaction.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-black uppercase tracking-tighter text-orange-500">Total Akhir</span>
                            <span className="text-2xl font-black italic">{formatRp(transaction.grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* --- RECEIPT TEMPLATE (STRUK FISIK) --- 
            Hanya muncul saat tombol Print ditekan.
            Didesain khusus untuk tampilan printer kasir.
        */}
                <div id="receipt-print" className="hidden">
                    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>SAVORIA BISTRO</h3>
                        <p style={{ fontSize: '10px', margin: '2px 0' }}>MODERN DINING EXPERIENCE</p>
                        <p style={{ fontSize: '9px', margin: '0' }}>Jl. Kemang Raya No. 12, Jakarta</p>
                        <p style={{ fontSize: '9px', margin: '0' }}>Telp: (021) 555-0123</p>
                    </div>

                    <div style={{ borderBottom: '1px dashed #000', margin: '10px 0' }}></div>

                    <div style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>INV : {transaction.invoiceNumber}</span>
                        </div>
                        <div>TGL : {formatDate(transaction.createdAt)}</div>
                        <div>KASIR: {user?.name || 'Staff'}</div>
                        <div>CUST : {customer?.name || 'Guest'}</div>
                    </div>

                    <div style={{ borderBottom: '1px dashed #000', margin: '10px 0' }}></div>

                    <div style={{ fontSize: '10px' }}>
                        {items.map((item, i) => (
                            <div key={i} style={{ marginBottom: '8px' }}>
                                <div style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{item.product?.name}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{item.qty} x {item.price.toLocaleString('id-ID')}</span>
                                    <span>{(item.qty * item.price).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderBottom: '1px dashed #000', margin: '10px 0' }}></div>

                    <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>SUBTOTAL</span>
                            <span>{transaction.subTotal.toLocaleString('id-ID')}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '5px', borderTop: '1px solid #000', paddingTop: '5px' }}>
                            <span>TOTAL</span>
                            <span>{transaction.grandTotal.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div style={{ borderBottom: '1px dashed #000', margin: '10px 0' }}></div>

                    <div style={{ textAlign: 'center', fontSize: '10px', marginTop: '15px' }}>
                        <p style={{ fontWeight: 'bold', margin: '0' }}>TERIMA KASIH</p>
                        <p style={{ margin: '5px 0' }}>Selamat Menikmati!</p>
                        <p style={{ fontSize: '8px' }}>Software by Savoria POS</p>
                    </div>
                </div>

                {/* Modal Footer (Tersembunyi saat cetak) */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 no-print">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-800 transition-colors"
                    >
                        Tutup
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2.5 text-xs font-black text-white bg-gray-950 hover:bg-orange-600 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-gray-200 uppercase tracking-widest"
                    >
                        <Printer size={16} strokeWidth={3} /> Cetak Struk
                    </button>
                </div>
            </div>
        </div>
    );
}