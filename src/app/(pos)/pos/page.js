"use client";

import { useState, useMemo } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, X, LogOut, Package, Wallet, ChevronRight, Utensils, Coffee, Shirt, Monitor, LayoutGrid, ArrowLeft, Calculator, CheckCircle } from 'lucide-react';

// Data Mock Produk
const PRODUCTS = [
  { id: 1, name: 'Premium Beef Burger', price: 65000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Ice Caramel Macchiato', price: 45000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Kaos Polos Hitam', price: 85000, category: 'Fashion', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Sneakers Putih', price: 299000, category: 'Fashion', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=60' },
  { id: 5, name: 'Smart Watch Series 7', price: 4500000, category: 'Elektronik', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=60' },
  { id: 6, name: 'Headphone Wireless', price: 1250000, category: 'Elektronik', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60' },
  { id: 7, name: 'Croissant Butter', price: 35000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=60' },
  { id: 8, name: 'Jaket Denim', price: 450000, category: 'Fashion', image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&auto=format&fit=crop&q=60' },
  { id: 9, name: 'Matcha Latte', price: 42000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&auto=format&fit=crop&q=60' },
  { id: 10, name: 'Kacamata Retro', price: 150000, category: 'Fashion', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=60' },
  { id: 11, name: 'Mechanical Keyboard', price: 850000, category: 'Elektronik', image: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=600&auto=format&fit=crop&q=60' },
  { id: 12, name: 'Salad Buah Segar', price: 55000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=60' },
];

const CATEGORIES = [
  { name: 'Semua', icon: LayoutGrid },
  { name: 'Makanan', icon: Utensils },
  { name: 'Minuman', icon: Coffee },
  { name: 'Fashion', icon: Shirt },
  { name: 'Elektronik', icon: Monitor },
];

export default function POSPage() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Payment Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState('SELECT'); // 'SELECT' | 'INPUT_CASH' | 'SUCCESS'
  const [paymentMethod, setPaymentMethod] = useState(''); // 'CASH' | 'QRIS'
  const [cashGiven, setCashGiven] = useState(0);

  // --- Logic Produk ---
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  // --- Logic Cart ---
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = cartTotal * 0.11; // PPN 11%
  const grandTotal = cartTotal + tax;
  const change = Math.max(0, cashGiven - grandTotal); // Kembalian

  // --- Payment Handlers ---
  const openPaymentModal = () => {
    setPaymentStep('SELECT');
    setPaymentMethod('');
    setCashGiven(0);
    setIsPaymentModalOpen(true);
  };

  const selectCash = () => {
    setPaymentMethod('CASH');
    setPaymentStep('INPUT_CASH');
  };

  const selectQRIS = () => {
    setPaymentMethod('QRIS');
    setPaymentStep('PROCESS_QRIS'); // Nanti logic Snap API disini
    // Simulasi langsung sukses utk QRIS sementara
    setTimeout(() => {
        setPaymentStep('SUCCESS');
    }, 2000);
  };

  const processCashPayment = () => {
    if (cashGiven >= grandTotal) {
        setPaymentStep('SUCCESS');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* --- LEFT SECTION: PRODUCT GRID --- */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between flex-shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                    <Package size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800 leading-none">POS System</h1>
                    <p className="text-xs text-gray-400 font-medium mt-1">Berkah Jaya Store</p>
                </div>
             </div>
             
             <div className="relative group ml-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Cari produk..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-gray-100 border-none rounded-2xl text-sm w-80 focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all outline-none placeholder:text-gray-400 font-medium"
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-800">Kasir 01</p>
                <div className="flex items-center gap-1 text-xs text-green-500 font-medium bg-green-50 px-2 py-0.5 rounded-lg w-fit ml-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                </div>
             </div>
             <a href="/" className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Keluar">
                <LogOut size={22} />
             </a>
          </div>
        </header>

        {/* Categories */}
        <div className="px-8 py-6 flex gap-3 overflow-x-auto no-scrollbar">
           {CATEGORIES.map((cat, idx) => {
             const Icon = cat.icon;
             return (
                <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border-2 ${
                        selectedCategory === cat.name 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-200 scale-105' 
                        : 'bg-white text-gray-500 border-transparent hover:bg-gray-100'
                    }`}
                >
                    <Icon size={18} />
                    {cat.name}
                </button>
             )
           })}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div 
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="group bg-white rounded-3xl p-3 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full"
                >
                   <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-3">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <button className="absolute bottom-2 right-2 bg-white text-orange-600 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <Plus size={18} strokeWidth={3} />
                      </button>
                   </div>
                   <div className="px-1 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-800 text-base leading-tight mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-400 font-medium mb-3">{product.category}</p>
                      <div className="mt-auto">
                          <p className="text-orange-600 font-extrabold text-lg">
                            {product.price.toLocaleString('id-ID')}
                          </p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* --- RIGHT SECTION: CART --- */}
      <div className="w-[420px] bg-white border-l border-gray-100 flex flex-col shadow-2xl z-30 relative">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-red-500 to-purple-600"></div>

         <div className="h-20 px-6 flex items-center justify-between border-b border-gray-50">
            <div>
                <h2 className="font-extrabold text-2xl text-gray-800">Order Menu</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Order #ORD-0092</p>
            </div>
            <button onClick={() => setCart([])} className="text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-bold transition-colors">
               Hapus Semua
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <div className="p-6 bg-gray-50 rounded-full animate-bounce-slow">
                     <ShoppingCart size={48} className="text-gray-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-600">Keranjang Kosong</p>
                    <p className="text-sm text-gray-400 mt-1">Pilih produk di sebelah kiri.</p>
                  </div>
               </div>
            ) : (
               cart.map(item => (
                 <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                       <div className="flex justify-between items-start">
                           <p className="font-bold text-gray-800 text-sm leading-tight line-clamp-1">{item.name}</p>
                           <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                               <X size={16} />
                           </button>
                       </div>
                       <div className="flex justify-between items-end">
                           <p className="text-orange-600 font-bold text-sm">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                           <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                              <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-gray-100 hover:text-red-500 transition-colors text-xs">
                                 <Minus size={12} />
                              </button>
                              <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-gray-100 hover:text-green-500 transition-colors text-xs">
                                 <Plus size={12} />
                              </button>
                           </div>
                       </div>
                    </div>
                 </div>
               ))
            )}
         </div>

         <div className="bg-gray-50 p-6 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
            <div className="space-y-3 mb-6">
               <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-800 font-bold">Rp {cartTotal.toLocaleString('id-ID')}</span>
               </div>
               <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Pajak (11%)</span>
                  <span className="text-gray-800 font-bold">Rp {tax.toLocaleString('id-ID')}</span>
               </div>
               <div className="border-t border-dashed border-gray-300 my-3"></div>
               <div className="flex justify-between items-end">
                  <span className="text-gray-600 font-bold">Total Tagihan</span>
                  <span className="text-2xl font-extrabold text-orange-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
               </div>
            </div>

            <button 
               disabled={cart.length === 0}
               onClick={openPaymentModal}
               className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-gray-300 hover:shadow-xl transition-all flex items-center justify-between px-6 group"
            >
               <span>Bayar Sekarang</span>
               <span className="bg-white/20 p-2 rounded-lg group-hover:translate-x-1 transition-transform">
                   <ChevronRight size={20} />
               </span>
            </button>
         </div>
      </div>

      {/* --- ADVANCED PAYMENT MODAL --- */}
      {isPaymentModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden zoom-in-95">
               
               {/* Modal Header */}
               <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    {paymentStep === 'INPUT_CASH' && (
                        <button onClick={() => setPaymentStep('SELECT')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-900">
                            {paymentStep === 'SUCCESS' ? 'Pembayaran Berhasil' : 'Pembayaran'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {paymentStep === 'SELECT' && 'Pilih metode pembayaran.'}
                            {paymentStep === 'INPUT_CASH' && 'Masukkan nominal uang tunai.'}
                            {paymentStep === 'SUCCESS' && 'Transaksi telah disimpan.'}
                        </p>
                    </div>
                  </div>
                  <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                    <X size={24}/>
                  </button>
               </div>

               <div className="p-8">
                   
                   {/* STEP 1: SELECT METHOD */}
                   {paymentStep === 'SELECT' && (
                       <>
                        <div className="text-center mb-8">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Tagihan</p>
                            <h2 className="text-4xl font-black text-gray-900">Rp {grandTotal.toLocaleString('id-ID')}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={selectCash} className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-gray-100 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-all group bg-white shadow-sm hover:shadow-md">
                                <div className="p-4 bg-green-100 text-green-600 rounded-2xl group-hover:bg-green-200 transition-colors">
                                    <Banknote size={36} />
                                </div>
                                <span className="font-bold text-gray-700 text-lg">Tunai</span>
                            </button>
                            <button onClick={selectQRIS} className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group bg-white shadow-sm hover:shadow-md">
                                <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl group-hover:bg-blue-200 transition-colors">
                                    <CreditCard size={36} />
                                </div>
                                <span className="font-bold text-gray-700 text-lg">QRIS / Debit</span>
                            </button>
                        </div>
                       </>
                   )}

                   {/* STEP 2: INPUT CASH (KALKULATOR) */}
                   {paymentStep === 'INPUT_CASH' && (
                       <div className="space-y-6">
                           <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-gray-500 font-medium">Total Belanja</span>
                                <span className="text-xl font-bold text-gray-900">Rp {grandTotal.toLocaleString('id-ID')}</span>
                           </div>

                           <div className="space-y-2">
                               <label className="text-sm font-bold text-gray-700">Uang Diterima</label>
                               <div className="relative">
                                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</div>
                                   <input 
                                        type="number" 
                                        autoFocus
                                        value={cashGiven}
                                        onChange={(e) => setCashGiven(Number(e.target.value))}
                                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-xl font-bold text-gray-900 focus:border-green-500 focus:ring-0 outline-none transition-all"
                                        placeholder="0"
                                   />
                               </div>
                           </div>

                           {/* Quick Amount Buttons */}
                           <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => setCashGiven(grandTotal)} className="py-2 px-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200">Uang Pas</button>
                                <button onClick={() => setCashGiven(50000)} className="py-2 px-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200">50.000</button>
                                <button onClick={() => setCashGiven(100000)} className="py-2 px-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200">100.000</button>
                           </div>

                           {/* Change Display */}
                           <div className={`p-4 rounded-2xl border flex justify-between items-center ${change >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <span className={`font-medium ${change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {change >= 0 ? 'Kembalian' : 'Kurang'}
                                </span>
                                <span className={`text-2xl font-black ${change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    Rp {Math.abs(change).toLocaleString('id-ID')}
                                </span>
                           </div>

                           <button 
                                disabled={cashGiven < grandTotal}
                                onClick={processCashPayment}
                                className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 shadow-lg shadow-green-200 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                           >
                                <CheckCircle size={20} />
                                Konfirmasi Bayar
                           </button>
                       </div>
                   )}

                   {/* STEP 3: SUCCESS STATE */}
                   {paymentStep === 'SUCCESS' && (
                       <div className="text-center py-8">
                           <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <CheckCircle size={48} />
                           </div>
                           <h3 className="text-2xl font-black text-gray-900 mb-2">Transaksi Berhasil!</h3>
                           <p className="text-gray-500 mb-8">Struk pembayaran telah dicetak otomatis.</p>
                           
                           <div className="bg-gray-50 p-4 rounded-2xl mb-8 text-sm">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Total</span>
                                    <span className="font-bold text-gray-900">Rp {grandTotal.toLocaleString('id-ID')}</span>
                                </div>
                                {paymentMethod === 'CASH' && (
                                    <>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-500">Tunai</span>
                                            <span className="font-bold text-gray-900">Rp {cashGiven.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                            <span className="text-gray-500 font-bold">Kembalian</span>
                                            <span className="font-bold text-green-600">Rp {change.toLocaleString('id-ID')}</span>
                                        </div>
                                    </>
                                )}
                           </div>

                           <div className="flex gap-3">
                               <button className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200">Cetak Ulang</button>
                               <button onClick={() => { setIsPaymentModalOpen(false); setCart([]); }} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800">Transaksi Baru</button>
                           </div>
                       </div>
                   )}

                   {/* STEP QRIS PLACEHOLDER */}
                   {paymentStep === 'PROCESS_QRIS' && (
                       <div className="text-center py-10">
                           <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                           <p className="text-gray-600 font-bold">Menghubungkan ke EDC / Midtrans...</p>
                       </div>
                   )}

               </div>
            </div>
         </div>
      )}

    </div>
  );
}