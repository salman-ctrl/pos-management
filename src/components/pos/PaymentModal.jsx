"use client";

import { X, Banknote, QrCode, CheckCircle } from 'lucide-react';

export default function PaymentModal({ 
    isOpen, onClose, paymentStep, setPaymentStep, paymentMethod, setPaymentMethod, 
    cashGiven, handleCashInput, isCashSufficient, change, deficit, 
    handleProcessTransaction, resetTransaction, isProcessing, isPrinting, 
    grandTotal, formatNumber 
}) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">Pembayaran</h3>
                <button onClick={onClose}><X size={24}/></button>
            </div>

            <div className="p-6 overflow-y-auto">
                
                {/* STEP 1: PILIH METODE */}
                {paymentStep === 'SELECT' && (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h2 className="text-4xl font-black text-gray-900">Rp {formatNumber(grandTotal)}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => { setPaymentMethod('CASH'); setPaymentStep('INPUT_CASH'); }} className="w-full p-4 border rounded-xl flex items-center gap-4 hover:border-green-500 hover:bg-green-50">
                                <div className="p-3 bg-green-100 text-green-600 rounded-full"><Banknote/></div>
                                <span className="font-bold text-lg">Tunai</span>
                            </button>
                            <button onClick={() => { setPaymentMethod('QRIS'); handleProcessTransaction('QRIS'); }} className="w-full p-4 border rounded-xl flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><QrCode/></div>
                                <span className="font-bold text-lg">QRIS (Midtrans)</span>
                            </button>
                        </div>
                        {isProcessing && <p className="text-center text-sm animate-pulse text-orange-500">Memproses...</p>}
                    </div>
                )}

                {/* STEP 2: INPUT CASH */}
                {paymentStep === 'INPUT_CASH' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Uang Diterima</label>
                            <input autoFocus type="text" value={cashGiven === 0 ? '' : formatNumber(cashGiven)} onChange={handleCashInput} className="w-full p-4 border-2 rounded-xl text-xl font-bold" placeholder="0"/>
                        </div>
                        <div className={`p-4 rounded-xl border flex justify-between ${isCashSufficient ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <span className="font-bold">{isCashSufficient ? 'Kembalian' : 'Kurang'}</span>
                            <span className="text-xl font-black">Rp {isCashSufficient ? formatNumber(change) : formatNumber(deficit)}</span>
                        </div>
                        <button disabled={!isCashSufficient || isProcessing} onClick={() => handleProcessTransaction('CASH')} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold disabled:bg-gray-300">Konfirmasi Bayar</button>
                    </div>
                )}

                {/* STEP 3: SUKSES */}
                {paymentStep === 'SUCCESS' && (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-2xl font-black mb-2">Lunas!</h3>
                        <p className="text-gray-500 mb-6">{isPrinting ? 'Mencetak struk...' : 'Struk berhasil dicetak.'}</p>
                        <button onClick={resetTransaction} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold">Transaksi Baru</button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}