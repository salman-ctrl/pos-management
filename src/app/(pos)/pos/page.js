"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/pos/Header';
import CategoryFilter from '@/components/pos/CategoryFilter';
import ProductGrid from '@/components/pos/ProductGrid';
import CartSidebar from '@/components/pos/CartSidebar';
import MemberModal from '@/components/pos/MemberModal';
import PaymentModal from '@/components/pos/PaymentModal';

import { showAlert } from '@/utils/swal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

export default function POSPage() {
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [members, setMembers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [storeSettings, setStoreSettings] = useState(null);

    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [mobileView, setMobileView] = useState('menu');

    const [selectedMember, setSelectedMember] = useState(null);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [memberSearch, setMemberSearch] = useState('');

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentStep, setPaymentStep] = useState('SELECT');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cashGiven, setCashGiven] = useState(0);
    const [isPrinting, setIsPrinting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [lastTrxData, setLastTrxData] = useState(null);

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

        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) document.body.removeChild(script);
        }
    }, []);

    useEffect(() => {
        console.log('🖨️ Print Check:', {
            hasData: !!lastTrxData,
            step: paymentStep,
            shouldPrint: lastTrxData?.store?.autoPrintReceipt,
            isPrinting
        });

        if (lastTrxData && paymentStep === 'SUCCESS' && lastTrxData.store?.autoPrintReceipt && !isPrinting) {
            console.log('📄 Data Transaksi untuk Print:', lastTrxData);

            setIsPrinting(true);

            const timer = setTimeout(() => {
                console.log('🖨️ Memulai Print...');
                window.print();

                setTimeout(() => {
                    setIsPrinting(false);
                }, 1000);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [lastTrxData, paymentStep]);

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
            (m.memberId && m.memberId.toLowerCase().includes(memberSearch.toLowerCase())) ||
            (m.phone && m.phone.includes(memberSearch))
        );
    }, [memberSearch, members]);

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

    const subTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
    const serviceRate = storeSettings?.serviceCharge ? Number(storeSettings.serviceCharge) / 100 : 0.01;
    const taxRate = storeSettings?.taxRate ? Number(storeSettings.taxRate) / 100 : 0.14;

    const serviceAmount = Math.round(subTotal * serviceRate);
    const taxAmount = Math.round((subTotal + serviceAmount) * taxRate);
    const grandTotal = subTotal + serviceAmount + taxAmount;

    const deficit = Math.max(0, grandTotal - cashGiven);
    const change = Math.max(0, cashGiven - grandTotal);
    const isCashSufficient = cashGiven >= grandTotal;

    const formatNumber = (num) => num.toLocaleString('id-ID');
    const handleCashInput = (e) => setCashGiven(Number(e.target.value.replace(/\D/g, '')));
    const getImageUrl = (path) => !path ? null : (path.startsWith('http') ? path : `${API_URL}${path}`);

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

            console.log('✅ Response dari Backend:', resJson.data);

            setLastTrxData(resJson.data);

            if (type === 'QRIS' && resJson.data.midtransToken) {
                window.snap.pay(resJson.data.midtransToken, {
                    onSuccess: function (result) {
                        console.log('💳 QRIS Payment Success');
                        setPaymentStep('SUCCESS');
                        showAlert.success("Pembayaran Sukses", "Transaksi QRIS berhasil!");
                    },
                    onPending: function (result) {
                        console.log('⏳ QRIS Payment Pending');
                        setPaymentStep('SUCCESS');
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
                console.log('💵 Cash Payment Success');
                setPaymentStep('SUCCESS');
                showAlert.success("Pembayaran Sukses", "Transaksi tunai berhasil disimpan.");
            }

        } catch (error) {
            console.error('❌ Transaction Error:', error);
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
        setPaymentStep('SELECT');
        setIsPrinting(false);
        window.location.reload();
    }

    const handleMemberSelect = (member) => {
        setSelectedMember(member);
        setIsMemberModalOpen(false);
        setMemberSearch('');
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">
            <style>{`
    #receipt-print {
        position: absolute;
        opacity: 0;
        pointer-events: none;
        z-index: -1;
    }
    
    @media print {
        html, body {
            height: auto;
            overflow: visible;
        }
        
        body * {
            visibility: hidden !important;
        }
        
        #receipt-print {
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            opacity: 1 !important;
            z-index: 9999 !important;
            display: block !important;
            width: 58mm !important;
            padding: 4mm !important;
            background: white !important;
            color: black !important;
            font-family: 'Courier New', Courier, monospace !important;
            font-size: 10px !important;
            line-height: 1.4 !important;
        }
        
        #receipt-print * {
            visibility: visible !important;
        }
        
        @page {
            size: 58mm auto;
            margin: 0;
        }
    }
`}</style>

            <div className={`flex-1 flex flex-col min-w-0 relative ${mobileView !== 'menu' ? 'hidden lg:flex' : 'flex'}`}>
                <Header
                    search={search}
                    setSearch={setSearch}
                    currentUser={currentUser}
                />

                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-6 bg-gray-50/50 pb-32 lg:pb-6">
                    <ProductGrid
                        products={filteredProducts}
                        addToCart={addToCart}
                        getImageUrl={getImageUrl}
                    />
                </div>
            </div>

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
                taxRate={taxRate * 100}
                handleLogout={() => {
                    if (confirm('Keluar?')) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        router.push('/login');
                    }
                }}
            />

            <MemberModal
                isOpen={isMemberModalOpen}
                onClose={() => setIsMemberModalOpen(false)}
                memberSearch={memberSearch}
                setMemberSearch={setMemberSearch}
                filteredMembers={filteredMembers}
                handleMemberSelect={handleMemberSelect}
                getImageUrl={getImageUrl}
            />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                paymentStep={paymentStep}
                setPaymentStep={setPaymentStep}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                cashGiven={cashGiven}
                handleCashInput={handleCashInput}
                isCashSufficient={isCashSufficient}
                change={change}
                deficit={deficit}
                handleProcessTransaction={handleProcessTransaction}
                resetTransaction={resetTransaction}
                isProcessing={isProcessing}
                isPrinting={isPrinting}
                grandTotal={grandTotal}
                formatNumber={formatNumber}
                currentInvoiceNumber={lastTrxData?.transaction?.invoiceNumber}
            />

            {lastTrxData && (
                <div id="receipt-print">
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                        {lastTrxData.store?.logoUrl && (
                            <img src={lastTrxData.store.logoUrl} alt="Logo" style={{ maxWidth: '35mm', marginBottom: '8px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                        )}
                        <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>{lastTrxData.store?.storeName || 'NANDS STORE'}</h2>
                        <p style={{ fontSize: '9px', margin: '2px 0' }}>{lastTrxData.store?.address || 'Jakarta, Indonesia'}</p>
                        <p style={{ fontSize: '9px', margin: 0 }}>{lastTrxData.store?.phone || ''}</p>
                    </div>
                    <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }}></div>
                    <div style={{ fontSize: '10px' }}>
                        <div>INV : {lastTrxData.transaction?.invoiceNumber || '-'}</div>
                        <div>TGL : {lastTrxData.transaction?.createdAt ? new Date(lastTrxData.transaction.createdAt).toLocaleString('id-ID') : '-'}</div>
                        <div>KASIR: {lastTrxData.transaction?.user?.name || 'Staff'}</div>
                        <div>CUST : {lastTrxData.transaction?.customer?.name || 'UMUM'}</div>
                    </div>
                    <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }}></div>
                    <div style={{ fontSize: '10px' }}>
                        {lastTrxData.transaction?.items?.map((item, i) => (
                            <div key={i} style={{ marginBottom: '6px' }}>
                                <div style={{ fontWeight: 'bold' }}>{item.product?.name || 'Menu'}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{item.qty} x {Number(item.price).toLocaleString('id-ID')}</span>
                                    <span>{(item.qty * Number(item.price)).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        )) || <div>Tidak ada item</div>}
                    </div>
                    <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }}></div>
                    <div style={{ fontSize: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Subtotal</span>
                            <span>{Number(lastTrxData.transaction?.subTotal || 0).toLocaleString('id-ID')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Service ({lastTrxData.store?.serviceCharge || 1}%)</span>
                            <span>{Math.round((lastTrxData.transaction?.subTotal || 0) * ((lastTrxData.store?.serviceCharge || 1) / 100)).toLocaleString('id-ID')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Pajak ({lastTrxData.store?.taxRate || 14}%)</span>
                            <span>{Number(lastTrxData.transaction?.taxAmount || 0).toLocaleString('id-ID')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12px', marginTop: '6px' }}>
                            <span>TOTAL</span>
                            <span>Rp {Number(lastTrxData.transaction?.grandTotal || 0).toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px dashed #000', margin: '12px 0' }}></div>
                    <div style={{ textAlign: 'center', fontSize: '9px' }}>
                        <p>{lastTrxData.store?.receiptFooter || 'Terima kasih atas kunjungan Anda!'}</p>
                        <p style={{ marginTop: '8px', opacity: 0.4 }}>Powered by Nands POS</p>
                    </div>
                </div>
            )}
        </div>
    );
}