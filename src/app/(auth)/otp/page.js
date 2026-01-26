"use client";

import { useState, useEffect, Suspense } from 'react';
import { ArrowRight, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

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
            
            if (data.user.role === 'ADMIN') {
                router.push('/categories');
            } else {
                router.push('/pos'); 
            }

        } else {
            showAlert.error("Gagal", data.message || "Kode OTP salah atau kadaluarsa.");
        }

    } catch (error) {
        console.error(error);
        showAlert.error("Error", "Gagal verifikasi ke server.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
        <Link 
            href="/login"
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 transition-colors font-medium text-sm w-fit"
        >
            <ArrowLeft size={18} /> Kembali ke Login
        </Link>

        <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
                <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Verifikasi OTP</h1>
            <p className="text-gray-500 text-sm">
                Masukkan 6 digit kode yang telah kami kirimkan ke email <br/>
                <span className="font-bold text-gray-800">{email || 'email Anda'}</span>
            </p>
        </div>

        <form className="space-y-6" onSubmit={handleOtpSubmit}>
            <div className="flex justify-center">
                <input 
                    type="text" 
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-4xl font-bold tracking-[0.5em] py-4 border-b-2 border-gray-200 focus:border-orange-500 outline-none transition-all placeholder:tracking-normal placeholder:text-base placeholder:font-normal text-gray-800"
                    placeholder="• • • • • •"
                    autoFocus
                    required
                />
            </div>

            <button 
                type="submit"
                disabled={isLoading || otpCode.length < 6}
                className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? <Loader2 className="animate-spin"/> : <>Verifikasi <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
            </button>
        </form>

        <div className="text-center mt-8">
            <p className="text-sm text-gray-500 font-medium">
                Tidak menerima kode? <button className="text-orange-600 font-bold hover:underline">Kirim Ulang</button>
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