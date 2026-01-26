"use client";

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { showAlert } from '@/utils/swal'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            showAlert.success("Verifikasi", "Kode OTP telah dikirim ke email Anda.");
            
            router.push(`/otp?email=${encodeURIComponent(email)}`);
        } else {
            showAlert.error("Gagal", data.message || "Login gagal.");
        }

    } catch (err) {
        console.error(err);
        showAlert.error("Error", "Gagal terhubung ke server backend.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
                <Lock size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Login POS</h1>
            <p className="text-gray-500 text-sm">Masuk sebagai Admin atau Kasir</p>
        </div>

        <form className="space-y-6 mt-6" onSubmit={handleLoginSubmit}>
            <div className="group relative transition-all">
                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${email ? 'border-orange-500 bg-orange-50/10' : 'border-gray-100 bg-white group-hover:border-gray-300'}`}>
                    <Mail className="w-5 h-5 text-gray-400" />
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="flex-1 bg-transparent outline-none text-gray-800 font-medium placeholder:text-gray-300" 
                        placeholder="Email Address" 
                        required 
                    />
                </div>
            </div>

            <div className="group relative transition-all">
                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${password ? 'border-orange-500 bg-orange-50/10' : 'border-gray-100 bg-white group-hover:border-gray-300'}`}>
                    <Lock className="w-5 h-5 text-gray-400" />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="flex-1 bg-transparent outline-none text-gray-800 font-medium placeholder:text-gray-300" 
                        placeholder="Password" 
                        required 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} className="text-gray-400"/> : <Eye size={20} className="text-gray-400"/>}
                    </button>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : <>Masuk Sekarang <ArrowRight size={20} /></>}
            </button>
        </form>

        <div className="text-center mt-8">
            <p className="text-sm text-gray-500 font-medium">
                Belum punya akun? <Link href="/register" className="text-orange-600 font-bold hover:underline">Hubungi Admin</Link>
            </p>
        </div>
    </div>
  );
}