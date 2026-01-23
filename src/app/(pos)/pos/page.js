"use client";

import { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, X, LogOut, Package, ChevronRight, Utensils, Coffee, IceCream, Beef, LayoutGrid, ArrowLeft, CheckCircle, User, UserPlus, Crown, Percent, Search as SearchIcon, ChefHat, QrCode, Printer, AlertCircle, ShieldCheck, ChevronLeft, ArrowRight } from 'lucide-react';


const PRODUCTS =  [
  { id: 1, name: 'Nasi Goreng Spesial', category: 'Makanan Berat', price: 35000, costPrice: 15000, stock: 45, status: 'active', sku: 'FOOD-001', image: 'https://ik.imagekit.io/dcjlghyytp1/https://sayurbox-blog-stage.s3.amazonaws.com/uploads/2020/07/fried-2509089_1920.jpg?tr=f-auto', size: 'large' },
  { id: 2, name: 'Es Kopi Susu Gula Aren', category: 'Minuman', price: 22000, costPrice: 8000, stock: 120, status: 'active', sku: 'DRK-001', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=60', size: 'tall' },
  { id: 3, name: 'Ayam Bakar Madu', category: 'Makanan Berat', price: 42000, costPrice: 20000, stock: 0, status: 'inactive', sku: 'FOOD-002', image: 'https://o-cdf.oramiland.com/unsafe/cnc-magazine.oramiland.com/parenting/original_images/3_Resep_Ayam_Bakar_Madu_-2.jpg', size: 'normal' },
  { id: 4, name: 'Kentang Goreng', category: 'Snack', price: 18000, costPrice: 6000, stock: 25, status: 'active', sku: 'SNK-001', image: 'https://image.idntimes.com/post/20230712/tips-membuat-kentang-goreng-anti-lembek-dan-tetap-kriuk-resep-kentang-goreng-mcd-kentang-goreng-kfc-9cde86371d7fc78c91ae80a6ffab250e-2c28a950c10d937a546160e888ed397c.jpg', size: 'wide' },
  { id: 5, name: 'Ice Lemon Tea', category: 'Minuman', price: 15000, costPrice: 4000, stock: 50, status: 'active', sku: 'DRK-002', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 6, name: 'Burger Daging Sapi', category: 'Makanan Berat', price: 45000, costPrice: 22000, stock: 15, status: 'active', sku: 'FOOD-003', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 7, name: 'Spaghetti Carbonara', category: 'Makanan Berat', price: 38000, costPrice: 16000, stock: 10, status: 'active', sku: 'FOOD-004', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 8, name: 'Pancake Strawberry', category: 'Dessert', price: 25000, costPrice: 9000, stock: 20, status: 'active', sku: 'DST-001', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=60', size: 'tall' },
  { id: 9, name: 'Jus Alpukat', category: 'Minuman', price: 20000, costPrice: 8000, stock: 8, status: 'active', sku: 'DRK-003', image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 10, name: 'Dimsum Ayam (4pcs)', category: 'Snack', price: 20000, costPrice: 10000, stock: 40, status: 'active', sku: 'SNK-002', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=60', size: 'wide' },
  { id: 11, name: 'Steak Sapi Lada Hitam', category: 'Makanan Berat', price: 85000, costPrice: 45000, stock: 5, status: 'active', sku: 'FOOD-005', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&auto=format&fit=crop&q=60', size: 'large' },
  { id: 12, name: 'Chocolate Lava Cake', category: 'Dessert', price: 30000, costPrice: 12000, stock: 18, status: 'active', sku: 'DST-002', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=60', size: 'normal' },
  { id: 14, name: 'Onion Rings', category: 'Snack', price: 15000, costPrice: 5000, stock: 22, status: 'active', sku: 'SNK-003', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&auto=format&fit=crop&q=60', size: 'normal' },
];

const CATEGORIES = [
  { name: 'Semua', icon: LayoutGrid },
  { name: 'Makanan Berat', icon: Utensils },
  { name: 'Minuman', icon: Coffee },
  { name: 'Snack', icon: ChefHat },
  { name: 'Dessert', icon: IceCream },
];

const MEMBERS = [
    { id: 'MBR-001', name: 'Sultan Andara', type: 'VIP', discount: 0.10 },
    { id: 'MBR-002', name: 'Clarissa Putri', type: 'Member', discount: 0.05 },
    { id: 'MBR-003', name: 'Dimas Anggara', type: 'Member', discount: 0.05 },
];

export default function POSPage() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Mobile View State ('menu' | 'cart' | 'payment')
  const [mobileView, setMobileView] = useState('menu');

  // Member State
  const [selectedMember, setSelectedMember] = useState(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');

  // Payment States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState('SELECT'); 
  const [paymentMethod, setPaymentMethod] = useState(''); 
  const [cashGiven, setCashGiven] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);

  // --- Logic Produk ---
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  const filteredMembers = useMemo(() => {
      if(!memberSearch) return MEMBERS;
      return MEMBERS.filter(m => 
        m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
        m.id.toLowerCase().includes(memberSearch.toLowerCase())
      );
  }, [memberSearch]);

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

  // --- Calculations ---
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = selectedMember ? subTotal * selectedMember.discount : 0;
  const taxableAmount = subTotal - discountAmount;
  const tax = taxableAmount * 0.11; // PPN 11%
  const grandTotal = taxableAmount + tax;
  
  const deficit = Math.max(0, grandTotal - cashGiven);
  const change = Math.max(0, cashGiven - grandTotal);
  const isCashSufficient = cashGiven >= grandTotal;

  // --- Helpers ---
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleCashInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCashGiven(Number(value));
  };

  // --- Handlers ---
  const handlePaymentOpen = () => {
    setPaymentStep('SELECT');
    setPaymentMethod('');
    setCashGiven(0);
    setIsPaymentModalOpen(true);
  }

  const handleMemberSelect = (member) => {
      setSelectedMember(member);
      setIsMemberModalOpen(false);
      setMemberSearch('');
  }

  const handlePrintReceipt = () => {
      setIsPrinting(true);
      console.log("Mengirim data ke printer..."); 
      setTimeout(() => {
          setIsPrinting(false);
          console.log("Struk berhasil dicetak.");
      }, 3000);
  };

  const handleCompletePayment = (method) => {
      setPaymentStep('SUCCESS');
      handlePrintReceipt();
  };

  const handleQRISPayment = () => {
      setPaymentMethod('QRIS');
      setPaymentStep('PROCESS_QRIS');
      setTimeout(() => {
          handleCompletePayment('QRIS');
      }, 4000);
  };

  const resetTransaction = () => {
      setIsPaymentModalOpen(false);
      setCart([]);
      setSelectedMember(null);
      setMobileView('menu'); // Reset view ke menu
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">
      
      {/* --- LEFT SECTION: PRODUCT GRID (Hidden on mobile if not in 'menu' view) --- */}
      <div className={`flex-1 flex flex-col min-w-0 relative ${mobileView !== 'menu' ? 'hidden lg:flex' : 'flex'}`}>
        {/* Header */}
        <header className="h-16 lg:h-20 px-4 lg:px-6 flex items-center justify-between flex-shrink-0 bg-white border-b border-gray-100 shadow-sm z-20">
          <div className="flex items-center gap-3 lg:gap-4 w-full">
             <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-lg lg:rounded-xl flex items-center justify-center text-white shadow-orange-200 shadow-lg flex-shrink-0">
                 <Utensils size={18} className="lg:hidden" />
                 <Utensils size={20} strokeWidth={2.5} className="hidden lg:block" />
             </div>
             <div className="lg:hidden flex-1">
                 <h1 className="text-lg font-bold leading-tight">POS</h1>
             </div>
             <div className="hidden lg:block">
                 <h1 className="text-xl font-bold leading-none tracking-tight">Restaurant POS</h1>
                 <p className="text-xs text-gray-400 font-medium mt-1">Savoria Bistro</p>
             </div>
             
             {/* Search Bar (Responsive) */}
             <div className="relative group flex-1 max-w-[200px] lg:max-w-xs ml-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg lg:rounded-xl text-xs lg:text-sm w-full focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400"
                />
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 ml-4">
             <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-bold">Kasir 01</span>
                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                </span>
             </div>
             <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Keluar">
                <LogOut size={20} />
             </button>
          </div>
        </header>

        {/* Categories */}
        <div className="px-4 lg:px-6 py-3 lg:py-4 flex gap-2 lg:gap-3 overflow-x-auto no-scrollbar border-b border-gray-50 bg-white/50 backdrop-blur-sm">
           {CATEGORIES.map((cat, idx) => {
             const Icon = cat.icon;
             const isActive = selectedCategory === cat.name;
             return (
                <button
                   key={idx}
                   onClick={() => setSelectedCategory(cat.name)}
                   className={`flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm font-bold transition-all whitespace-nowrap border ${
                       isActive 
                       ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                       : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                   }`}
                >
                   <Icon size={14} className={isActive ? 'text-orange-400' : 'text-gray-400'} />
                   {cat.name}
                </button>
             )
           })}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-6 bg-gray-50/50 pb-32 lg:pb-6">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5">
              {filteredProducts.map(product => (
                <div 
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="group bg-white rounded-xl lg:rounded-2xl p-2 lg:p-3 cursor-pointer hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full relative overflow-hidden"
                >
                   <div className="relative h-28 lg:h-36 w-full rounded-lg lg:rounded-xl overflow-hidden mb-2 lg:mb-3 bg-gray-100">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      {/* Overlay Add Button (Desktop Only) */}
                      <div className="hidden lg:flex absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
                          <div className="bg-white/90 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm translate-y-4 group-hover:translate-y-0 transition-transform">
                              + Tambah
                          </div>
                      </div>
                   </div>
                   <div className="flex-1 flex flex-col">
                      <p className="text-[9px] lg:text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 lg:mb-1">{product.category}</p>
                      <h3 className="font-bold text-gray-800 text-xs lg:text-sm leading-snug mb-1 lg:mb-2 line-clamp-2">{product.name}</h3>
                      <div className="mt-auto flex justify-between items-end">
                          <p className="text-orange-600 font-bold text-sm lg:text-base">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* MOBILE BOTTOM ACTION BAR (Menu View Only) */}
        <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40 transition-transform duration-300 ease-in-out ${cart.length > 0 && mobileView === 'menu' ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">{cart.reduce((a, b) => a + b.qty, 0)} Menu Dipilih</span>
                    <span className="text-lg font-black text-gray-900">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
                <button 
                    onClick={() => setMobileView('cart')} // Action: Go to Cart
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                >
                    Lanjut <ArrowRight size={18} />
                </button>
            </div>
        </div>
      </div>

      {/* --- RIGHT SECTION: CART (Visible as full screen on mobile when mobileView === 'cart') --- */}
      <div className={`w-full lg:w-[400px] bg-white border-l border-gray-100 flex-col shadow-2xl z-30 relative ${mobileView === 'menu' ? 'hidden lg:flex' : 'flex fixed inset-0 lg:static h-full'}`}>
         
         {/* Mobile Cart Header with Back Button */}
         <div className="lg:hidden px-4 py-4 border-b border-gray-100 flex items-center gap-4 bg-white">
             <button onClick={() => setMobileView('menu')} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 active:scale-95 transition-transform">
                 <ArrowLeft size={20} />
             </button>
             <h2 className="font-bold text-lg text-gray-900">Keranjang</h2>
         </div>

         {/* Member Selection Area */}
         <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-4 border-b border-gray-50">
            {selectedMember ? (
                <div className="bg-orange-50 rounded-xl p-3 flex justify-between items-center border border-orange-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
                            {selectedMember.type === 'VIP' ? <Crown size={18} fill="currentColor"/> : <User size={18}/>}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">{selectedMember.name}</p>
                            <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
                                {selectedMember.type} • Diskon {selectedMember.discount * 100}%
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedMember(null)} className="p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => setIsMemberModalOpen(true)}
                    className="w-full py-3 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all text-sm font-bold"
                >
                    <UserPlus size={18} /> Tambah Member (Opsional)
                </button>
            )}
         </div>

         {/* Cart Header (Desktop Only) */}
         <div className="hidden lg:flex px-6 py-2 items-center justify-between">
            <h2 className="font-bold text-gray-800 text-lg">Pesanan Saat Ini</h2>
            {cart.length > 0 && (
                <button onClick={() => setCart([])} className="text-[10px] text-red-500 hover:bg-red-50 px-2 py-1 rounded-md font-bold transition-colors">
                    Hapus
                </button>
            )}
         </div>

         {/* Cart Items List */}
         <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-2 space-y-3 pb-4">
            {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 opacity-50">
                  <ShoppingCart size={48} strokeWidth={1.5} />
                  <p className="text-sm font-medium">Belum ada menu dipilih</p>
               </div>
            ) : (
               cart.map(item => (
                 <div key={item.id} className="flex gap-3 group relative bg-white p-2 rounded-xl border border-transparent hover:border-gray-100 transition-colors">
                    <div className="w-16 h-16 lg:w-14 lg:h-14 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                       <div className="flex justify-between items-start mb-1">
                           <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</p>
                           <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-300 hover:text-red-500 p-1"
                            >
                                <X size={16} />
                            </button>
                       </div>
                       <p className="text-xs text-gray-400 mb-1.5">{item.category}</p>
                       <div className="flex justify-between items-center">
                           <p className="text-orange-600 font-bold text-sm">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                           
                           {/* Qty Control */}
                           <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                              <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded text-gray-500 hover:text-red-500 transition-all hover:shadow-sm">
                                  <Minus size={12} />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded text-gray-500 hover:text-green-500 transition-all hover:shadow-sm">
                                  <Plus size={12} />
                              </button>
                           </div>
                       </div>
                    </div>
                 </div>
               ))
            )}
         </div>

         {/* Bill Summary Section (Sticky Bottom) */}
         <div className="bg-gray-50 p-6 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] border-t border-gray-100 mt-auto">
            <div className="space-y-2 mb-6 text-sm">
               <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">Rp {subTotal.toLocaleString('id-ID')}</span>
               </div>
               
               {selectedMember && (
                   <div className="flex justify-between text-orange-600 animate-in fade-in slide-in-from-right-5">
                      <span className="flex items-center gap-1"><Percent size={12}/> Diskon Member</span>
                      <span className="font-bold">- Rp {discountAmount.toLocaleString('id-ID')}</span>
                   </div>
               )}

               <div className="flex justify-between text-gray-500">
                  <span>Pajak (11%)</span>
                  <span className="font-medium text-gray-900">Rp {tax.toLocaleString('id-ID')}</span>
               </div>
               
               <div className="border-t border-dashed border-gray-300 my-2"></div>
               
               <div className="flex justify-between items-end">
                  <span className="text-gray-900 font-bold text-base">Total Tagihan</span>
                  <span className="text-2xl font-black text-gray-900">Rp {grandTotal.toLocaleString('id-ID')}</span>
               </div>
            </div>

            <button 
               disabled={cart.length === 0}
               onClick={handlePaymentOpen}
               className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
               <span>Pembayaran</span>
               <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>

      {/* --- MODAL 1: MEMBER SEARCH --- */}
      {isMemberModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
             <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden zoom-in-95">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Cari Member</h3>
                    <button onClick={() => setIsMemberModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                </div>
                <div className="p-4">
                    <div className="relative mb-4">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            autoFocus
                            type="text"
                            placeholder="Ketik nama atau ID member..."
                            value={memberSearch}
                            onChange={(e) => setMemberSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-200"
                        />
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map(member => (
                                <button 
                                    key={member.id} 
                                    onClick={() => handleMemberSelect(member)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 border border-transparent hover:border-orange-100 group transition-all text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${member.type === 'VIP' ? 'bg-orange-400' : 'bg-blue-400'}`}>
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 group-hover:text-orange-700">{member.name}</p>
                                            <p className="text-xs text-gray-500">{member.id} • {member.type}</p>
                                        </div>
                                    </div>
                                    {member.type === 'VIP' && <Crown size={16} className="text-orange-400" fill="currentColor"/>}
                                </button>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-4 text-sm">Member tidak ditemukan.</p>
                        )}
                    </div>
                </div>
             </div>
         </div>
      )}

      {/* --- MODAL 2: PAYMENT --- */}
      {isPaymentModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden zoom-in-95 max-h-[90vh] flex flex-col">
               
               {/* Modal Header */}
               <div className="px-6 lg:px-8 py-4 lg:py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    {paymentStep === 'INPUT_CASH' && (
                        <button onClick={() => setPaymentStep('SELECT')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h3 className="text-lg lg:text-xl font-extrabold text-gray-900">
                            {paymentStep === 'SUCCESS' ? 'Pembayaran Berhasil' : 
                             paymentStep === 'PROCESS_QRIS' ? 'Midtrans Payment' : 'Metode Pembayaran'}
                        </h3>
                    </div>
                  </div>
                  <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                    <X size={24}/>
                  </button>
               </div>

               <div className="p-6 lg:p-8 overflow-y-auto">
                   
                   {/* STEP 1: SELECT METHOD */}
                   {paymentStep === 'SELECT' && (
                       <>
                        <div className="text-center mb-8">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Tagihan</p>
                            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Rp {grandTotal.toLocaleString('id-ID')}</h2>
                            {selectedMember && (
                                <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                                    Termasuk Diskon Member {selectedMember.discount * 100}%
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => { setPaymentMethod('CASH'); setPaymentStep('INPUT_CASH'); }} className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-gray-100 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-all group bg-white shadow-sm hover:shadow-md">
                                <div className="p-4 bg-green-100 text-green-600 rounded-2xl group-hover:bg-green-200 transition-colors">
                                    <Banknote size={36} />
                                </div>
                                <span className="font-bold text-gray-700 text-lg">Tunai</span>
                            </button>
                            <button onClick={handleQRISPayment} className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group bg-white shadow-sm hover:shadow-md">
                                <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl group-hover:bg-blue-200 transition-colors">
                                    <QrCode size={36} />
                                </div>
                                <span className="font-bold text-gray-700 text-lg">QRIS / E-Wallet</span>
                            </button>
                        </div>
                       </>
                   )}

                   {/* STEP 2: INPUT CASH */}
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
                                        type="text" 
                                        autoFocus
                                        value={cashGiven === 0 ? '' : formatNumber(cashGiven)}
                                        onChange={handleCashInput}
                                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-xl font-bold text-gray-900 focus:border-green-500 focus:ring-0 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="0"
                                   />
                               </div>
                           </div>

                           {/* Quick Amount Buttons */}
                           <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => setCashGiven(grandTotal)} className="py-2 px-3 bg-gray-100 rounded-xl text-xs lg:text-sm font-bold text-gray-600 hover:bg-gray-200">Uang Pas</button>
                                <button onClick={() => setCashGiven(50000)} className="py-2 px-3 bg-gray-100 rounded-xl text-xs lg:text-sm font-bold text-gray-600 hover:bg-gray-200">50.000</button>
                                <button onClick={() => setCashGiven(100000)} className="py-2 px-3 bg-gray-100 rounded-xl text-xs lg:text-sm font-bold text-gray-600 hover:bg-gray-200">100.000</button>
                           </div>

                           {/* Change/Deficit Display */}
                           <div className={`p-4 rounded-2xl border flex justify-between items-center ${isCashSufficient ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <span className={`font-medium flex items-center gap-2 ${isCashSufficient ? 'text-green-700' : 'text-red-700'}`}>
                                    {isCashSufficient ? 'Kembalian' : <><AlertCircle size={18}/> Kurang</>}
                                </span>
                                <span className={`text-2xl font-black ${isCashSufficient ? 'text-green-700' : 'text-red-700'}`}>
                                    Rp {isCashSufficient ? formatNumber(change) : formatNumber(deficit)}
                                </span>
                           </div>

                           <button 
                               disabled={!isCashSufficient}
                               onClick={() => handleCompletePayment('CASH')}
                               className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 shadow-lg shadow-green-200 transition-all disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                           >
                               <CheckCircle size={20} />
                               Konfirmasi Bayar
                           </button>
                       </div>
                   )}

                   {/* STEP 2B: PROCESS QRIS (MIDTRANS STYLE) */}
                   {paymentStep === 'PROCESS_QRIS' && (
                        <div className="text-center py-6">
                            {/* Midtrans Header */}
                            <div className="flex justify-center items-center gap-2 mb-6 opacity-80">
                                <ShieldCheck className="text-blue-900" size={20} />
                                <span className="font-bold text-blue-900 tracking-tight">Midtrans</span>
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-medium">Secured</span>
                            </div>

                            <div className="relative w-56 h-56 mx-auto mb-6 bg-white p-3 rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center">
                                {/* Dummy QR Code */}
                                <QrCode size={180} className="text-gray-800" />
                                
                                {/* Midtrans Logo Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-[2px] rounded-2xl animate-pulse">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs font-bold text-blue-900">Menunggu Pembayaran...</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1 mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Scan QRIS</h3>
                                <p className="text-gray-500 text-sm">Gopay, OVO, Dana, ShopeePay, LinkAja</p>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <span>Powered by</span>
                                <span className="font-bold text-gray-600">Midtrans Payment Gateway</span>
                            </div>
                        </div>
                   )}

                   {/* STEP 3: SUCCESS STATE */}
                   {paymentStep === 'SUCCESS' && (
                       <div className="text-center py-4">
                           <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <CheckCircle size={48} />
                           </div>
                           <h3 className="text-2xl font-black text-gray-900 mb-2">Pembayaran Berhasil!</h3>
                           
                           {/* Printing Indicator */}
                           <div className="flex items-center justify-center gap-2 text-gray-500 mb-8 bg-gray-50 py-2 rounded-full w-fit mx-auto px-4">
                                {isPrinting ? (
                                    <>
                                        <Printer size={16} className="animate-pulse" />
                                        <span className="text-sm font-medium">Sedang mencetak struk otomatis...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span className="text-sm font-medium">Struk berhasil dicetak</span>
                                    </>
                                )}
                           </div>
                           
                           <div className="bg-gray-50 p-4 rounded-2xl mb-8 text-sm text-left border border-gray-100">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Total Transaksi</span>
                                    <span className="font-bold text-gray-900">Rp {formatNumber(grandTotal)}</span>
                                </div>
                                {paymentMethod === 'CASH' && (
                                    <>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-500">Tunai Diterima</span>
                                            <span className="font-bold text-gray-900">Rp {formatNumber(cashGiven)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                            <span className="text-gray-500 font-bold">Kembalian</span>
                                            <span className="font-bold text-green-600">Rp {formatNumber(change)}</span>
                                        </div>
                                    </>
                                )}
                                {paymentMethod === 'QRIS' && (
                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                        <span className="text-gray-500">Metode</span>
                                        <span className="font-bold text-blue-600 flex items-center gap-1">
                                            <ShieldCheck size={14}/> QRIS Midtrans
                                        </span>
                                    </div>
                                )}
                           </div>

                           <div className="flex gap-3">
                               <button 
                                onClick={handlePrintReceipt}
                                disabled={isPrinting}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 disabled:opacity-50"
                               >
                                   Cetak Ulang
                               </button>
                               <button onClick={resetTransaction} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800">
                                   Transaksi Baru
                               </button>
                           </div>
                       </div>
                   )}

               </div>
            </div>
         </div>
      )}

    </div>
  );
}