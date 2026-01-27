"use client";

import { useState, useEffect, Suspense } from 'react';
import { ArrowRight, ArrowLeft, ShieldCheck, Loader2, RefreshCw, Timer } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { showAlert } from '@/utils/swal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function OTPForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) setEmail(emailParam);
    }, [searchParams]);

    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpCode })
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                showAlert.success("Berhasil", "Anda berhasil masuk!");

                if (data.user.role === 'ADMIN') router.push('/categories');
                else router.push('/pos');
            } else {
                showAlert.error("Gagal", data.message || "OTP salah atau kadaluarsa.");
            }
        } catch (error) {
            showAlert.error("Error", "Gagal verifikasi ke server.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;
        setIsResending(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (data.success) {
                showAlert.success("Terkirim", "Kode OTP baru telah dikirim.");
                setOtpCode('');
                setTimeLeft(10);
                setCanResend(false);
            } else {
                showAlert.error("Gagal", data.message);
            }
        } catch (error) {
            showAlert.error("Error", "Gagal menghubungi server.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <Link href="/login" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 transition-colors font-medium text-sm w-fit">
                <ArrowLeft size={18} /> Kembali ke Login
            </Link>

            <div className="text-center space-y-2 mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
                    <ShieldCheck size={32} />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Verifikasi OTP</h1>
                <p className="text-gray-500 text-sm">
                    Kode dikirim ke <span className="font-bold text-gray-800">{email}</span>
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleOtpSubmit}>
                <div className="space-y-4">
                    <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center text-4xl font-bold tracking-[0.5em] py-4 border-b-2 border-gray-200 focus:border-orange-500 outline-none transition-all text-gray-800"
                        placeholder="••••••"
                        autoFocus
                        required
                    />

                    <div className="flex justify-center items-center gap-2">
                        <Timer size={14} className={timeLeft > 0 ? "text-orange-500 animate-pulse" : "text-gray-300"} />
                        <span className={`text-xs font-bold font-mono ${timeLeft > 0 ? "text-orange-600" : "text-gray-400"}`}>
                            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Verifikasi Sekarang"}
                </button>
            </form>

            <div className="text-center mt-8">
                <p className="text-sm text-gray-500 font-medium">
                    Tidak menerima kode?{' '}
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={!canResend || isResending}
                        className={`font-bold transition-colors ${canResend ? 'text-orange-600 hover:underline' : 'text-gray-300 cursor-not-allowed'}`}
                    >
                        {isResending ? <RefreshCw size={14} className="animate-spin inline mr-1" /> : null}
                        Kirim Ulang
                    </button>
                </p>
            </div>
        </div>
    );
}

export default function OTPPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OTPForm />
        </Suspense>
    )
}