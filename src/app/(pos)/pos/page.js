"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import Components
import Header from '@/components/pos/Header';
import CategoryFilter from '@/components/pos/CategoryFilter';
import ProductGrid from '@/components/pos/ProductGrid';
import CartSidebar from '@/components/pos/CartSidebar';
import MemberModal from '@/components/pos/MemberModal';
import PaymentModal from '@/components/pos/PaymentModal';

// Import SweetAlert
import { showAlert } from '@/utils/swal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

export default function POSPage() {
    const router = useRouter();

    // --- STATE DATA ---
    const [products, setProducts] = useState([]);
    const [members, setMembers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [storeSettings, setStoreSettings] = useState(null);

    // --- STATE UI ---
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
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
    const [isProcessing, setIsProcessing] = useState(false);

    // --- LOGIKA UTAMA: Data Struk ---
    const [lastTrxData, setLastTrxData] = useState(null);
    const [triggerPrint, setTriggerPrint] = useState(false);

    // --- 1. FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');

                if (userStr) setCurrentUser(JSON.parse(userStr));

                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                const [prodRes, catRes, memRes, setRes] = await Promise.all([
                    fetch(`${API_URL}/api/products`, { headers }),
                    fetch(`${API_URL}/api/products/categories`, { headers }),
                    fetch(`${API_URL}/api/customers`, { headers }),
                    fetch(`${API_URL}/api/settings`, { headers })
                ]);

                const prodData = await prodRes.json();
                const catData = await catRes.json();
                const memData = await memRes.json();
                const setData = await setRes.json();

                if (prodData.success) setProducts(prodData.data);
                if (catData.success) setCategories([{ id: 0, name: 'Semua' }, ...catData.data]);
                if (memData.success) setMembers(memData.data);
                if (setData.success) setStoreSettings(setData.data);

            } catch (error) {
                console.error("Error fetching:", error);
                showAlert.error("Gagal Memuat Data", "Cek koneksi backend.");
            }
        };
        fetchData();

        // Load Midtrans
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
        document.body.appendChild(script);

        return () => { if (document.body.contains(script)) document.body.removeChild(script); }
    }, []);

    // --- 2. PRINT SYNCHRONIZER (MENGATASI STRUK KOSONG) ---
    useEffect(() => {
        if (triggerPrint && lastTrxData) {
            // Kita beri waktu 1 detik agar React selesai render item ke dalam DOM struk
            const timer = setTimeout(() => {
                window.print();
                setTriggerPrint(false);
                setIsPrinting(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [triggerPrint, lastTrxData]);

    // --- LOGIC FILTER ---
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase());
            const categoryName = p.category ? p.category.name : 'Uncategorized';
            const matchCategory = selectedCategory === 'Semua' || categoryName === selectedCategory;
            return matchSearch && matchCategory;
        });
    }, [search, selectedCategory, products]);

    const filteredMembers = useMemo(() => {
        if (!memberSearch) return members;
        return members.filter(m =>
            (m.name || '').toLowerCase().includes(memberSearch.toLowerCase()) ||
            (m.phone || '').includes(memberSearch)
        );
    }, [memberSearch, members]);

    // --- LOGIC CART ---
    const addToCart = (product) => {
        if (product.stock <= 0) return showAlert.warning("Stok Habis", "Produk ini tidak bisa dipilih.");
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            if (existing.qty + 1 > product.stock) return showAlert.warning("Stok Terbatas", "Jumlah melebihi stok.");
            setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const master = products.find(p => p.id === id);
                if (delta > 0 && item.qty + 1 > master.stock) return item;
                return { ...item, qty: Math.max(0, item.qty + delta) };
            }
            return item;
        }).filter(item => item.qty > 0));
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

    // --- CALCULATIONS (DINAMIS DARI SETTINGS) ---
    const subTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
    const serviceRate = storeSettings?.serviceCharge ? Number(storeSettings.serviceCharge) / 100 : 0.01; // 1%
    const taxRate = storeSettings?.taxRate ? Number(storeSettings.taxRate) / 100 : 0.14; // 14%

    const serviceAmount = Math.round(subTotal * serviceRate);
    const taxAmount = Math.round((subTotal + serviceAmount) * taxRate);
    const grandTotal = subTotal + serviceAmount + taxAmount;

    const deficit = Math.max(0, grandTotal - cashGiven);
    const change = Math.max(0, cashGiven - grandTotal);
    const isCashSufficient = cashGiven >= grandTotal;

    // --- TRANSAKSI ---
    const handleProcessTransaction = async (type) => {
        setIsProcessing(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                userId: currentUser?.id || 1,
                customerId: selectedMember ? selectedMember.id : null,
                items: cart.map(c => ({ productId: c.id, qty: c.qty })),
                payment: { type: type, amount: grandTotal }
            };

            const res = await fetch(`${API_URL}/api/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            const resJson = await res.json();
            if (!resJson.success) throw new Error(resJson.message);

            // SIMPAN DATA & TRIGGER PRINT
            setLastTrxData(resJson.data);

            if (type === 'QRIS' && resJson.data.midtransToken) {
                window.snap.pay(resJson.data.midtransToken, {
                    onSuccess: function (result) {
                        setPaymentStep('SUCCESS');
                        if (resJson.data.store?.autoPrintReceipt) {
                            setIsPrinting(true);
                            setTriggerPrint(true);
                        }
                        showAlert.success("Lunas!", "Pembayaran QRIS Berhasil.");
                    },
                    onPending: function (result) {
                        setPaymentStep('SUCCESS');
                        setIsPrinting(true);
                        setTriggerPrint(true);
                    },
                    onError: () => showAlert.error("Gagal", "Pembayaran gagal."),
                    onClose: () => showAlert.warning("Batal", "Popup ditutup.")
                });
            } else {
                setPaymentStep('SUCCESS');
                if (resJson.data.store?.autoPrintReceipt) {
                    setIsPrinting(true);
                    setTriggerPrint(true);
                }
                showAlert.success("Berhasil", "Transaksi tunai dicatat.");
            }
        } catch (error) {
            showAlert.error("Gagal", error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const resetTransaction = () => {
        setCart([]);
        setSelectedMember(null);
        setIsPaymentModalOpen(false);
        setLastTrxData(null);
        window.location.reload();
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">

            {/* --- CSS PRINT ENGINE: Didesain agar data TIDAK KOSONG --- */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #receipt-print, #receipt-print * { visibility: visible; }
                    #receipt-print {
                        display: block !important;
                        position: absolute;
                        left: 0; top: 0;
                        width: 58mm; /* Ukuran printer thermal standar */
                        padding: 3mm;
                        background: white;
                        color: black;
                        font-family: 'Courier New', Courier, monospace;
                        font-size: 10px;
                        line-height: 1.3;
                    }
                    @page { margin: 0; size: auto; }
                }
            `}</style>

            {/* KIRI: MENU */}
            <div className={`flex-1 flex flex-col min-w-0 relative ${mobileView !== 'menu' ? 'hidden lg:flex' : 'flex'}`}>
                <Header search={search} setSearch={setSearch} currentUser={currentUser} />
                <CategoryFilter categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50/50 pb-32 lg:pb-6">
                    <ProductGrid products={filteredProducts} addToCart={addToCart} getImageUrl={(p) => p.startsWith('http') ? p : `${API_URL}${p}`} />
                </div>
            </div>

            {/* KANAN: CART SIDEBAR */}
            <CartSidebar
                cart={cart}
                mobileView={mobileView}
                setMobileView={setMobileView}
                selectedMember={selectedMember}
                setSelectedMember={setSelectedMember}
                setIsMemberModalOpen={setIsMemberModalOpen}
                removeFromCart={removeFromCart}
                updateQty={updateQty}
                handlePaymentOpen={() => setIsPaymentModalOpen(true)}
                setCart={setCart}
                getImageUrl={(p) => p.startsWith('http') ? p : `${API_URL}${p}`}
                grandTotal={grandTotal}
                subTotal={subTotal}
                taxAmount={taxAmount}
                taxRate={taxRate * 100} // Menampilkan 14% sesuai settings
                handleLogout={() => { if (confirm('Keluar?')) { localStorage.clear(); router.push('/login'); } }}
            />

            {/* MODALS */}
            <MemberModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} memberSearch={memberSearch} setMemberSearch={setMemberSearch} filteredMembers={filteredMembers} handleMemberSelect={(m) => { setSelectedMember(m); setIsMemberModalOpen(false); }} getImageUrl={(p) => p.startsWith('http') ? p : `${API_URL}${p}`} />
            <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} paymentStep={paymentStep} setPaymentStep={setPaymentStep} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} cashGiven={cashGiven} handleCashInput={(e) => setCashGiven(Number(e.target.value.replace(/\D/g, '')))} isCashSufficient={isCashSufficient} change={change} deficit={deficit} handleProcessTransaction={handleProcessTransaction} resetTransaction={resetTransaction} isProcessing={isProcessing} isPrinting={isPrinting} grandTotal={grandTotal} formatNumber={(n) => n.toLocaleString('id-ID')} />

            {/* --- TEMPLATE STRUK FISIK (FIXED: Visible hanya saat print) --- */}
            {lastTrxData && (
                <div id="receipt-print" style={{ display: 'none' }}>
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                        {lastTrxData.store?.logoUrl && (
                            <img src={lastTrxData.store.logoUrl} alt="Logo" style={{ maxWidth: '35mm', marginBottom: '5px' }} />
                        )}
                        <h2 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase' }}>{lastTrxData.store?.storeName || 'NANDS STORE'}</h2>
                        <p style={{ fontSize: '8px', margin: '2px 0' }}>{lastTrxData.store?.address || 'Jakarta, Indonesia'}</p>
                    </div>

                    <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

                    <div style={{ fontSize: '9px' }}>
                        <div>INV : {lastTrxData.transaction.invoiceNumber}</div>
                        <div>TGL : {new Date(lastTrxData.transaction.createdAt).toLocaleString('id-ID')}</div>
                        <div>KASIR: {lastTrxData.transaction.user?.name || 'Staff'}</div>
                        <div>CUST : {lastTrxData.transaction.customer?.name || 'UMUM'}</div>
                    </div>

                    <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

                    <div style={{ fontSize: '9px' }}>
                        {lastTrxData.transaction.items.map((item, i) => (
                            <div key={i} style={{ marginBottom: '5px' }}>
                                <div style={{ fontWeight: 'bold' }}>{item.product?.name}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{item.qty} x {Number(item.price).toLocaleString()}</span>
                                    <span>{(item.qty * Number(item.price)).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

                    <div style={{ fontSize: '9px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Subtotal</span>
                            <span>{Number(lastTrxData.transaction.subTotal).toLocaleString()}</span>
                        </div>
                        {/* Sinkron dengan Settingan 1% dan 14% */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Service (1%)</span>
                            <span>{Math.round(lastTrxData.transaction.subTotal * 0.01).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Pajak (14%)</span>
                            <span>{Number(lastTrxData.transaction.taxAmount).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11px', marginTop: '5px' }}>
                            <span>TOTAL AKHIR</span>
                            <span>Rp {Number(lastTrxData.transaction.grandTotal).toLocaleString()}</span>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

                    <div style={{ textAlign: 'center', fontSize: '8px' }}>
                        <p>{lastTrxData.store?.receiptFooter || 'Terima kasih, salam sejahtera'}</p>
                        <p style={{ marginTop: '5px', opacity: 0.5 }}>Powered by Nands POS</p>
                    </div>
                </div>
            )}
        </div>
    );
}