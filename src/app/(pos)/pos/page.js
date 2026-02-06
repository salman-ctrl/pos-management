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

    // Data Struk Terakhir
    const [lastTrxData, setLastTrxData] = useState(null);

    // --- 1. FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');

                if (userStr) {
                    setCurrentUser(JSON.parse(userStr));
                }

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
                console.error("Error fetching data:", error);
                showAlert.error("Gagal Memuat Data", "Cek koneksi backend.");
            }
        };

        fetchData();

        // Load Midtrans
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) document.body.removeChild(script);
        }
    }, []);

    // --- LOGIC FILTER ---
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const categoryName = p.category ? p.category.name : 'Uncategorized';
            const matchCategory = selectedCategory === 'Semua' || categoryName === selectedCategory;
            return matchSearch && matchCategory;
        });
    }, [search, selectedCategory, products]);

    const filteredMembers = useMemo(() => {
        if (!memberSearch) return members;
        return members.filter(m =>
            m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
            (m.memberId && m.memberId.toLowerCase().includes(memberSearch.toLowerCase())) ||
            (m.phone && m.phone.includes(memberSearch))
        );
    }, [memberSearch, members]);

    // --- LOGIC CART ---
    const addToCart = (product) => {
        if (product.stock <= 0) return showAlert.warning("Stok Habis", "Produk ini tidak bisa dipilih.");

        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            if (existing.qty + 1 > product.stock) return showAlert.warning("Stok Terbatas", "Jumlah melebihi stok yang tersedia.");
            setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const product = products.find(p => p.id === id);
                if (delta > 0 && item.qty + 1 > product.stock) {
                    showAlert.warning("Batas Stok", "Stok produk tidak mencukupi.");
                    return item;
                }
                const newQty = Math.max(0, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }).filter(item => item.qty > 0));
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

    // --- CALCULATIONS ---
    const subTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
    const taxRateValue = storeSettings?.taxRate ? Number(storeSettings.taxRate) / 100 : 0.14;
    const taxAmount = subTotal * taxRateValue;
    const grandTotal = subTotal + taxAmount;

    const deficit = Math.max(0, grandTotal - cashGiven);
    const change = Math.max(0, cashGiven - grandTotal);
    const isCashSufficient = cashGiven >= grandTotal;

    // --- HELPERS ---
    const formatNumber = (num) => num.toLocaleString('id-ID');
    const handleCashInput = (e) => setCashGiven(Number(e.target.value.replace(/\D/g, '')));
    const getImageUrl = (path) => !path ? null : (path.startsWith('http') ? path : `${API_URL}${path}`);

    // --- PRINT LOGIC ---
    const handlePrintReceipt = () => {
        setIsPrinting(true);
        // Jeda 800ms agar data selesai ter-render di template struk
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 800);
    };

    // --- TRANSAKSI ---
    const handleProcessTransaction = async (type) => {
        setIsProcessing(true);
        try {
            const token = localStorage.getItem('token');
            const userId = currentUser ? currentUser.id : 1;

            const payload = {
                userId: userId,
                customerId: selectedMember ? selectedMember.id : null,
                items: cart.map(c => ({ productId: c.id, qty: c.qty })),
                payment: { type: type, amount: grandTotal }
            };

            const res = await fetch(`${API_URL}/api/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(payload)
            });

            const resJson = await res.json();
            if (!resJson.success) throw new Error(resJson.message);

            // Simpan data lengkap untuk struk (transaction + items + store info)
            setLastTrxData(resJson.data);

            if (type === 'QRIS' && resJson.data.midtransToken) {
                window.snap.pay(resJson.data.midtransToken, {
                    onSuccess: function (result) {
                        setPaymentStep('SUCCESS');
                        // Cek pengaturan cetak otomatis
                        if (resJson.data.store?.autoPrintReceipt) handlePrintReceipt();
                        showAlert.success("Pembayaran Sukses", "Transaksi QRIS berhasil!");
                    },
                    onPending: function (result) {
                        setPaymentStep('SUCCESS');
                        handlePrintReceipt();
                        showAlert.info("Menunggu", "Pembayaran sedang diproses.");
                    },
                    onError: function (result) {
                        showAlert.error("Gagal", "Pembayaran gagal.");
                    },
                    onClose: function () {
                        showAlert.warning("Dibatalkan", "Anda menutup popup pembayaran.");
                    }
                });
            } else {
                // Transaksi CASH
                setPaymentStep('SUCCESS');
                if (resJson.data.store?.autoPrintReceipt) handlePrintReceipt();
                showAlert.success("Pembayaran Sukses", "Transaksi berhasil disimpan.");
            }

        } catch (error) {
            showAlert.error("Transaksi Gagal", error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentOpen = () => {
        setPaymentStep('SELECT');
        setPaymentMethod('');
        setCashGiven(0);
        setIsPaymentModalOpen(true);
    }

    const resetTransaction = () => {
        setIsPaymentModalOpen(false);
        setCart([]);
        setSelectedMember(null);
        setMobileView('menu');
        setLastTrxData(null);
        window.location.reload();
    }

    const handleMemberSelect = (member) => {
        setSelectedMember(member);
        setIsMemberModalOpen(false);
        setMemberSearch('');
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">

            {/* --- CSS PRINT ENGINE (FIXED) --- */}
            <style>{`
                @media print {
                    /* Sembunyikan SEMUA elemen termasuk layout admin */
                    body * { visibility: hidden; }
                    
                    /* Tampilkan HANYA elemen struk dan isinya */
                    #receipt-print, #receipt-print * { visibility: visible; }
                    
                    #receipt-print {
                        display: block !important;
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 58mm; /* Lebar standar printer thermal mini */
                        padding: 2mm;
                        background: white;
                        color: black;
                        font-family: 'Courier New', Courier, monospace;
                        font-size: 10px;
                        line-height: 1.2;
                        height: auto;
                    }
                    
                    /* Hilangkan margin default browser */
                    @page { margin: 0; size: auto; }
                }
            `}</style>

            {/* KIRI: HEADER + KATEGORI + PRODUK */}
            <div className={`flex-1 flex flex-col min-w-0 relative ${mobileView !== 'menu' ? 'hidden lg:flex' : 'flex'}`}>
                <Header search={search} setSearch={setSearch} currentUser={currentUser} />
                <CategoryFilter categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-6 bg-gray-50/50 pb-32 lg:pb-6">
                    <ProductGrid products={filteredProducts} addToCart={addToCart} getImageUrl={getImageUrl} />
                </div>
            </div>

            {/* KANAN: SIDEBAR */}
            <CartSidebar
                cart={cart}
                mobileView={mobileView}
                setMobileView={setMobileView}
                selectedMember={selectedMember}
                setSelectedMember={setSelectedMember}
                setIsMemberModalOpen={setIsMemberModalOpen}
                removeFromCart={removeFromCart}
                updateQty={updateQty}
                handlePaymentOpen={handlePaymentOpen}
                setCart={setCart}
                getImageUrl={getImageUrl}
                grandTotal={grandTotal}
                subTotal={subTotal}
                taxAmount={taxAmount}
                taxRate={taxRateValue * 100}
                handleLogout={() => {
                    if (confirm('Keluar?')) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        router.push('/login');
                    }
                }}
            />

            {/* MODALS */}
            <MemberModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} memberSearch={memberSearch} setMemberSearch={setMemberSearch} filteredMembers={filteredMembers} handleMemberSelect={handleMemberSelect} getImageUrl={getImageUrl} />
            <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} paymentStep={paymentStep} setPaymentStep={setPaymentStep} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} cashGiven={cashGiven} handleCashInput={handleCashInput} isCashSufficient={isCashSufficient} change={change} deficit={deficit} handleProcessTransaction={handleProcessTransaction} resetTransaction={resetTransaction} isProcessing={isProcessing} isPrinting={isPrinting} grandTotal={grandTotal} formatNumber={formatNumber} />

            {/* --- HIDDEN RECEIPT TEMPLATE (STRUK FISIK) --- */}
            {lastTrxData && (
                <div id="receipt-print" style={{ display: 'none' }}>
                    <div style={{ textAlign: 'center' }}>
                        {lastTrxData.store?.logoUrl && (
                            <img src={lastTrxData.store.logoUrl} alt="Store Logo" style={{ maxWidth: '30mm', marginBottom: '5px' }} />
                        )}
                        <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{lastTrxData.store?.storeName || 'SAVORIA BISTRO'}</h2>
                        <p style={{ fontSize: '9px', margin: '2px 0' }}>{lastTrxData.store?.address || 'Jakarta, Indonesia'}</p>
                        <p style={{ fontSize: '9px', margin: 0 }}>{lastTrxData.store?.phone || ''}</p>
                    </div>
                    <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>
                    <div style={{ fontSize: '9px' }}>
                        <div>INV : {lastTrxData.transaction.invoiceNumber}</div>
                        <div>TGL : {new Date(lastTrxData.transaction.createdAt).toLocaleString('id-ID')}</div>
                        <div>KASIR: {lastTrxData.transaction.user?.name || 'Staff'}</div>
                        <div>CUST : {lastTrxData.transaction.customer?.name || 'Guest'}</div>
                    </div>
                    <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>
                    <div style={{ fontSize: '9px' }}>
                        {lastTrxData.transaction.items.map((item, i) => (
                            <div key={i} style={{ marginBottom: '5px' }}>
                                <div style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{item.product?.name}</div>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Pajak ({lastTrxData.store?.taxRate || 14}%)</span>
                            <span>{Number(lastTrxData.transaction.taxAmount).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11px', marginTop: '5px' }}>
                            <span>TOTAL</span>
                            <span>Rp {Number(lastTrxData.transaction.grandTotal).toLocaleString()}</span>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>
                    <div style={{ textAlign: 'center', fontSize: '8px' }}>
                        <p>{lastTrxData.store?.receiptFooter || 'Terima kasih atas kunjungan Anda!'}</p>
                        <p style={{ marginTop: '5px', fontSize: '6px', opacity: 0.5 }}>Powered by Nands Enterprise POS</p>
                    </div>
                </div>
            )}
        </div>
    );
}