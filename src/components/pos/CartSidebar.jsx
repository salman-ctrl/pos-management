"use client";

import { ArrowLeft, LogOut, X, UserPlus, ShoppingCart, Utensils, Minus, Plus, User, ChevronRight } from 'lucide-react';

export default function CartSidebar({ 
    cart, 
    mobileView, 
    setMobileView, 
    selectedMember, 
    setSelectedMember, 
    setIsMemberModalOpen, 
    removeFromCart, 
    updateQty, 
    handlePaymentOpen, 
    setCart,
    handleLogout,
    getImageUrl,
    grandTotal,
    subTotal,
    taxAmount
}) {
  return (
    <div className={`w-full lg:w-[400px] bg-white border-l border-gray-100 flex-col shadow-2xl z-30 relative ${mobileView === 'menu' ? 'hidden lg:flex' : 'flex fixed inset-0 lg:static h-full'}`}>
        
        {/* Cart Header */}
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-white flex-shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={() => setMobileView('menu')} className="lg:hidden p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 active:scale-95 transition-transform">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="font-bold text-lg text-gray-800">Pesanan</h2>
            </div>
            
            <div className="flex items-center gap-3">
                {/* Logout Mobile */}
                <button onClick={handleLogout} className="lg:hidden text-gray-400 hover:text-red-500">
                    <LogOut size={18}/>
                </button>
                {cart.length > 0 && (
                    <button onClick={() => setCart([])} className="text-sm text-red-500 font-bold hover:text-red-600 transition-colors">
                        Hapus
                    </button>
                )}
            </div>
        </div>

        {/* Member Selection Area */}
        <div className="px-6 py-2 border-b border-gray-50">
            {selectedMember ? (
                <div className="flex items-center justify-between text-sm bg-orange-50 text-orange-700 px-3 py-2 rounded-lg border border-orange-100">
                    <span className="font-bold flex items-center gap-2"><User size={14}/> {selectedMember.name}</span>
                    <button onClick={()=>setSelectedMember(null)}><X size={14}/></button>
                </div>
            ) : (
                <button onClick={() => setIsMemberModalOpen(true)} className="text-xs flex items-center gap-1 text-gray-500 hover:text-orange-500 transition-colors w-full justify-center py-2 border border-dashed rounded-lg border-gray-200 hover:border-orange-200">
                    <UserPlus size={14}/> Tambah Pelanggan
                </button>
            )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-4">
                    <ShoppingCart size={64} strokeWidth={1} />
                    <p className="font-medium">Keranjang kosong</p>
                </div>
            ) : (
                cart.map(item => (
                    <div key={item.id} className="flex gap-4 p-3 rounded-2xl border border-gray-100 bg-white hover:border-orange-100 transition-colors relative group">
                        {/* Image */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                            {item.imageUrl ? (
                                <img src={getImageUrl(item.imageUrl)} className="w-full h-full object-cover" alt={item.name} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300"><Utensils size={24}/></div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-snug pr-6">{item.name}</h3>
                                    <button 
                                        onClick={() => removeFromCart(item.id)} 
                                        className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{item.category ? item.category.name : 'Menu'}</p>
                            </div>
                            
                            <div className="flex justify-between items-end mt-2">
                                <p className="text-orange-600 font-bold text-sm">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                                
                                {/* Qty Control */}
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                                    <button onClick={() => updateQty(item.id, -1)} className="text-gray-500 hover:text-orange-600 transition-colors"><Minus size={14} /></button>
                                    <span className="text-sm font-bold w-4 text-center text-gray-800">{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)} className="text-gray-500 hover:text-orange-600 transition-colors"><Plus size={14} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer Summary */}
        <div className="bg-gray-50 p-6 rounded-t-3xl border-t border-gray-100 mt-auto shadow-[0_-5px_30px_rgba(0,0,0,0.02)]">
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">Rp {subTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Pajak (11%)</span>
                    <span className="font-medium text-gray-900">Rp {taxAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-gray-900 font-bold text-lg">Total Tagihan</span>
                    <span className="text-2xl font-black text-gray-900">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
            </div>
            
            <button 
                disabled={cart.length === 0}
                onClick={handlePaymentOpen}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
                Pembayaran <ChevronRight size={20} />
            </button>
        </div>
    </div>
  );
}