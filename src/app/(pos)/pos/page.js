"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';

// Components
import Header from '@/components/pos/Header';
import CategoryFilter from '@/components/pos/CategoryFilter';
import ProductGrid from '@/components/pos/ProductGrid';
import CartSidebar from '@/components/pos/CartSidebar';
import MemberModal from '@/components/pos/MemberModal';
import PaymentModal from '@/components/pos/PaymentModal';
import { ReceiptPrint } from '@/components/pos/ReceiptPrint'; // Import komponen baru

import { showAlert } from '@/utils/swal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

export default function POSPage() {
    const router = useRouter();

    // --- Refs ---
    const printTriggeredRef = useRef(false);
    const contentRef = useRef(null); // Ref untuk ReceiptPrint

    // --- States ---
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

    // --- Printing Logic with react-to-print ---
    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `Receipt-${lastTrxData?.transaction?.invoiceNumber}`,
        onAfterPrint: () => {
            setIsPrinting(false);
            console.log("🖨️ Selesai cetak.");
        },
        onPrintError: (error) => {
            console.error("❌ Print Error:", error);
            setIsPrinting(false);
        }
    });

    // --- Fetch Initial Data ---
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
                console.error("Error fetching data:", error);
                showAlert.error("Gagal Memuat Data", "Cek koneksi backend.");
            }
        };

        fetchData();

        // Midtrans Snap Script
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) document.body.removeChild(script);
        }
    }, []);

    // --- Auto Print Trigger ---
    useEffect(() => {
        if (lastTrxData && paymentStep === 'SUCCESS' && lastTrxData.store?.autoPrintReceipt && !printTriggeredRef.current) {
            console.log('📄 Triggering Auto Print...');
            printTriggeredRef.current = true;
            setIsPrinting(true);

            // Jeda sedikit untuk memastikan DOM komponen ReceiptPrint sudah siap
            setTimeout(() => {
                handlePrint();
            }, 800);
        }
    }, [lastTrxData, paymentStep, handlePrint]);

    // --- Memoized Filters ---
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

    // --- Cart Actions ---
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
                const product = products.find(p => p.id === id);
                if (delta > 0 && item.qty + 1 > product.stock) return item;
                return { ...item, qty: Math.max(0, item.qty + delta) };
            }
            return item;
        }).filter(item => item.qty > 0));
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

    // --- Totals ---
    const subTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
    const serviceRate = storeSettings?.serviceCharge ? Number(storeSettings.serviceCharge) / 100 : 0.01;
    const taxRate = storeSettings?.taxRate ? Number(storeSettings.taxRate) / 100 : 0.14;
    const serviceAmount = Math.round(subTotal * serviceRate);
    const taxAmount = Math.round((subTotal + serviceAmount) * taxRate);
    const grandTotal = subTotal + serviceAmount + taxAmount;

    const change = Math.max(0, cashGiven - grandTotal);
    const deficit = Math.max(0, grandTotal - cashGiven);
    const isCashSufficient = cashGiven >= grandTotal;

    // --- Handlers ---
    const formatNumber = (num) => num.toLocaleString('id-ID');
    const handleCashInput = (e) => setCashGiven(Number(e.target.value.replace(/\D/g, '')));
    const getImageUrl = (path) => !path ? null : (path.startsWith('http') ? path : `${API_URL}${path}`);

    const handleProcessTransaction = async (type) => {
        setIsProcessing(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                userId: currentUser?.id || 1,
                customerId: selectedMember?.id || null,
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

            setLastTrxData(resJson.data);

            if (type === 'QRIS' && resJson.data.midtransToken) {
                window.snap.pay(resJson.data.midtransToken, {
                    onSuccess: () => { setPaymentStep('SUCCESS'); showAlert.success("Sukses", "Pembayaran QRIS berhasil!"); },
                    onPending: () => { setPaymentStep('SUCCESS'); showAlert.info("Pending", "Menunggu pembayaran."); },
                    onError: () => showAlert.error("Gagal", "Pembayaran gagal."),
                });
            } else {
                setPaymentStep('SUCCESS');
                showAlert.success("Sukses", "Transaksi tunai berhasil!");
            }
        } catch (error) {
            console.error('❌ Transaction Error:', error);
            showAlert.error("Transaksi Gagal", error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const resetTransaction = () => {
        setIsPaymentModalOpen(false);
        setCart([]);
        setSelectedMember(null);
        setLastTrxData(null);
        setPaymentStep('SELECT');
        printTriggeredRef.current = false;
        // Opsional: window.location.reload() jika ingin benar-benar fresh
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">

            {/* Main POS Interface */}
            <div className={`flex-1 flex flex-col min-w-0 relative ${mobileView !== 'menu' ? 'hidden lg:flex' : 'flex'}`}>
                <Header search={search} setSearch={setSearch} currentUser={currentUser} />
                <CategoryFilter categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

                <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-6 bg-gray-50/50 pb-32 lg:pb-6">
                    <ProductGrid products={filteredProducts} addToCart={addToCart} getImageUrl={getImageUrl} />
                </div>
            </div>

            <CartSidebar
                cart={cart} mobileView={mobileView} setMobileView={setMobileView}
                selectedMember={selectedMember} setSelectedMember={setSelectedMember}
                setIsMemberModalOpen={setIsMemberModalOpen} removeFromCart={removeFromCart}
                updateQty={updateQty} handlePaymentOpen={() => { setPaymentStep('SELECT'); setCashGiven(0); setIsPaymentModalOpen(true); }}
                setCart={setCart} getImageUrl={getImageUrl} grandTotal={grandTotal}
                subTotal={subTotal} taxAmount={taxAmount} taxRate={taxRate * 100}
                handleLogout={() => { if (confirm('Keluar?')) { localStorage.clear(); router.push('/login'); } }}
            />

            {/* Modals */}
            <MemberModal
                isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)}
                memberSearch={memberSearch} setMemberSearch={setMemberSearch}
                filteredMembers={filteredMembers} handleMemberSelect={(m) => { setSelectedMember(m); setIsMemberModalOpen(false); }}
                getImageUrl={getImageUrl}
            />

            <PaymentModal
                isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)}
                paymentStep={paymentStep} setPaymentStep={setPaymentStep}
                paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                cashGiven={cashGiven} handleCashInput={handleCashInput}
                isCashSufficient={isCashSufficient} change={change} deficit={deficit}
                handleProcessTransaction={handleProcessTransaction} resetTransaction={resetTransaction}
                isProcessing={isProcessing} isPrinting={isPrinting} grandTotal={grandTotal}
                formatNumber={formatNumber} currentInvoiceNumber={lastTrxData?.transaction?.invoiceNumber}
                handleManualPrint={handlePrint} // Tambahkan tombol manual print di modal sukses jika perlu
            />

            {/* Hidden Printing Component */}
            <div className="hidden">
                <div ref={contentRef}>
                    {lastTrxData && <ReceiptPrint data={lastTrxData} />}
                </div>
            </div>
        </div>
    );
}