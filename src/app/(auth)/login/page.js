"use client";

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi API Login
    setTimeout(() => {
        setIsLoading(false);
        // Redirect ke halaman OTP, sambil bawa email di query param biar UX bagus
        router.push(`/otp?email=${encodeURIComponent(email)}`);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
        {/* Header */}
        <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Selamat Datang!</h1>
            <p className="text-gray-500 text-sm">Masuk untuk mengelola restoran Anda.</p>
        </div>

        {/* Form */}
        <form className="space-y-6 mt-8" onSubmit={handleLoginSubmit}>
            {/* Email Input */}
            <div className="group relative transition-all">
                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${email ? 'border-orange-500 bg-orange-50/10' : 'border-gray-100 bg-white group-hover:border-gray-300'}`}>
                    <Mail className={`w-5 h-5 transition-colors ${email ? 'text-orange-500' : 'text-gray-400'}`} />
                    <div className="h-6 w-[1px] bg-gray-200"></div>
                    <div className="flex-1 relative">
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="peer w-full bg-transparent outline-none text-gray-800 font-medium placeholder-transparent z-10 relative"
                            placeholder="Email Address"
                            required
                        />
                        <label 
                            htmlFor="email"
                            className={`absolute left-0 transition-all duration-200 pointer-events-none text-gray-400 font-medium
                                ${email 
                                    ? '-top-5 text-xs text-orange-500 font-bold' 
                                    : 'top-0 text-sm peer-focus:-top-5 peer-focus:text-xs peer-focus:text-orange-500 peer-focus:font-bold'
                                }
                            `}
                        >
                            Alamat Email
                        </label>
                    </div>
                </div>
            </div>

            {/* Password Input */}
            <div className="group relative transition-all">
                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${password ? 'border-orange-500 bg-orange-50/10' : 'border-gray-100 bg-white group-hover:border-gray-300'}`}>
                    <Lock className={`w-5 h-5 transition-colors ${password ? 'text-orange-500' : 'text-gray-400'}`} />
                    <div className="h-6 w-[1px] bg-gray-200"></div>
                    <div className="flex-1 relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="peer w-full bg-transparent outline-none text-gray-800 font-medium placeholder-transparent z-10 relative tracking-wider"
                            placeholder="Password"
                            required
                        />
                        <label 
                            htmlFor="password"
                            className={`absolute left-0 transition-all duration-200 pointer-events-none text-gray-400 font-medium
                                ${password 
                                    ? '-top-5 text-xs text-orange-500 font-bold' 
                                    : 'top-0 text-sm peer-focus:-top-5 peer-focus:text-xs peer-focus:text-orange-500 peer-focus:font-bold'
                                }
                            `}
                        >
                            Kata Sandi
                        </label>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <div className="flex justify-end">
                <Link href="#" className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                    Lupa Password?
                </Link>
            </div>

            <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    <>
                        Masuk Sekarang
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>

        <div className="text-center mt-8">
            <p className="text-sm text-gray-500 font-medium">
                Belum punya akun? <Link href="#" className="text-orange-600 font-bold hover:underline">Hubungi Admin</Link>
            </p>
        </div>
    </div>
  );
}